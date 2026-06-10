import { PageHeader } from "@/components/admin/AdminForm";
import { AmazonImportPanel } from "@/components/admin/AmazonImportPanel";

export default function ImportProductsPage() {
  return (
    <>
      <PageHeader
        title="Import from Amazon"
        description="Automatically fetch product details by URL, bulk import, or keyword search."
      />
      <AmazonImportPanel />
    </>
  );
}
