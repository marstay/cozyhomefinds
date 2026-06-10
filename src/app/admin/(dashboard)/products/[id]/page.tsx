"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Product } from "@/lib/types";
import { PageHeader } from "@/components/admin/AdminForm";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [id]);

  if (!product) return <p className="text-muted">Loading...</p>;

  return (
    <>
      <PageHeader title="Edit Product" description={product.title} />
      <ProductForm product={product} />
    </>
  );
}
