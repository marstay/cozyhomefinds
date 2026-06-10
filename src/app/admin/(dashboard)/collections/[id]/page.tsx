"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Collection } from "@/lib/types";
import { PageHeader } from "@/components/admin/AdminForm";
import { CollectionForm } from "@/components/admin/CollectionForm";

export default function EditCollectionPage() {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => {
    fetch(`/api/admin/collections/${id}`)
      .then((r) => r.json())
      .then(setCollection);
  }, [id]);

  if (!collection) return <p className="text-muted">Loading...</p>;

  return (
    <>
      <PageHeader title="Edit Collection" description={collection.title} />
      <CollectionForm collection={collection} />
    </>
  );
}
