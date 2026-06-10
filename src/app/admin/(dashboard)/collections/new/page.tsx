import { PageHeader } from "@/components/admin/AdminForm";
import { CollectionForm } from "@/components/admin/CollectionForm";

export default function NewCollectionPage() {
  return (
    <>
      <PageHeader title="Create Collection" description="Group products into a curated collection." />
      <CollectionForm />
    </>
  );
}
