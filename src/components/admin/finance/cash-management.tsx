"use client"

import { useEffect, useState } from "react"
import { useFinance } from "@/domains/finance"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/currency"
import { DailyCheckinPayments } from "./daily-checkin-payments"
import { ShiftClosureModal } from "./shift-closure-modal"
import { ShiftHistoryModal } from "./history-modal"
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Plus,
    Minus,
    History,
    ShoppingBag,
    Bus,
    Shirt,
    Coffee,
    Trash2,
    Edit2
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

export function CashManagementWidget() {
    const {
        transactions,
        cashBalance,
        isLoading,
        addTransaction,
        deleteTransaction,
        refreshFinanceData,
        getStats
    } = useFinance()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income')

    // Form State
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("other")

    useEffect(() => {
        refreshFinanceData()
        const interval = setInterval(refreshFinanceData, 30000) // Auto-refresh every 30s
        return () => clearInterval(interval)
    }, [refreshFinanceData])

    // Calculations 
    const cashTransactions = transactions.filter(t => t.paymentMethod === 'cash' || !t.paymentMethod)

    // We use the STORE cashBalance (All time) for the Big Number
    const currentBalance = cashBalance
    const { totalIncome: todayIncome, totalExpense: todayExpense } = getStats(cashTransactions)

    const handleQuickAction = (type: 'income' | 'expense', cat: string, defaultDesc: string) => {
        setTransactionType(type)
        setCategory(cat)
        setDescription(defaultDesc)
        setAmount("")
        setIsAddModalOpen(true)
    }

    const handleSubmit = async () => {
        if (!amount || isNaN(Number(amount))) return

        await addTransaction({
            amount: Number(amount),
            type: transactionType,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            category: category as any,
            description: description || (transactionType === 'income' ? 'Ingreso Varios' : 'Gasto Varios'),
            paymentMethod: 'cash'
        })

        setIsAddModalOpen(false)
        setAmount("")
        setDescription("")
    }

    // Adjustment State
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false)
    const [actualCash, setActualCash] = useState("")
    const [adjustmentReason, setAdjustmentReason] = useState("")

    const handleAdjustment = async () => {
        const actual = Number(actualCash)
        if (isNaN(actual)) return

        const difference = actual - currentBalance

        if (difference === 0) {
            setIsAdjustmentModalOpen(false)
            return
            // No change needed
        }

        if (!adjustmentReason) {
            toast.error("Debes indicar una razón para el ajuste")
            return
        }

        const isSurplus = difference > 0
        const absDiff = Math.abs(difference)

        await addTransaction({
            amount: absDiff,
            type: isSurplus ? 'income' : 'expense',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            category: 'adjustment' as any,
            description: `Arqueo: ${adjustmentReason} (${isSurplus ? 'Sobrante' : 'Faltante'})`,
            paymentMethod: 'cash'
        })

        toast.success(`Caja conciliada a ${formatMoney(actual)}`)
        setIsAdjustmentModalOpen(false)
        setActualCash("")
        setAdjustmentReason("")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        Caja Chica (Hoy)
                    </h2>
                    <Badge variant="outline" className="font-mono text-xs hidden sm:block">
                        {format(new Date(), "dd MMM yyyy", { locale: es })}
                    </Badge>
                </div>
                <div className="flex gap-2">
                    <ShiftHistoryModal />
                    <ShiftClosureModal />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. BALANCE CARD */}
                <Card className="col-span-1 md:col-span-1 bg-stone-900 text-white border-stone-800 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-1">
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">En Mano (Neto Hoy)</p>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-[10px] text-stone-400 hover:text-white hover:bg-white/10"
                                onClick={() => {
                                    setActualCash(currentBalance.toString())
                                    setIsAdjustmentModalOpen(true)
                                }}
                            >
                                <Edit2 className="w-3 h-3 mr-1" />
                                Modificar
                            </Button>
                        </div>
                        <h3 className="text-4xl font-bold font-heading tracking-tight">{formatMoney(currentBalance)}</h3>
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-stone-400 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-500" /> Ingresos
                            </span>
                            <span className="font-mono text-emerald-400 font-bold">+{formatMoney(todayIncome)}</span>
                        </div>
                        <div className="w-full h-px bg-white/10" />
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-stone-400 flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-rose-500" /> Gastos
                            </span>
                            <span className="font-mono text-rose-400 font-bold">-{formatMoney(todayExpense)}</span>
                        </div>
                    </div>
                </Card>

                {/* 2. QUICK ACTIONS & HISTORY */}
                <div className="col-span-1 md:col-span-2">
                    <Tabs defaultValue="checkins" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="checkins" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400">
                                Check-ins Hoy
                            </TabsTrigger>
                            <TabsTrigger value="general">Movimientos Generales</TabsTrigger>
                        </TabsList>

                        <TabsContent value="checkins" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <DailyCheckinPayments />
                        </TabsContent>

                        <TabsContent value="general" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Quick Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <Button
                                    variant="outline"
                                    className="h-auto py-3 flex flex-col gap-1 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 border-dashed border-stone-300 dark:border-stone-700"
                                    onClick={() => handleQuickAction('income', 'laundry', 'Venta Lavandería')}
                                >
                                    <Shirt className="w-5 h-5 text-emerald-500" />
                                    <span className="text-xs font-bold">Lavandería</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-auto py-3 flex flex-col gap-1 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 border-dashed border-stone-300 dark:border-stone-700"
                                    onClick={() => handleQuickAction('income', 'shuttle', 'Venta Shuttle')}
                                >
                                    <Bus className="w-5 h-5 text-emerald-500" />
                                    <span className="text-xs font-bold">Shuttle</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-auto py-3 flex flex-col gap-1 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 border-dashed border-stone-300 dark:border-stone-700"
                                    onClick={() => handleQuickAction('income', 'bar', 'Venta Bar/Bebidas')}
                                >
                                    <Coffee className="w-5 h-5 text-emerald-500" />
                                    <span className="text-xs font-bold">Bar/Tienda</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-auto py-3 flex flex-col gap-1 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 border-dashed border-stone-300 dark:border-stone-700"
                                    onClick={() => handleQuickAction('expense', 'supplies', 'Gasto Insumos')}
                                >
                                    <ShoppingBag className="w-5 h-5 text-rose-500" />
                                    <span className="text-xs font-bold">Gasto Varios</span>
                                </Button>
                            </div>

                            {/* Transaction List */}
                            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 h-48 overflow-y-auto">
                                <div className="p-3 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm z-10 flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Historial Diario</h4>
                                </div>
                                {transactions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-stone-400 gap-2">
                                        <History className="w-5 h-5 opacity-50" />
                                        <span className="text-xs">Sin movimientos hoy</span>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-stone-100 dark:divide-stone-800">
                                        {transactions.map((tx) => (
                                            <div key={tx.id} className="p-3 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                                                        tx.type === 'income'
                                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                                    )}>
                                                        {tx.type === 'income' ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{tx.description}</p>
                                                        <p className="text-[10px] text-stone-500 uppercase tracking-wide">{format(new Date(tx.createdAt), 'HH:mm')} • {tx.category}</p>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "font-mono font-bold text-sm",
                                                    tx.type === 'income' ? "text-emerald-600" : "text-rose-600"
                                                )}>
                                                    {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                    onClick={() => deleteTransaction(tx.id)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div >

            {/* Quick Record Modal */}
            < Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{transactionType === 'income' ? 'Registrar Ingreso' : 'Registrar Gasto'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="uppercase tracking-widest">{category}</Badge>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Input
                                placeholder="Ej: Jabón, Taxi, Cerveza..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Monto (Q)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-stone-400 font-bold">Q</span>
                                <Input
                                    type="number"
                                    className="pl-8 text-lg font-bold"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                        <Button
                            onClick={handleSubmit}
                            className={cn(transactionType === 'income' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700")}
                        >
                            Guardar {transactionType === 'income' ? 'Ingreso' : 'Gasto'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >

            {/* Cash Adjustment Modal */}
            < Dialog open={isAdjustmentModalOpen} onOpenChange={setIsAdjustmentModalOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajuste de Caja Chica</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-stone-500">
                            Ingresa la cantidad real que tienes físicamente. El sistema creará un movimiento automático (Sobrante o Faltante) para cuadrar la caja.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">
                                <span className="text-xs text-stone-400 uppercase font-bold block mb-1">Sistema</span>
                                <span className="text-xl font-bold font-mono">{formatMoney(currentBalance)}</span>
                            </div>
                            <div className="space-y-2">
                                <Label>Real (Físico)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-stone-400 font-bold">Q</span>
                                    <Input
                                        type="number"
                                        className="pl-8 text-lg font-bold"
                                        placeholder="0.00"
                                        value={actualCash}
                                        onChange={(e) => setActualCash(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>

                        {actualCash && !isNaN(Number(actualCash)) && Math.abs(Number(actualCash) - currentBalance) > 0 && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className={cn(
                                    "p-3 rounded border text-sm font-bold flex justify-between items-center",
                                    Number(actualCash) - currentBalance > 0
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                                        : Number(actualCash) - currentBalance < 0
                                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800"
                                            : "bg-stone-100 text-stone-500 border-stone-200"
                                )}>
                                    <span>{Number(actualCash) - currentBalance > 0 ? "Sobrante Detectado" : "Faltante Detectado"}</span>
                                    <span>{formatMoney(Math.abs(Number(actualCash) - currentBalance))}</span>
                                </div>

                                <div className="space-y-2">
                                    <Label>Justificación del Ajuste (Obligatorio)</Label>
                                    <Input
                                        placeholder="Ej: Cambio mal dado, Monedas encontradas..."
                                        value={adjustmentReason}
                                        onChange={e => setAdjustmentReason(e.target.value)}
                                        className="bg-stone-50"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAdjustmentModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAdjustment}>
                            Confirmar Ajuste
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </div >
    )
}
