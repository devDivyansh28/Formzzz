"use client";

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { FieldControl } from "~/components/forms/field-control";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { getForm, submitForm } from "~/hooks/api/forms";

type PublicFormProps = {
  formId: string;
};

export function PublicForm({ formId }: PublicFormProps) {
  const useGetForm = getForm();
  const { data: form, isLoading } = useGetForm({ formId });
  const { submitFormAsync, status } = submitForm();
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const fields = useMemo(() => form?.fields ?? [], [form?.fields]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const missingField = fields.find((field) => {
      return field.isRequired && !values[field.id]?.trim();
    });

    if (missingField) {
      toast.error(`${missingField.label} is required`);
      return;
    }

    try {
      await submitFormAsync({
        formId,
        values: fields.map((field) => ({
          formFieldId: field.id,
          value: values[field.id] ?? "",
        })),
      });
      setSubmitted(true);
      toast.success("Form submitted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit form");
    }
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen px-5 py-10">
        <div className="mx-auto grid w-full max-w-2xl gap-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </main>
    );
  }

  if (!form) {
    return (
      <main className="bg-background flex min-h-screen items-center justify-center px-5 py-10">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Form not found</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            This form may have been removed or the link is incorrect.
          </p>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="bg-background flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-xs">
          <h1 className="text-2xl font-semibold">Thank you</h1>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            Your response has been submitted successfully.
          </p>
          <Button asChild variant="outline" className="mt-6 gap-2">
            <Link href={`/f/${formId}`}>
              <ArrowLeft className="size-4" />
              Back to form
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen px-5 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="rounded-lg border bg-card shadow-xs">
          <header className="grid gap-2 border-b p-6">
            <h1 className="text-2xl font-semibold tracking-tight">{form.title}</h1>
            {form.description ? (
              <p className="text-muted-foreground text-sm leading-6">{form.description}</p>
            ) : null}
          </header>
          <div className="grid gap-6 p-6">
            {fields.length ? (
              fields.map((field) => (
                <FieldControl
                  key={field.id}
                  field={field}
                  value={values[field.id] ?? ""}
                  disabled={status === "pending"}
                  onChange={(value) => setValues((current) => ({ ...current, [field.id]: value }))}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                This form does not have any fields yet.
              </p>
            )}
          </div>
          <footer className="flex justify-end border-t p-6">
            <Button type="submit" disabled={!fields.length || status === "pending"} className="gap-2">
              <Send className="size-4" />
              {status === "pending" ? "Submitting..." : "Submit"}
            </Button>
          </footer>
        </form>
      </div>
    </main>
  );
}
