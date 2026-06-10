import { PageHeader } from "@/components/admin/AdminForm";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="Add Product" description="Import a new Amazon product to your store." />
      <ProductForm />
    </>
  );
}
