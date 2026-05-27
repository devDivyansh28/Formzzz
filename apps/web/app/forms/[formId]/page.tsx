import { FormBuilder } from "~/components/forms/form-builder";

type PageProps = {
  params: Promise<{
    formId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { formId } = await params;

  return <FormBuilder formId={formId} />;
}
