"use client";

import { ClipboardList, ExternalLink, FilePlus2, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { createForm, listAllForms } from "~/hooks/api/forms";

export function Dashboard() {
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: forms, isLoading } = listAllForms();
  const { createFormAsync, status } = createForm();

  const filteredForms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return forms ?? [];

    return (forms ?? []).filter((form) => {
      return (
        form.title.toLowerCase().includes(normalizedQuery) ||
        (form.description ?? "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [forms, query]);

  const handleCreateForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { formId } = await createFormAsync({
        title: title.trim(),
        description: description.trim() || null,
      });

      setTitle("");
      setDescription("");
      setIsDialogOpen(false);
      toast.success("Form created");
      window.location.href = `/forms/${formId}`;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create form");
    }
  };

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8">
        <header className="flex flex-col gap-5 border-b pb-6 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-2">
            <Badge variant="outline" className="rounded-md px-2.5 py-1">
              Form workspace
            </Badge>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dynamic Forms</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                Build forms, publish public links, and review submissions from one focused
                dashboard.
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2 md:w-auto">
                <FilePlus2 className="size-4" />
                New form
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateForm} className="grid gap-5">
                <DialogHeader>
                  <DialogTitle>Create form</DialogTitle>
                  <DialogDescription>
                    Start with a title. Fields can be added on the builder screen.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="form-title">Title</Label>
                    <Input
                      id="form-title"
                      value={title}
                      maxLength={55}
                      required
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Customer onboarding"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="form-description">Description</Label>
                    <Textarea
                      id="form-description"
                      value={description}
                      maxLength={300}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Collect the details your team needs."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={status === "pending"}>
                    {status === "pending" ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <section className="grid gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Your forms</h2>
              <p className="text-muted-foreground text-sm">{forms?.length ?? 0} total forms</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search forms"
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-40 rounded-lg" />
              ))}
            </div>
          ) : filteredForms.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredForms.map((form) => (
                <Card key={form.formId} className="rounded-lg">
                  <CardHeader className="gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg">{form.title}</CardTitle>
                      <Badge variant="secondary" className="rounded-md">
                        Active
                      </Badge>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm leading-5">
                      {form.description || "No description yet."}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href={`/forms/${form.formId}`}>
                        <ClipboardList className="size-4" />
                        Builder
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/f/${form.formId}`} target="_blank">
                        <ExternalLink className="size-4" />
                        Public link
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FilePlus2 className="text-muted-foreground size-10" />
              <h3 className="mt-4 text-lg font-semibold">No forms found</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                Create your first form to start collecting structured submissions.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
