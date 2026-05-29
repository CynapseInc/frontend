import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-[#9D8189] selection:bg-[#F4ACB7] selection:text-white border-[#D8E2DC] flex h-11 w-full min-w-0 rounded-md border px-3 py-2 text-[15px] bg-[#F9F9F9] text-[#6D6875] transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#F4ACB7] focus-visible:ring-[#F4ACB7]/30 focus-visible:ring-[3px]",
        "aria-invalid:border-[#FF6B6B]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
