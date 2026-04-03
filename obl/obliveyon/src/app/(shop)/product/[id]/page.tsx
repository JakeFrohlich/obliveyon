import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  // All products use static routes — redirect unknown IDs to 404
  if (id !== "the-original-obliveyon") {
    notFound();
  }
  notFound();
}
