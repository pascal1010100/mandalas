import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[100px] w-full rounded-none border-b-2 border-stone-200 bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-stone-400 focus-visible:border-stone-800 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-lg",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
