"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export type FormFieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";

export type FormField = {
  id?: string;
  fieldId?: string;
  label: string;
  description?: string | null;
  placeholder?: string | null;
  isRequired: boolean;
  type: FormFieldType;
};

type FieldControlProps = {
  field: FormField;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

const inputTypeByFieldType: Record<Exclude<FormFieldType, "YES_NO">, string> = {
  TEXT: "text",
  NUMBER: "number",
  EMAIL: "email",
  PASSWORD: "password",
};

export function FieldControl({ field, value, disabled, onChange }: FieldControlProps) {
  const inputId = field.id ?? field.fieldId ?? field.label;

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId} className="text-sm font-medium">
        {field.label}
        {field.isRequired ? <span className="text-destructive"> *</span> : null}
      </Label>
      {field.description ? (
        <p className="text-muted-foreground text-sm leading-5">{field.description}</p>
      ) : null}
      {field.type === "YES_NO" ? (
        <RadioGroup
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          className="flex min-h-9 items-center gap-5"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id={`${inputId}-yes`} />
            <Label htmlFor={`${inputId}-yes`} className="font-normal">
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id={`${inputId}-no`} />
            <Label htmlFor={`${inputId}-no`} className="font-normal">
              No
            </Label>
          </div>
        </RadioGroup>
      ) : (
        <Input
          id={inputId}
          type={inputTypeByFieldType[field.type]}
          value={value}
          disabled={disabled}
          required={field.isRequired}
          placeholder={field.placeholder ?? undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
