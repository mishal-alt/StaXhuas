import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Label  } from "@/components/ui/label"

import { cn } from "@/lib/utils"

function Input({
  className,
  labelClassName,
  type,
  label,
  error,
  ...props
}) {
  return (
    <div className="grid w-full items-center gap-1.5">
      {label && <Label htmlFor={props.id || props.name} className={labelClassName}>{label}</Label>}
      <InputPrimitive
        type={type}
        id={props.id || props.name}
        data-slot="input"
        className={cn(
          "h-10 w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-2 text-base transition-all outline-none placeholder:text-muted-foreground focus-visible:border-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
          error && "border-destructive ring-destructive/20",
          className
        )}
        {...props} />
      {error && <p className="text-[10px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

export { Input }
