import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Verify products exist and calculate real prices
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const lineItems = items.map(
      (item: { productId: string; quantity: number; size: string }) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: `Size: ${item.size}`,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: item.quantity,
        };
      }
    );

    const totalPrice = items.reduce(
      (
        sum: number,
        item: { productId: string; quantity: number }
      ) => {
        const product = products.find((p) => p.id === item.productId);
        return sum + (product?.price || 0) * item.quantity;
      },
      0
    );

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        userId: session.user.id!,
        totalPrice,
        status: "PENDING",
        items: {
          create: items.map(
            (item: {
              productId: string;
              quantity: number;
              size: string;
            }) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
                price: product.price,
              };
            }
          ),
        },
      },
    });

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: { orderId: order.id },
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
