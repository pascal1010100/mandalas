"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, X, Search, Filter } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ReservationFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    statusFilter: "ALL" | "confirmed" | "pending" | "cancelled"
    onStatusChange: (value: "ALL" | "confirmed" | "pending" | "cancelled") => void
    dateRange: DateRange | undefined
    onDateRangeChange: (range: DateRange | undefined) => void
}

export function ReservationFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    dateRange,
    onDateRangeChange,
}: ReservationFiltersProps) {
    const hasActiveFilters = searchTerm || statusFilter !== "ALL" || dateRange

    const clearFilters = () => {
        onSearchChange("")
        onStatusChange("ALL")
        onDateRangeChange(undefined)
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-stone-900/50 p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 backdrop-blur-sm transition-all duration-300">

                {/* Search */}
                <div className="relative w-full md:max-w-xs group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                    <Input
                        placeholder="Buscar huésped, email o ID..."
                        className="pl-10 bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 focus-visible:ring-amber-500/50 rounded-full h-10 text-sm shadow-sm transition-all hover:border-amber-500/30"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">

                    {/* Date Range Picker */}
                    <div className={cn("grid gap-2", !dateRange && "text-stone-500")}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[260px] justify-start text-left font-normal rounded-full border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                                                {format(dateRange.to, "LLL dd, y", { locale: es })}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y", { locale: es })
                                        )
                                    ) : (
                                        <span>Filtrar por fechas</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={onDateRangeChange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Status Segmented Control */}
                    <div className="flex bg-stone-100 dark:bg-stone-800/50 p-1 rounded-full border border-stone-200 dark:border-stone-800">
                        {(["ALL", "pending", "confirmed", "cancelled"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => onStatusChange(status)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 capitalize",
                                    statusFilter === status
                                        ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm ring-1 ring-black/5"
                                        : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                                )}
                            >
                                {status === "ALL" ? "Todas" : status}
                            </button>
                        ))}
                    </div>

                    {/* Clear Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearFilters}
                            className="h-10 w-10 rounded-full text-stone-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                            title="Limpiar filtros"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
