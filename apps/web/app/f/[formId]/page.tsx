import { PublicForm } from "~/components/forms/public-form";

type PageProps = {
  params: Promise<{
    formId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { formId } = await params;

  return <PublicForm formId={formId} />;
}
