import type { SelectHTMLAttributes } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
};
