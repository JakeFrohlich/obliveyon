import "server-only";

const SHOPIFY_API_VERSION = "2024-10";

type ShopifyOrdersResponse = {
  data?: {
    orders: {
      edges: {
        node: {
          id: string;
          displayFinancialStatus: string | null;
          lineItems: {
            edges: {
              node: { quantity: number };
            }[];
          };
        };
      }[];
    };
  };
  errors?: { message: string }[];
};

export async function getPieceCountForEmail(email: string): Promise<number> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !token) {
    return 0;
  }

  const query = `
    query OrdersByEmail($q: String!) {
      orders(first: 100, query: $q) {
        edges {
          node {
            id
            displayFinancialStatus
            lineItems(first: 50) {
              edges { node { quantity } }
            }
          }
        }
      }
    }
  `;

  const sanitized = email.replace(/"/g, '\\"');

  try {
    const res = await fetch(`https://${domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables: { q: `email:${sanitized}` },
      }),
      cache: "no-store",
    });

    if (!res.ok) return 0;

    const json: ShopifyOrdersResponse = await res.json();
    if (json.errors?.length) return 0;

    const orders = json.data?.orders.edges ?? [];
    let total = 0;
    for (const { node } of orders) {
      const status = node.displayFinancialStatus;
      if (status !== "PAID" && status !== "PARTIALLY_REFUNDED") continue;
      for (const item of node.lineItems.edges) {
        total += item.node.quantity;
      }
    }
    return total;
  } catch {
    return 0;
  }
}
