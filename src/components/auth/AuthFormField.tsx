import { FormField } from "@/components/admin/forms/FormField";
import { AdminInput } from "@/components/admin/forms/AdminInput";

interface AuthFormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

export function AuthFormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: AuthFormFieldProps) {
  return (
    <FormField label={label} htmlFor={id}>
      <AdminInput
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
    </FormField>
  );
}
