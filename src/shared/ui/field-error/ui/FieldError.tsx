import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib";

export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children: string;
};

export const FieldError = ({
  children,
  className,
  ...props
}: FieldErrorProps) => {
  return (
    <p role="alert" className={cn("text-sm text-error", className)} {...props}>
      {children}
    </p>
  );
};
