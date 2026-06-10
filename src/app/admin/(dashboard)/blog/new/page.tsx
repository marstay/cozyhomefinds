import { PageHeader } from "@/components/admin/AdminForm";
import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <>
      <PageHeader title="New Blog Post" description="Write a new decor article or guide." />
      <BlogForm />
    </>
  );
}
