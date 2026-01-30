"use client"

import { useState } from "react"
import { useFinance, CashTransaction } from "@/domains/finance"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatMoney } from "@/lib/currency"
import { History, Calendar as CalendarIcon, Search, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
// import { toast } from "sonner"

export function ShiftHistoryModal() {
    const { fetchHistoricalTransactions } = useFinance()
    const [open, setOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [historyData, setHistoryData] = useState<CashTransaction[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async () => {
        if (!selectedDate) return

        setIsLoading(true)
        // Adjust for timezone - input date gives YYYY-MM-DD
        // Create a date object treating that string as local
        const [year, month, day] = selectedDate.split('-').map(Number)
        const dateObj = new Date(year, month - 1, day, 12, 0, 0) // Midday to be safe

        const data = await fetchHistoricalTransactions(dateObj)
        setHistoryData(data)
        setHasSearched(true)
        setIsLoading(false)
    }

    // Calculations
    const totalIncome = historyData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpense = historyData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const net = totalIncome - totalExpense

    // Find Closure Log
    const closureLog = historyData.find(t => t.description.includes("CIERRE DE TURNO"))

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-stone-300 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50">
                    <History className="w-4 h-4 text-stone-500" />
                    <span className="hidden sm:inline">Historial</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-white dark:bg-stone-950">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <History className="w-5 h-5 text-indigo-500" />
                        Historial de Cierres de Caja
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Search Bar */}
                    <div className="flex items-end gap-3 bg-stone-50 dark:bg-stone-900 p-4 rounded-lg border border-stone-100 dark:border-stone-800">
                        <div className="space-y-2 flex-1">
                            <Label>Seleccionar Fecha</Label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value)
                                    setHasSearched(false)
                                }}
                                className="bg-white dark:bg-stone-800"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={!selectedDate || isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading ? "Buscando..." : <>
                                <Search className="w-4 h-4 mr-2" /> Consultar
                            </>}
                        </Button>
                    </div>

                    {hasSearched && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-900/50">
                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> Ingresos
                                    </p>
                                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatMoney(totalIncome)}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 dark:bg-rose-900/10 dark:border-rose-900/50">
                                    <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <TrendingDown className="w-3 h-3" /> Gastos
                                    </p>
                                    <p className="text-2xl font-bold text-rose-700 dark:text-rose-400">{formatMoney(totalExpense)}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:bg-indigo-900/10 dark:border-indigo-900/50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-2xl" />
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Wallet className="w-3 h-3" /> Neto (Sistema)
                                    </p>
                                    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{formatMoney(net)}</p>
                                </div>
                            </div>

                            {/* Closure Status */}
                            {closureLog ? (
                                <div className="bg-stone-900 text-stone-300 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="font-bold text-white">Cierre Realizado:</span>
                                        <span>{closureLog.description}</span>
                                    </div>
                                    <span className="font-mono text-xs opacity-50">{format(new Date(closureLog.createdAt), "HH:mm aaa")}</span>
                                </div>
                            ) : (
                                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 p-3 rounded-lg text-sm text-center border border-amber-100 dark:border-amber-900/50">
                                    No se encontró registro de "Cierre de Turno" oficial para este día.
                                </div>
                            )}

                            {/* Detailed List */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-stone-100 dark:bg-stone-900 p-2 text-xs font-bold text-stone-500 uppercase flex justify-between px-4">
                                    <span>Movimiento</span>
                                    <span>Monto</span>
                                </div>
                                <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-950">
                                    {historyData.length === 0 ? (
                                        <div className="p-8 text-center text-gray-400 text-sm">Sin movimientos registrados</div>
                                    ) : (
                                        historyData.map(tx => (
                                            <div key={tx.id} className="p-3 px-4 flex justify-between items-center hover:bg-stone-50 dark:hover:bg-stone-900/50 text-sm">
                                                <div>
                                                    <p className="font-medium text-stone-700 dark:text-stone-300">{tx.description}</p>
                                                    <p className="text-[10px] text-stone-400 uppercase">{format(new Date(tx.createdAt), "HH:mm")} • {tx.category}</p>
                                                </div>
                                                <span className={cn(
                                                    "font-mono font-bold",
                                                    tx.type === 'income' ? "text-emerald-600" : "text-rose-600"
                                                )}>
                                                    {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
