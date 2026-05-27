"use client";

import {
  ArrowLeft,
  BarChart3,
  Copy,
  ExternalLink,
  Eye,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { FieldControl } from "~/components/forms/field-control";
import type { FormFieldType } from "~/components/forms/field-control";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  createFormField,
  deleteFormField,
  getForm,
  getFormSubmissions,
  updateFormField,
} from "~/hooks/api/forms";

const fieldTypes: Array<{ value: FormFieldType; label: string }> = [
  { value: "TEXT", label: "Text" },
  { value: "NUMBER", label: "Number" },
  { value: "EMAIL", label: "Email" },
  { value: "YES_NO", label: "Yes / No" },
  { value: "PASSWORD", label: "Password" },
];

const emptyField = {
  label: "",
  description: "",
  placeholder: "",
  isRequired: false,
  type: "TEXT" as FormFieldType,
};

type FormBuilderProps = {
  formId: string;
};

export function FormBuilder({ formId }: FormBuilderProps) {
  const useGetForm = getForm();
  const useGetSubmissions = getFormSubmissions();
  const { data: form, isLoading } = useGetForm({ formId });
  const { data: submissions } = useGetSubmissions({ formId });
  const { createFormFieldAsync, status: createStatus } = createFormField();
  const { updateFormFieldAsync, status: updateStatus } = updateFormField();
  const { deleteFormFieldAsync } = deleteFormField();
  const [draft, setDraft] = useState(emptyField);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const selectedField = useMemo(() => {
    return form?.fields.find((field) => field.id === selectedFieldId) ?? null;
  }, [form?.fields, selectedFieldId]);

  const publicUrl =
    typeof window === "undefined" ? `/f/${formId}` : `${window.location.origin}/f/${formId}`;

  useEffect(() => {
    if (!selectedField && form?.fields.length) {
      setSelectedFieldId(form.fields[0]?.id ?? null);
    }
  }, [form?.fields, selectedField]);

  const handleCreateField = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const created = await createFormFieldAsync({
        formId,
        label: draft.label.trim(),
        description: draft.description.trim() || null,
        placeholder: draft.placeholder.trim() || null,
        isRequired: draft.isRequired,
        type: draft.type,
      });

      setDraft(emptyField);
      setSelectedFieldId(created.fieldId);
      toast.success("Field added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add field");
    }
  };

  const handleUpdateField = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedField) return;

    const formData = new FormData(event.currentTarget);

    try {
      await updateFormFieldAsync({
        fieldId: selectedField.id,
        label: String(formData.get("label") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim() || null,
        placeholder: String(formData.get("placeholder") ?? "").trim() || null,
        isRequired: formData.get("isRequired") === "on",
        type: String(formData.get("type")) as FormFieldType,
      });
      toast.success("Field updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update field");
    }
  };

  const handleDeleteField = async () => {
    if (!selectedField) return;

    try {
      await deleteFormFieldAsync({ fieldId: selectedField.id });
      setSelectedFieldId(null);
      toast.success("Field deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete field");
    }
  };

  const handleCopyPublicUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Public link copied");
  };

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 sm:px-8">
        <header className="flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-3">
            <Button asChild variant="ghost" size="sm" className="w-fit gap-2 px-0">
              <Link href="/dashboard">
                <ArrowLeft className="size-4" />
                Dashboard
              </Link>
            </Button>
            {isLoading ? (
              <div className="grid gap-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-96 max-w-full" />
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {form?.title ?? "Form not found"}
                  </h1>
                  <Badge variant="outline" className="rounded-md">
                    {form?.fields.length ?? 0} fields
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                  {form?.description || "Add fields and share the public URL when it is ready."}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopyPublicUrl} className="gap-2">
              <Copy className="size-4" />
              Copy link
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href={`/f/${formId}`} target="_blank">
                <ExternalLink className="size-4" />
                Preview
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_1fr_minmax(300px,380px)]">
          <section className="grid content-start gap-4">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Plus className="size-4" />
                  Add field
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4" onSubmit={handleCreateField}>
                  <div className="grid gap-2">
                    <Label htmlFor="new-label">Label</Label>
                    <Input
                      id="new-label"
                      value={draft.label}
                      required
                      maxLength={100}
                      onChange={(event) => setDraft({ ...draft, label: event.target.value })}
                      placeholder="Company email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-type">Type</Label>
                    <Select
                      value={draft.type}
                      onValueChange={(value) => setDraft({ ...draft, type: value as FormFieldType })}
                    >
                      <SelectTrigger id="new-type" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((fieldType) => (
                          <SelectItem key={fieldType.value} value={fieldType.value}>
                            {fieldType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-placeholder">Placeholder</Label>
                    <Input
                      id="new-placeholder"
                      value={draft.placeholder}
                      onChange={(event) =>
                        setDraft({ ...draft, placeholder: event.target.value })
                      }
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-description">Description</Label>
                    <Textarea
                      id="new-description"
                      value={draft.description}
                      onChange={(event) =>
                        setDraft({ ...draft, description: event.target.value })
                      }
                      placeholder="Shown below the label."
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <Label htmlFor="new-required">Required</Label>
                    <Switch
                      id="new-required"
                      checked={draft.isRequired}
                      onCheckedChange={(checked) =>
                        setDraft({ ...draft, isRequired: checked })
                      }
                    />
                  </div>
                  <Button type="submit" disabled={createStatus === "pending"} className="gap-2">
                    <Plus className="size-4" />
                    {createStatus === "pending" ? "Adding..." : "Add field"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="size-4" />
                  Submissions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="text-3xl font-semibold">{submissions?.length ?? 0}</div>
                <p className="text-muted-foreground text-sm">Responses received for this form.</p>
              </CardContent>
            </Card>
          </section>

          <section className="grid content-start gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Form preview</h2>
              <Badge variant="secondary" className="rounded-md">
                Live structure
              </Badge>
            </div>
            <div className="rounded-lg border bg-card p-5 shadow-xs">
              <div className="grid gap-2 border-b pb-5">
                <h3 className="text-xl font-semibold">{form?.title ?? "Untitled form"}</h3>
                <p className="text-muted-foreground text-sm">
                  {form?.description || "Form description will appear here."}
                </p>
              </div>
              <div className="grid gap-5 pt-5">
                {form?.fields.length ? (
                  form.fields.map((field) => (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => setSelectedFieldId(field.id)}
                      className="rounded-md border p-4 text-left transition hover:bg-accent/50 data-[selected=true]:border-primary"
                      data-selected={selectedFieldId === field.id}
                    >
                      <FieldControl field={field} value="" disabled onChange={() => undefined} />
                    </button>
                  ))
                ) : (
                  <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                    <Eye className="text-muted-foreground size-9" />
                    <h3 className="mt-4 text-base font-semibold">No fields yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                      Add a field from the left panel to start shaping this form.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="grid content-start gap-4">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3 text-base">
                  Field settings
                  {selectedField ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={handleDeleteField}
                      aria-label="Delete field"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedField ? (
                  <form key={selectedField.id} className="grid gap-4" onSubmit={handleUpdateField}>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-label">Label</Label>
                      <Input
                        id="edit-label"
                        name="label"
                        defaultValue={selectedField.label}
                        required
                        maxLength={100}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-type">Type</Label>
                      <Select name="type" defaultValue={selectedField.type}>
                        <SelectTrigger id="edit-type" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map((fieldType) => (
                            <SelectItem key={fieldType.value} value={fieldType.value}>
                              {fieldType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-placeholder">Placeholder</Label>
                      <Input
                        id="edit-placeholder"
                        name="placeholder"
                        defaultValue={selectedField.placeholder ?? ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        name="description"
                        defaultValue={selectedField.description ?? ""}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <Label htmlFor="edit-required">Required</Label>
                      <Switch
                        id="edit-required"
                        name="isRequired"
                        defaultChecked={selectedField.isRequired}
                      />
                    </div>
                    <Separator />
                    <Button type="submit" disabled={updateStatus === "pending"} className="gap-2">
                      <Save className="size-4" />
                      {updateStatus === "pending" ? "Saving..." : "Save changes"}
                    </Button>
                  </form>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Select a field in the preview to edit its label, type, placeholder, and
                    required state.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="text-base">Recent submissions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {submissions?.length ? (
                  submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="rounded-md border p-3">
                      <p className="text-sm font-medium">Submission {submission.id.slice(0, 8)}</p>
                      <p className="text-muted-foreground text-xs">
                        {submission.values?.length ?? 0} values captured
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No submissions yet.</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
