"use client";

import React, { use, useState } from "react";
import { 
  FormInput, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Send,
  Sparkles,
  RefreshCcw,
  Type,
  Hash,
  Mail,
  ToggleLeft,
  Lock
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import { getForm, submitForm } from "~/hooks/api/forms";

export default function PublicFormSubmission({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  
  // Queries & Mutations
  const getFormQuery = getForm();
  const { data: form, isLoading, isError } = getFormQuery({ formId });
  const { submitFormAsync } = submitForm();

  // State to hold responder answers
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle Response Changes
  const handleValueChange = (fieldId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear field-level error on change
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  // Perform client-side validations
  const validateForm = (): boolean => {
    if (!form?.fields) return true;
    
    const newErrors: Record<string, string> = {};
    let isValid = true;

    form.fields.forEach((field) => {
      const value = responses[field.id]?.trim() || "";

      // Validate required
      if (field.isRequired && !value) {
        newErrors[field.id] = "This question is required";
        isValid = false;
      }

      // Validate Email format
      if (field.type === "EMAIL" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = "Please enter a valid email address";
          isValid = false;
        }
      }

      // Validate Number format
      if (field.type === "NUMBER" && value) {
        if (isNaN(Number(value))) {
          newErrors[field.id] = "Please enter a valid numeric value";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Transform responses into the expected input format: Array of { formFieldId, value }
      const formattedValues = Object.entries(responses).map(([formFieldId, value]) => ({
        formFieldId,
        value,
      }));

      await submitFormAsync({
        formId,
        values: formattedValues,
      });

      setIsSubmitted(true);
      toast.success("Form submitted successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit responses. Please check validation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form for a new submission
  const handleReset = () => {
    setResponses({});
    setErrors({});
    setIsSubmitted(false);
  };

  // Calculate dynamic progress
  const calculateProgress = () => {
    if (!form?.fields || form.fields.length === 0) return 0;
    const completedCount = form.fields.filter(field => responses[field.id]?.trim()).length;
    return Math.round((completedCount / form.fields.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-neutral-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading form details...</p>
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-neutral-950 text-white px-4">
        <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold">Form Inactive</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-sm">The form is currently inactive, has been deleted, or is not configured for public submissions.</p>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-950 via-zinc-900 to-black text-white py-12 px-4 flex flex-col items-center justify-center">
      {/* Background radial effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-xl relative z-10 space-y-6">
        
        {!isSubmitted ? (
          <>
            {/* Dynamic Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-neutral-400 px-1 font-medium">
                <span className="flex items-center gap-1.5 text-violet-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Dynamic Form
                </span>
                <span>{progress}% Completed</span>
              </div>
              <div className="w-full h-1 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Main Form Card */}
            <Card className="border border-white/5 bg-zinc-950 text-white rounded-3xl shadow-2xl overflow-hidden">
              <CardHeader className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 ring-1 ring-violet-500/25">
                    <FormInput className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                      {form.title}
                    </CardTitle>
                    {form.description && (
                      <CardDescription className="text-xs text-neutral-400 mt-1 line-clamp-3">
                        {form.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="p-8 space-y-6">
                  {form.fields && form.fields.length > 0 ? (
                    form.fields.map((field, idx) => {
                      const hasError = !!errors[field.id];
                      
                      return (
                        <div key={field.id} className="space-y-2 border-b border-white/[0.03] pb-6 last:border-b-0 last:pb-0">
                          <Label 
                            htmlFor={field.id} 
                            className={`text-sm font-semibold tracking-wide flex items-center justify-between transition-colors ${
                              hasError ? "text-red-400" : "text-neutral-200"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-[10px] text-neutral-500 font-mono">Q{idx + 1}</span>
                              {field.label}
                              {field.isRequired && <span className="text-red-400 font-bold ml-1">*</span>}
                            </span>
                          </Label>

                          {field.description && (
                            <p className="text-xs text-neutral-400 leading-relaxed font-light pl-6">
                              {field.description}
                            </p>
                          )}

                          {/* Dynamic Inputs Renderers */}
                          <div className="pl-6 pt-1">
                            {field.type === "YES_NO" ? (
                              <div className="grid grid-cols-2 gap-3 max-w-[280px]">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => handleValueChange(field.id, "Yes")}
                                  className={`h-10 border rounded-xl font-semibold text-xs transition-all duration-300 ${
                                    responses[field.id] === "Yes"
                                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25"
                                      : "border-white/5 bg-white/5 text-neutral-400 hover:text-white"
                                  }`}
                                >
                                  Yes
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => handleValueChange(field.id, "No")}
                                  className={`h-10 border rounded-xl font-semibold text-xs transition-all duration-300 ${
                                    responses[field.id] === "No"
                                      ? "border-rose-500 bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/25"
                                      : "border-white/5 bg-white/5 text-neutral-400 hover:text-white"
                                  }`}
                                >
                                  No
                                </Button>
                              </div>
                            ) : (
                              <div className="relative">
                                <Input
                                  id={field.id}
                                  type={
                                    field.type === "EMAIL" 
                                      ? "email" 
                                      : field.type === "PASSWORD" 
                                      ? "password" 
                                      : "text"
                                  }
                                  placeholder={field.placeholder || "Your answer..."}
                                  value={responses[field.id] || ""}
                                  onChange={(e) => handleValueChange(field.id, e.target.value)}
                                  className={`border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500 text-sm rounded-xl py-2 pl-3 ${
                                    hasError ? "border-red-500/50 focus:border-red-500 focus:ring-red-500 bg-red-500/[0.02]" : ""
                                  }`}
                                />
                              </div>
                            )}
                            
                            {/* Error text block */}
                            {hasError && (
                              <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1.5 animate-fade-in font-medium pl-0.5">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                {errors[field.id]}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <AlertCircle className="h-10 w-10 text-neutral-500 mb-3" />
                      <h4 className="text-sm font-bold text-white">No fields defined</h4>
                      <p className="text-xs text-neutral-400 mt-1 max-w-xs">This form is empty and has no submission options defined yet.</p>
                    </div>
                  )}
                </CardContent>

                {form.fields && form.fields.length > 0 && (
                  <CardFooter className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center gap-4">
                    <span className="text-[10px] text-neutral-500">
                      * Indicates a required field
                    </span>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl px-6 hover:opacity-95 shadow-md shadow-violet-600/15"
                    >
                      {isSubmitting ? "Submitting response..." : "Submit Form"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
              </form>
            </Card>
          </>
        ) : (
          /* Submission Success State Frame */
          <Card className="border border-white/5 bg-zinc-950 text-white rounded-3xl shadow-2xl p-8 text-center animate-scale-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto mb-6 ring-1 ring-emerald-500/25">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Submission Successful
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto">
              Thank you! Your response to <strong className="text-neutral-200">{form.title}</strong> has been logged securely.
            </p>

            <div className="mt-8 border-t border-white/5 pt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-white/5 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Submit another response
              </Button>
            </div>
            
            <p className="text-[10px] text-neutral-600 text-center mt-10">
              Formzzz — Secure, Interactive & Dynamic Form builder
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
