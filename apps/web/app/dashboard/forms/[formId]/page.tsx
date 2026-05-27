"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Smartphone,
  Eye,
  Settings,
  Database,
  Type,
  Hash,
  Mail,
  ToggleLeft,
  Lock,
  Sparkles,
  Info,
  Calendar,
  Layers,
  CheckCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  ClipboardCheck,
  RefreshCw
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Switch } from "~/components/ui/switch";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { getUser } from "~/hooks/api/auth";
import { 
  getForm, 
  getFormSubmissions, 
  createFormField, 
  updateFormField, 
  deleteFormField 
} from "~/hooks/api/forms";
import { toast } from "sonner";

// Define Form Field Types mapping for styling
const FIELD_TYPE_CONFIG = {
  TEXT: {
    label: "Short Text",
    icon: Type,
    color: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400"
  },
  NUMBER: {
    label: "Number",
    icon: Hash,
    color: "from-amber-500 to-orange-400",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400"
  },
  EMAIL: {
    label: "Email Address",
    icon: Mail,
    color: "from-emerald-500 to-teal-400",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400"
  },
  YES_NO: {
    label: "Yes / No Choice",
    icon: ToggleLeft,
    color: "from-indigo-500 to-purple-400",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-400"
  },
  PASSWORD: {
    label: "Secure Password",
    icon: Lock,
    color: "from-rose-500 to-pink-400",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-400"
  }
};

