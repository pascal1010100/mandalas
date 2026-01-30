"use client"

import { useState, useMemo } from "react"
import { useFinance } from "@/domains/finance"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatMoney } from "@/lib/currency"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Printer, Calculator, AlertTriangle, CheckCircle, ClipboardList, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function ShiftClosureModal() {
    const {
        transactions,
        cashBalance,
        registerShiftClosure
    } = useFinance()
    const [open, setOpen] = useState(false)
    const [physicalCash, setPhysicalCash] = useState("")

    // 1. Calculate Shift Data based on Selected Date
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Reset date when opening if needed, or keep persistent? 
    // Keeping it persistent while open allows navigation. 
    // Resetting on close is handled by component lifecycle if it unmounts, but Dialog keeps it mounted?
    // Actually, DialogContent is conditionally rendered by Radix if configured, but let's leave state as is.

    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')

    const todaysTransactions = useMemo(() => {
        return transactions.filter(t => {
            const txDate = new Date(t.createdAt)
            const txDateStr = format(txDate, 'yyyy-MM-dd')
            return txDateStr === selectedDateStr && (t.paymentMethod === 'cash' || !t.paymentMethod) && Number(t.amount) > 0
        })
    }, [transactions, selectedDateStr])

    const incomeTotal = todaysTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const expenseTotal = todaysTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const netFlow = incomeTotal - expenseTotal

    // Logic: Opening Balance = Current Balance - Net Flow of Today (ONLY IF TODAY)
    // If viewing past dates, we need a different logic or just show the flow for that day.
    // For simplicity in this "Audit" mode, we will just show the Cash Flow for that specific day.
    // Calculating exact "Opening Balance" for a past day is complex without a daily snapshot table.
    // We will hide "Opening Balance" and "Final Balance" if not viewing Today, OR just show global current balance as reference.
    // Better: Show "Flujo del Día" prominent. 

    // For now, let's keep the logic simple: Opening Balance display only makes sense relative to *current* cash if looking at today.
    const isToday = selectedDateStr === format(new Date(), 'yyyy-MM-dd')
    const openingBalance = isToday ? cashBalance - netFlow : 0 // Placeholder for past dates

    // --- Denomination Logic (Arqueo) ---
    const [counts, setCounts] = useState({
        q200: 0, q100: 0, q50: 0, q20: 0, q10: 0, q5: 0,
        q1: 0, q050: 0, q025: 0
    })

    const [useDenominations, setUseDenominations] = useState(false)

    const calculatedTotal = useMemo(() => {
        return (counts.q200 * 200) + (counts.q100 * 100) + (counts.q50 * 50) +
            (counts.q20 * 20) + (counts.q10 * 10) + (counts.q5 * 5) +
            (counts.q1 * 1) + (counts.q050 * 0.50) + (counts.q025 * 0.25)
    }, [counts])

    // Discrepancy Logic
    const physical = useDenominations ? calculatedTotal : Number(physicalCash)
    // Discrepancy only makes sense against "Expected System Balance".
    // If today: Expected = cashBalance.
    // If past: Expected is harder to know without snapshots.
    // We will disable Discrepancy Check for past dates or warn user.
    const discrepancy = !isNaN(physical) ? physical - (isToday ? cashBalance : 0) : 0
    const hasDiscrepancy = Math.abs(discrepancy) > 0.01

    const handlePrint = () => {
        window.print()
    }

    const handleCloseShift = async () => {
        if (!physicalCash && !useDenominations) return;

        // Use formatted visual strings for the log or raw numbers? 
        // Store expects numbers/data.
        const finalPhysical = physical
        const finalSystem = isToday ? cashBalance : 0
        const finalDiff = discrepancy

        try {
            await registerShiftClosure({
                physicalCount: finalPhysical,
                systemCount: finalSystem,
                difference: finalDiff
            })
            setOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate)
        newDate.setDate(selectedDate.getDate() + days)
        setSelectedDate(newDate)
        // Reset counts when changing date to avoid confusion?
        // setPhysicalCash("")
        // setCounts(...)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-stone-900 text-stone-100 hover:bg-stone-800 border border-stone-700 shadow-xl w-full sm:w-auto">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Corte de Caja
                </Button>
            </DialogTrigger>
            {/* SCROLL STRATEGY: Whole modal scrolls. Footer is sticky at bottom. */}
            <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0 gap-0 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 display-block custom-scrollbar">
                <DialogTitle className="sr-only">Reporte de Corte de Caja</DialogTitle>

                {/* PRINTABLE AREA (Natural Height) */}
                <div id="printable-area" className="p-4 sm:p-8 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 shadow-sm print:shadow-none print:w-full print:overflow-visible">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start border-b border-stone-200 dark:border-stone-800 pb-6 mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold font-heading uppercase tracking-widest">Corte de Caja</h2>
                            <p className="text-stone-500 text-sm mt-1">Reporte de Cierre de Turno</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                            {/* Date Navigation */}
                            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 p-1 rounded-lg border border-stone-200 dark:border-stone-800 print:hidden">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => changeDate(-1)}>
                                    <span className="sr-only">Anterior</span>
                                    ←
                                </Button>
                                <span className="font-mono font-bold text-sm min-w-[100px] text-center">
                                    {format(selectedDate, 'dd/MM/yyyy', { locale: es })}
                                </span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => changeDate(1)} disabled={isToday}>
                                    <span className="sr-only">Siguiente</span>
                                    →
                                </Button>
                            </div>
                            {/* Print-only Date */}
                            <p className="font-mono font-bold text-lg hidden print:block">
                                {format(selectedDate, 'dd/MM/yyyy', { locale: es })}
                            </p>

                            <p className="text-sm text-stone-400">{format(new Date(), 'HH:mm')} hrs</p>
                            <p className="text-xs text-stone-400 mt-1 uppercase">Usuario: Recepción</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {isToday ? (
                            <div className="p-4 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
                                <p className="text-xs uppercase text-stone-500 font-bold mb-1 truncate">Saldo Inicial</p>
                                <p className="font-mono text-lg sm:text-lg font-bold text-stone-700 dark:text-stone-300 truncate" title={formatMoney(openingBalance)}>{formatMoney(openingBalance)}</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 opacity-50">
                                <p className="text-xs uppercase text-stone-500 font-bold mb-1 text-center">Solo Flujo</p>
                                <p className="text-xs text-center text-stone-400">Histórico</p>
                            </div>
                        )}

                        <div className="p-4 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
                            <p className="text-xs uppercase text-stone-500 font-bold mb-1 truncate">Flujo Neto</p>
                            <p className={cn("font-mono text-lg sm:text-lg font-bold truncate", netFlow >= 0 ? "text-emerald-600" : "text-rose-600")} title={formatMoney(netFlow)}>
                                {netFlow >= 0 ? '+' : ''}{formatMoney(netFlow)}
                            </p>
                        </div>

                        {isToday ? (
                            <div className="p-4 bg-stone-900 dark:bg-black rounded-lg text-white border border-stone-700 overflow-hidden">
                                <p className="text-xs uppercase text-stone-400 font-bold mb-1 truncate">Saldo Final</p>
                                <p className="font-mono text-xl sm:text-2xl font-bold truncate" title={formatMoney(cashBalance)}>{formatMoney(cashBalance)}</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 opacity-50">
                                <p className="text-xs uppercase text-stone-500 font-bold mb-1 text-center">Saldo Final</p>
                                <p className="text-xs text-center text-stone-400">No disponible</p>
                            </div>
                        )}

                    </div>

                    {/* Transaction Tables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-xs mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Ingresos
                            </h3>
                            {todaysTransactions.filter(t => t.type === 'income').length === 0 ? (
                                <p className="text-xs text-stone-400 italic">Sin ingresos este día.</p>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-stone-400 uppercase border-b border-stone-100 dark:border-stone-800">
                                        <tr>
                                            <th className="pb-2 font-medium">Concepto</th>
                                            <th className="pb-2 text-right font-medium">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                        {todaysTransactions.filter(t => t.type === 'income').map(t => (
                                            <tr key={t.id}>
                                                <td className="py-2 pr-2">{t.description}</td>
                                                <td className="py-2 text-right font-mono text-stone-600 dark:text-stone-400">{formatMoney(Number(t.amount))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t border-stone-200 dark:border-stone-700 font-bold">
                                        <tr>
                                            <td className="pt-2 text-right text-xs uppercase text-stone-500">Total Ingresos</td>
                                            <td className="pt-2 text-right font-mono text-emerald-600">{formatMoney(incomeTotal)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-rose-700 dark:text-rose-400 uppercase text-xs mb-3 flex items-center gap-2">
                                <TrendingDown className="w-4 h-4" /> Gastos
                            </h3>
                            {todaysTransactions.filter(t => t.type === 'expense').length === 0 ? (
                                <p className="text-xs text-stone-400 italic">Sin gastos este día.</p>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-stone-400 uppercase border-b border-stone-100 dark:border-stone-800">
                                        <tr>
                                            <th className="pb-2 font-medium">Concepto</th>
                                            <th className="pb-2 text-right font-medium">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                        {todaysTransactions.filter(t => t.type === 'expense').map(t => (
                                            <tr key={t.id}>
                                                <td className="py-2 pr-2">{t.description}</td>
                                                <td className="py-2 text-right font-mono text-stone-600 dark:text-stone-400">{formatMoney(Number(t.amount))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t border-stone-200 dark:border-stone-700 font-bold">
                                        <tr>
                                            <td className="pt-2 text-right text-xs uppercase text-stone-500">Total Gastos</td>
                                            <td className="pt-2 text-right font-mono text-rose-600">{formatMoney(expenseTotal)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Reconciliation Section (Print Friendly) */}
                    {isToday ? (
                        <div className="border-t-2 border-dashed border-stone-300 dark:border-stone-700 pt-6 mt-6 break-inside-avoid">
                            <div className="flex flex-col sm:flex-row justify-between items-end gap-6">

                                {/* Input / Control Area */}
                                <div className="w-full sm:w-1/2">

                                    {/* Simple Input mode */}
                                    {!useDenominations && (
                                        <div className="print:hidden mb-4">
                                            <label className="block text-xs font-bold uppercase text-stone-500 mb-2 flex items-center gap-2">
                                                <Calculator className="w-4 h-4" />
                                                Conteo Físico (Efectivo Real)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-stone-400 font-bold">Q</span>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="pl-8 font-mono font-bold text-lg bg-stone-50 dark:bg-stone-900 border-stone-300"
                                                    value={physicalCash}
                                                    onChange={(e) => setPhysicalCash(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-[10px] text-stone-400 mt-1">Ingresa cuánto dinero tienes en mano.</p>
                                        </div>
                                    )}

                                    {/* Denomination Toggle & Inputs */}
                                    <div className="print:hidden">
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                id="useDenominations"
                                                checked={useDenominations}
                                                onChange={e => setUseDenominations(e.target.checked)}
                                                className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <label htmlFor="useDenominations" className="text-xs font-bold uppercase text-stone-500 cursor-pointer select-none">
                                                Usar Arqueo Detallado (Billetes)
                                            </label>
                                        </div>

                                        {useDenominations && (
                                            <div className="grid grid-cols-3 gap-2 bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 animate-in fade-in slide-in-from-top-2">
                                                {[200, 100, 50, 20, 10, 5].map(val => (
                                                    <div key={val} className="relative">
                                                        <span className="absolute left-2 top-1.5 text-[10px] text-stone-400 font-bold">Q{val}</span>
                                                        <Input
                                                            type="number"
                                                            className="h-8 pl-8 text-xs font-mono"
                                                            placeholder="0"
                                                            min={0}
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            value={(counts as any)[`q${val}`] || ''}
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            onChange={e => setCounts(prev => ({ ...prev, [`q${val}`]: Number(e.target.value) }))}
                                                        />
                                                    </div>
                                                ))}
                                                <div className="col-span-3 flex gap-2 border-t border-stone-200 dark:border-stone-800 pt-2 mt-1">
                                                    {[1, 0.50, 0.25].map(val => (
                                                        <div key={val} className="relative w-full">
                                                            <span className="absolute left-2 top-1.5 text-[10px] text-stone-400 font-bold">Q{val}</span>
                                                            <Input
                                                                type="number"
                                                                className="h-8 pl-8 text-xs font-mono"
                                                                placeholder="0"
                                                                min={0}
                                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                value={(counts as any)[`q${val.toString().replace('.', '')}`] || ''}
                                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                onChange={e => setCounts(prev => ({ ...prev, [`q${val.toString().replace('.', '')}`]: Number(e.target.value) }))}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Print Only: Value Line */}
                                    <div className="hidden print:block border-b border-stone-800 w-full mt-4">
                                        <p className="font-mono text-xl">{physical > 0 ? formatMoney(physical) : '____________________'}</p>
                                    </div>

                                    {/* Print Only: Breakdown */}
                                    {useDenominations && (
                                        <div className="hidden print:block mt-2 text-[10px] font-mono text-stone-500">
                                            <p className="font-bold border-b border-stone-300 mb-1">Detalle:</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {[200, 100, 50, 20, 10, 5].map(val => (
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    (counts as any)[`q${val}`] > 0 && <span key={val}>Q{val} x {(counts as any)[`q${val}`]}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Verification Result */}
                                <div className="w-full sm:w-1/2 bg-stone-100 dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-stone-600 dark:text-stone-300">Diferencia:</span>
                                        {(!physicalCash && !useDenominations) ? (
                                            <span className="font-mono font-bold text-lg text-stone-400">---</span>
                                        ) : (
                                            <span className={cn(
                                                "font-mono font-bold text-lg",
                                                hasDiscrepancy ? "text-rose-600" : "text-emerald-600"
                                            )}>
                                                {formatMoney(discrepancy)}
                                            </span>
                                        )}
                                    </div>

                                    {(!physicalCash && !useDenominations) ? (
                                        <div className="flex items-center gap-2 text-stone-500 text-xs font-bold bg-stone-200 dark:bg-stone-800 p-2 rounded">
                                            <ClipboardList className="w-4 h-4" />
                                            <span>Esperando Conteo...</span>
                                        </div>
                                    ) : hasDiscrepancy ? (
                                        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold bg-rose-50 dark:bg-rose-900/20 p-2 rounded">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span>Descuadre: {discrepancy > 0 ? "Sobra Dinero" : "Falta Dinero"}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Caja Cuadrada (Perfecto)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8 p-4 bg-stone-100 dark:bg-stone-900 rounded-lg text-center text-stone-500 text-sm italic">
                            Visualizando registros históricos. No se permite realizar cierre de caja para fechas pasadas.
                        </div>
                    )}

                    {/* Signature Area (Print Only) */}
                    <div className="hidden print:flex justify-between mt-16 pt-8">
                        <div className="text-center">
                            <div className="w-48 border-t border-stone-900 h-1 mb-2"></div>
                            <p className="text-xs uppercase text-stone-500 font-bold">Firma Recepcionista</p>
                        </div>
                        <div className="text-center">
                            <div className="w-48 border-t border-stone-900 h-1 mb-2"></div>
                            <p className="text-xs uppercase text-stone-500 font-bold">Firma Gerencia</p>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons (Hidden on Print) */}
                {/* Footer Buttons (Sticky at bottom, visible but scrolls with it if needed, wait, sticky makes it float) */}
                <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex justify-between gap-2 print:hidden z-20 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)]">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={handlePrint} className="bg-stone-200 text-stone-800 hover:bg-stone-300">
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir
                        </Button>
                        <Button
                            onClick={handleCloseShift}
                            disabled={(!physicalCash && !useDenominations) || !isToday}
                            className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-md disabled:bg-stone-300 disabled:cursor-not-allowed"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Finalizar Turno
                        </Button>
                    </div>
                </div>

                {/* Print Styles Fixed */}
                <style jsx global>{`
                    @media print {
                        body {
                            visibility: hidden;
                        }
                        #printable-area {
                            visibility: visible;
                            position: fixed;
                            left: 0;
                            top: 0;
                            width: 100vw;
                            height: 100vh;
                            z-index: 9999;
                            background: white !important;
                            color: black !important;
                            overflow: visible;
                            padding: 20px !important;
                        }
                        #printable-area * {
                            visibility: visible;
                        }
                        /* Hide dark mode overrides explicitly */
                        .dark #printable-area { background: white !important; color: black !important; }
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    )
}
