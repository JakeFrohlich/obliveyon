import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PatchSchema = z.object({
  name: z.string().min(1).max(80).nullable().optional(),
  avatarEmoji: z.string().min(1).max(8).nullable().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      avatarEmoji: true,
      createdAt: true,
      role: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data: { name?: string | null; avatarEmoji?: string | null } = {};
  if ("name" in parsed.data) {
    data.name = parsed.data.name?.trim() || null;
  }
  if ("avatarEmoji" in parsed.data) {
    data.avatarEmoji = parsed.data.avatarEmoji?.trim() || null;
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      avatarEmoji: true,
      createdAt: true,
      role: true,
    },
  });

  return NextResponse.json(user);
}
