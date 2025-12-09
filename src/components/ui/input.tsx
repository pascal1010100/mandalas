import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-none border-b-2 border-stone-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-400 focus-visible:border-stone-800 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-lg",
        className
      )}
      {...props}
    />
  )
}

export { Input }