export default function FormBuilder({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tabs state - controlled by search params or standard state
  const initialTab = searchParams.get("tab") || "builder";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Authentication check
  const { userInfo, isLoading: isUserLoading } = getUser();
  useEffect(() => {
    if (!isUserLoading && (!userInfo || !userInfo.id)) {
      router.replace("/login");
    }
  }, [userInfo, isUserLoading, router]);

  // Form Details & Submissions Hooks
  const getFormQuery = getForm();
  const { data: form, isLoading: isFormLoading, refetch: refetchForm } = getFormQuery({ formId });

  const getSubmissionsQuery = getFormSubmissions();
  const { data: submissions, isLoading: isSubmissionsLoading, refetch: refetchSubmissions } = getSubmissionsQuery({ formId });

  // Mutations
  const { createFormFieldAsync } = createFormField();
  const { updateFormFieldAsync } = updateFormField();
  const { deleteFormFieldAsync } = deleteFormField();

  // Dialog State for adding a field
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<keyof typeof FIELD_TYPE_CONFIG>("TEXT");
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldPlaceholder, setFieldPlaceholder] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [fieldRequired, setFieldRequired] = useState(false);
  const [isAddingField, setIsAddingField] = useState(false);

  // Edit Field State (inline edit tracking)
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editPlaceholder, setEditPlaceholder] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSavingField, setIsSavingField] = useState(false);

  // Share link copy
  const copyShareLink = () => {
    const origin = window.location.origin;
    const shareUrl = `${origin}/share/${formId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Shareable form URL copied to clipboard!");
  };

  // Add field implementation
  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldLabel.trim()) {
      toast.error("Question label is required");
      return;
    }

    try {
      setIsAddingField(true);
      await createFormFieldAsync({
        formId,
        label: fieldLabel.trim(),
        description: fieldDescription.trim() || null,
        placeholder: fieldPlaceholder.trim() || null,
        isRequired: fieldRequired,
        type: selectedFieldType,
      });

      toast.success("Field added successfully!");
      setIsAddFieldOpen(false);
      
      // Reset inputs
      setFieldLabel("");
      setFieldPlaceholder("");
      setFieldDescription("");
      setFieldRequired(false);

      refetchForm();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add field");
    } finally {
      setIsAddingField(false);
    }
  };

  // Toggle field requirement directly
  const handleToggleRequired = async (fieldId: string, currentVal: boolean) => {
    try {
      await updateFormFieldAsync({
        fieldId,
        isRequired: !currentVal,
      });
      toast.success(`Requirement updated successfully`);
      refetchForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to update requirement");
    }
  };

  // Delete field implementation
  const handleDeleteField = async (fieldId: string) => {
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) return;
    
    try {
      await deleteFormFieldAsync({ fieldId });
      toast.success("Question deleted");
      refetchForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete question");
    }
  };

  // Start Editing Field
  const startEditing = (field: any) => {
    setEditingFieldId(field.id);
    setEditLabel(field.label);
    setEditPlaceholder(field.placeholder || "");
    setEditDescription(field.description || "");
  };

  // Save Edited Field
  const handleSaveEdit = async (fieldId: string) => {
    if (!editLabel.trim()) {
      toast.error("Label cannot be empty");
      return;
    }

    try {
      setIsSavingField(true);
      await updateFormFieldAsync({
        fieldId,
        label: editLabel.trim(),
        placeholder: editPlaceholder.trim() || null,
        description: editDescription.trim() || null,
      });

      toast.success("Field updated");
      setEditingFieldId(null);
      refetchForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to update field");
    } finally {
      setIsSavingField(false);
    }
  };

  if (isUserLoading || isFormLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-neutral-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading form details...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-neutral-950 text-white px-4">
        <h2 className="text-2xl font-bold">Form not found</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-sm">The form you are trying to edit does not exist or you do not have permission to view it.</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-6 bg-white text-black hover:bg-neutral-200">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-neutral-950 to-black text-white">
      {/* Builder Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="rounded-full border border-white/5 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="max-w-[200px] sm:max-w-xs md:max-w-md">
              <h1 className="truncate text-base font-bold text-neutral-100 leading-tight">
                {form.title}
              </h1>
              <p className="truncate text-[10px] text-neutral-400 leading-tight">
                {form.description || "Workspace Editor"}
              </p>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyShareLink}
              className="hidden sm:flex border-white/5 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white rounded-xl text-xs items-center gap-1.5 transition"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Share Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/share/${formId}`, "_blank")}
              className="border-white/5 bg-white/5 text-neutral-300 hover:bg-violet-600 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Form
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Custom Navigation */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <TabsList className="bg-white/5 border border-white/5 rounded-xl p-1 text-neutral-400">
              <TabsTrigger
                value="builder"
                className="rounded-lg px-4 py-1.5 text-xs font-semibold data-[state=active]:bg-violet-600 data-[state=active]:text-white transition"
              >
                <Settings className="h-3.5 w-3.5 mr-2" />
                Form Builder
              </TabsTrigger>
              <TabsTrigger
                value="submissions"
                onClick={() => refetchSubmissions()}
                className="rounded-lg px-4 py-1.5 text-xs font-semibold data-[state=active]:bg-violet-600 data-[state=active]:text-white transition"
              >
                <Database className="h-3.5 w-3.5 mr-2" />
                Submissions
                {submissions && submissions.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white">
                    {submissions.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <div className="text-[10px] text-neutral-500 font-mono hidden md:block">
              ID: {form.id}
            </div>
          </div>

          {/* Builder Tab */}
          <TabsContent value="builder" className="outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Builder Configurator */}
              <div className="lg:col-span-7 space-y-6">
                {/* Intro Form Header Info */}
                <Card className="border-white/5 bg-zinc-950 text-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{form.title}</h2>
                      <p className="text-sm text-neutral-400 mt-1">
                        {form.description || "No description provided."}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-white/5 border border-white/5 text-neutral-400 rounded-md text-[10px]">
                          Created: {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "Just Now"}
                        </Badge>
                        <Badge variant="secondary" className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[10px]">
                          Accepting Submissions
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Add Field Trigger & Choice Card */}
                <Card className="border-white/5 bg-zinc-950 text-white rounded-2xl shadow-xl overflow-hidden">
                  <CardHeader className="p-6 pb-3 border-b border-white/5">
                    <CardTitle className="text-base font-bold text-neutral-100 flex items-center justify-between">
                      Add Input Questions
                      <Badge variant="outline" className="text-[10px] border-white/10 text-neutral-500">
                        {form.fields?.length || 0} fields
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-neutral-400 text-xs">
                      Choose a field type to append to your dynamic form builder.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {Object.entries(FIELD_TYPE_CONFIG).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <Button
                            key={key}
                            variant="ghost"
                            onClick={() => {
                              setSelectedFieldType(key as keyof typeof FIELD_TYPE_CONFIG);
                              setIsAddFieldOpen(true);
                            }}
                            className="h-auto flex flex-col items-center justify-center p-4 border border-white/5 bg-white/5 hover:border-violet-500/50 hover:bg-gradient-to-b hover:from-violet-500/5 hover:to-transparent rounded-xl transition-all duration-300"
                          >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${config.color} text-white shadow-md ring-1 ring-white/10 mb-2`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold tracking-tight text-neutral-200">
                              {config.label}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>

                  {/* Add Field Dynamic Modal Dialog */}
                  <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
                    <DialogContent className="border border-white/10 bg-zinc-950 text-white sm:max-w-[425px]">
                      <form onSubmit={handleAddField}>
                        <DialogHeader>
                          <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <span className={`p-1.5 rounded-lg bg-gradient-to-tr ${FIELD_TYPE_CONFIG[selectedFieldType].color} text-white`}>
                              {React.createElement(FIELD_TYPE_CONFIG[selectedFieldType].icon, { className: "h-4 w-4" })}
                            </span>
                            Add {FIELD_TYPE_CONFIG[selectedFieldType].label} Field
                          </DialogTitle>
                          <DialogDescription className="text-neutral-400 text-xs">
                            Define details for this input element. Responders will see these details live.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="field-label" className="text-xs font-semibold text-neutral-300">
                              Question / Label <span className="text-red-400">*</span>
                            </Label>
                            <Input
                              id="field-label"
                              placeholder="e.g. What is your billing address?"
                              value={fieldLabel}
                              onChange={(e) => setFieldLabel(e.target.value)}
                              required
                              className="border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500 text-sm"
                            />
                          </div>

                          {selectedFieldType !== "YES_NO" && (
                            <div className="space-y-1.5">
                              <Label htmlFor="field-placeholder" className="text-xs font-semibold text-neutral-300">
                                Placeholder Text
                              </Label>
                              <Input
                                id="field-placeholder"
                                placeholder="e.g. Enter street address, city, zip"
                                value={fieldPlaceholder}
                                onChange={(e) => setFieldPlaceholder(e.target.value)}
                                className="border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500 text-sm"
                              />
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <Label htmlFor="field-desc" className="text-xs font-semibold text-neutral-300">
                              Help/Description Text (Optional)
                            </Label>
                            <Input
                              id="field-desc"
                              placeholder="e.g. We will only use this to mail invoices."
                              value={fieldDescription}
                              onChange={(e) => setFieldDescription(e.target.value)}
                              className="border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500 text-sm"
                            />
                          </div>

                          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                            <div className="flex flex-col gap-0.5">
                              <Label htmlFor="field-req" className="text-xs font-semibold text-neutral-300">
                                Required Field
                              </Label>
                              <span className="text-[10px] text-neutral-500">Must be answered before submitting</span>
                            </div>
                            <Switch
                              id="field-req"
                              checked={fieldRequired}
                              onCheckedChange={setFieldRequired}
                              className="data-[state=checked]:bg-violet-600"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsAddFieldOpen(false)}
                            className="text-neutral-400 hover:bg-white/5 hover:text-white"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isAddingField}
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-md hover:opacity-90"
                          >
                            {isAddingField ? "Adding..." : "Add to Form"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </Card>

                {/* Form Fields List (Interactive CRUD) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-2 px-1">
                    Form Questions Layout
                  </h3>

                  {form.fields && form.fields.length > 0 ? (
                    <div className="space-y-3.5">
                      {form.fields.map((field, idx) => {
                        const typeConfig = FIELD_TYPE_CONFIG[field.type];
                        const Icon = typeConfig.icon;
                        const isEditing = editingFieldId === field.id;

                        return (
                          <Card 
                            key={field.id}
                            className={`border-white/5 bg-zinc-950 text-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
                              isEditing ? "ring-1 ring-violet-500 bg-white/[0.01]" : ""
                            }`}
                          >
                            <div className="p-5">
                              {isEditing ? (
                                /* Field Edit Mode Layout */
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                    <span className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                                      <Settings className="h-3.5 w-3.5" />
                                      Editing Question #{idx + 1}
                                    </span>
                                    <Badge className={`${typeConfig.bgColor} ${typeConfig.textColor} border-transparent text-[9px]`}>
                                      {typeConfig.label}
                                    </Badge>
                                  </div>

                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Question text</Label>
                                      <Input
                                        value={editLabel}
                                        onChange={(e) => setEditLabel(e.target.value)}
                                        className="border-white/10 bg-white/5 text-white focus:border-violet-500 text-xs py-1"
                                      />
                                    </div>

                                    {field.type !== "YES_NO" && (
                                      <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Placeholder text</Label>
                                        <Input
                                          value={editPlaceholder}
                                          onChange={(e) => setEditPlaceholder(e.target.value)}
                                          className="border-white/10 bg-white/5 text-white focus:border-violet-500 text-xs py-1"
                                        />
                                      </div>
                                    )}

                                    <div className="space-y-1">
                                      <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Helper / Description</Label>
                                      <Input
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="border-white/10 bg-white/5 text-white focus:border-violet-500 text-xs py-1"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingFieldId(null)}
                                      className="text-neutral-400 hover:bg-white/5 hover:text-white text-xs h-8"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      disabled={isSavingField}
                                      onClick={() => handleSaveEdit(field.id)}
                                      className="bg-violet-600 text-white text-xs font-semibold h-8 shadow-sm"
                                    >
                                      {isSavingField ? "Saving..." : "Save Changes"}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                /* Field Standard Viewer Mode Layout */
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3.5">
                                    {/* Handle or Type icon */}
                                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${typeConfig.color} text-white shadow-sm ring-1 ring-white/10`}>
                                      <Icon className="h-4.5 w-4.5" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-neutral-500 font-mono tracking-wider font-semibold">Q{idx + 1}</span>
                                        <h4 className="text-sm font-bold text-neutral-100">
                                          {field.label}
                                          {field.isRequired && <span className="text-red-400 ml-1">*</span>}
                                        </h4>
                                      </div>
                                      {field.description && (
                                        <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                                          <Info className="h-3 w-3 shrink-0" />
                                          {field.description}
                                        </p>
                                      )}
                                      {field.placeholder && (
                                        <p className="text-[10px] text-neutral-500 mt-1 border-l border-white/10 pl-2 italic">
                                          Placeholder: &ldquo;{field.placeholder}&rdquo;
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Field Action Buttons */}
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5" title={field.isRequired ? "Required" : "Optional"}>
                                      <span className="text-[10px] text-neutral-500 hidden sm:inline">Req</span>
                                      <Switch
                                        checked={field.isRequired}
                                        onCheckedChange={() => handleToggleRequired(field.id, field.isRequired)}
                                        className="scale-90 data-[state=checked]:bg-violet-600"
                                      />
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => startEditing(field)}
                                      className="h-8 w-8 text-neutral-400 hover:bg-white/5 hover:text-white rounded-lg"
                                      title="Edit details"
                                    >
                                      <Settings className="h-3.5 w-3.5" />
                                    </Button>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteField(field.id)}
                                      className="h-8 w-8 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg"
                                      title="Delete field"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-10 text-center animate-fade-in">
                      <HelpCircle className="h-10 w-10 text-neutral-500 mb-3" />
                      <h4 className="text-sm font-bold text-white">No questions set</h4>
                      <p className="text-xs text-neutral-400 max-w-xs mt-1">
                        Select a field type above to append input elements to this form.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live Mobile Form Preview Mockup */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 flex justify-center">
                <div className="relative w-full max-w-[340px] aspect-[9/18.5] rounded-[48px] border-4 border-neutral-800 bg-black shadow-2xl p-3 select-none overflow-hidden ring-4 ring-neutral-900 flex flex-col">
                  {/* Speaker & Sensor bar */}
                  <div className="absolute top-4 left-[50%] translate-x-[-50%] w-32 h-6 rounded-full bg-neutral-800 flex justify-center items-center gap-1.5 z-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    <div className="w-12 h-1 rounded-full bg-neutral-900" />
                  </div>
                  
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[10px] text-neutral-400 font-semibold px-6 pt-6 pb-2 z-10 shrink-0">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <Smartphone className="h-3.5 w-3.5" />
                      <span className="text-[9px] text-emerald-400 font-bold tracking-tight">PREVIEW</span>
                    </div>
                  </div>

                  {/* Device Inner Screen Scroll Area */}
                  <div className="flex-1 overflow-y-auto rounded-[36px] bg-zinc-950 border border-neutral-900 p-4 scrollbar-none flex flex-col justify-between">
                    <div className="space-y-5">
                      {/* Form Header Preview */}
                      <div className="border-b border-white/5 pb-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-medium text-violet-400 ring-1 ring-violet-500/15">
                          Formzzz Submit
                        </span>
                        <h3 className="text-sm font-bold text-neutral-200 mt-2 truncate">{form.title}</h3>
                        {form.description && (
                          <p className="text-[10px] text-neutral-400 mt-1 line-clamp-3 leading-tight">{form.description}</p>
                        )}
                      </div>

                      {/* Render preview inputs */}
                      {form.fields && form.fields.length > 0 ? (
                        <div className="space-y-4">
                          {form.fields.map((field, idx) => (
                            <div key={field.id} className="space-y-1.5">
                              <label className="text-[11px] font-bold text-neutral-200 flex items-center justify-between">
                                <span className="truncate">{field.label}</span>
                                {field.isRequired && <span className="text-red-400 font-bold text-xs">*</span>}
                              </label>
                              
                              {field.description && (
                                <p className="text-[9px] text-neutral-400 leading-tight">{field.description}</p>
                              )}

                              {field.type === "YES_NO" ? (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex h-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-[10px] text-neutral-400 font-bold">Yes</div>
                                  <div className="flex h-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-[10px] text-neutral-400 font-bold">No</div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <input
                                    type={field.type === "EMAIL" ? "email" : field.type === "PASSWORD" ? "password" : "text"}
                                    placeholder={field.placeholder || "Enter response..."}
                                    disabled
                                    className="w-full rounded-lg border border-white/5 bg-white/5 px-2.5 py-1.5 text-[10px] text-neutral-300 placeholder:text-neutral-500 disabled:opacity-80"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <Eye className="h-8 w-8 text-neutral-600 mb-2" />
                          <p className="text-[10px] text-neutral-400">Add questions in the left panel to build your live preview.</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-6">
                      <Button disabled className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-[10px] font-bold h-8">
                        Submit Response
                      </Button>
                      <p className="text-[8px] text-neutral-500 text-center mt-2">Forms powered securely by Formzzz</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="outline-none">
            {isSubmissionsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="h-8 w-8 animate-spin text-violet-400 mb-3" />
                <p className="text-sm text-neutral-400">Loading responder details...</p>
              </div>
            ) : submissions && submissions.length > 0 ? (
              <div className="space-y-6">
                {/* Statistics Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border-white/5 bg-zinc-950 p-5 text-white flex items-center gap-4 rounded-xl shadow-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                      <ClipboardCheck className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Total Submissions</p>
                      <p className="text-2xl font-bold text-white">{submissions.length}</p>
                    </div>
                  </Card>

                  <Card className="border-white/5 bg-zinc-950 p-5 text-white flex items-center gap-4 rounded-xl shadow-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                      <Clock className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Last Active Response</p>
                      <p className="text-xs font-bold text-white mt-1">
                        {submissions[0]?.createdAt ? new Date(submissions[0].createdAt).toLocaleString() : "Never"}
                      </p>
                    </div>
                  </Card>

                  <Card className="border-white/5 bg-zinc-950 p-5 text-white flex items-center gap-4 rounded-xl shadow-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                      <CheckCircle className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Accepting Data</p>
                      <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                        Live Status Checked
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Submissions Dynamic Table */}
                <Card className="border-white/5 bg-zinc-950 text-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-neutral-100">Submissions Log</CardTitle>
                      <CardDescription className="text-neutral-400 text-xs">
                        Review individual responder values collected securely.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchSubmissions()}
                      className="border-white/5 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Reload Log
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto w-full">
                    <Table>
                      <TableHeader className="border-b border-white/5 bg-white/[0.01]">
                        <TableRow className="border-b border-white/5 hover:bg-transparent">
                          <TableHead className="text-xs font-bold text-neutral-300 py-3.5 pl-6 w-[200px]">Submission Time</TableHead>
                          {/* Map form fields as column headers */}
                          {form.fields && form.fields.map((field) => (
                            <TableHead key={field.id} className="text-xs font-bold text-neutral-300 py-3.5 min-w-[150px]">
                              {field.label}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => {
                          const submissionValuesMap = new Map(
                            submission.values?.map((v) => [v.formFieldId, v.value]) || []
                          );

                          return (
                            <TableRow key={submission.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                              <TableCell className="text-xs text-neutral-400 py-4 pl-6 flex items-center gap-1.5 font-mono">
                                <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                                {submission.createdAt ? new Date(submission.createdAt).toLocaleString() : "Unknown"}
                              </TableCell>
                              
                              {/* Map values corresponding to fields */}
                              {form.fields && form.fields.map((field) => {
                                const ans = submissionValuesMap.get(field.id);
                                return (
                                  <TableCell key={field.id} className="text-xs py-4 text-neutral-200">
                                    {ans !== undefined ? (
                                      field.type === "PASSWORD" ? (
                                        <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-[10px] text-neutral-400">••••••••</span>
                                      ) : field.type === "YES_NO" ? (
                                        <Badge variant="outline" className={`rounded-md text-[9px] px-1.5 py-0 ${
                                          ans.toLowerCase() === "yes" 
                                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" 
                                            : "border-rose-500/30 bg-rose-500/5 text-rose-400"
                                        }`}>
                                          {ans}
                                        </Badge>
                                      ) : (
                                        <span className="truncate max-w-[200px] block">{ans}</span>
                                      )
                                    ) : (
                                      <span className="text-neutral-500 font-mono text-[10px]">N/A</span>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-16 text-center animate-fade-in">
                <Database className="h-12 w-12 text-neutral-500 mb-3 animate-pulse" />
                <h4 className="text-base font-bold text-white">No submissions recorded yet</h4>
                <p className="text-xs text-neutral-400 max-w-sm mt-1">
                  Once users open your public form and fill it, answers will immediately synchronize and display in this tab!
                </p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={copyShareLink}
                    className="bg-white text-black hover:bg-neutral-200 font-semibold rounded-xl text-xs"
                  >
                    Copy Share Link
                  </Button>
                  <Button
                    onClick={() => window.open(`/share/${formId}`, "_blank")}
                    variant="outline"
                    className="border-white/5 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white rounded-xl text-xs"
                  >
                    Test Fill Form
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
