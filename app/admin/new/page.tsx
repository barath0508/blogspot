import { AdminPostEditor } from "@/components/AdminPostEditor";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Create New Post</h1>
      <AdminPostEditor mode="create" />
    </div>
  );
}
