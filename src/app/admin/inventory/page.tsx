"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
    Package,
    Plus,
    Search,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    ArrowRightLeft,
    Beer,
    SprayCan,
    ShoppingBag,
    Archive
} from "lucide-react"
import { formatMoney } from "@/lib/currency"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function InventoryPage() {
    const { inventory, fetchInventory, addInventoryItem, updateStock } = useAppStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState<string>("all")

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isStockModalOpen, setIsStockModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<string | null>(null)
    const [stockAction, setStockAction] = useState<'in' | 'out'>('in')

    // Form States
    const [newItem, setNewItem] = useState({ name: "", category: "bebidas", currentStock: 0, minStockAlert: 5, unit: "unidad", costPrice: 0 })
    const [stockMovement, setStockMovement] = useState({ quantity: 1, reason: "" })

    useEffect(() => {
        fetchInventory()
    }, [])

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory
        return matchesSearch && matchesCategory
    })

    const handleAddItem = async () => {
        if (!newItem.name) return toast.error("El nombre es requerido")
        await addInventoryItem({
            ...newItem,
            category: newItem.category as "bebidas" | "limpieza" | "amenities" | "insumos" | "otros"
        })
        setIsAddModalOpen(false)
        setNewItem({ name: "", category: "bebidas", currentStock: 0, minStockAlert: 5, unit: "unidad", costPrice: 0 })
    }

    const handleStockUpdate = async () => {
        if (!selectedItem) return
        if (stockMovement.quantity <= 0) return toast.error("La cantidad debe ser mayor a 0")

        await updateStock(selectedItem, stockAction, stockMovement.quantity, stockMovement.reason || (stockAction === 'in' ? 'Compra' : 'Consumo'))
        setIsStockModalOpen(false)
        setStockMovement({ quantity: 1, reason: "" })
        setSelectedItem(null)
    }

    const openStockModal = (itemId: string, action: 'in' | 'out') => {
        setSelectedItem(itemId)
        setStockAction(action)
        setStockMovement({ quantity: 1, reason: action === 'in' ? 'Compra' : 'Venta/Consumo' })
        setIsStockModalOpen(true)
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'bebidas': return <Beer className="w-4 h-4" />
            case 'limpieza': return <SprayCan className="w-4 h-4" />
            case 'amenities': return <ShoppingBag className="w-4 h-4" />
            default: return <Package className="w-4 h-4" />
        }
    }

    // Stats
    const totalItems = inventory.length
    const lowStockItems = inventory.filter(i => i.currentStock <= i.minStockAlert).length
    const totalValue = inventory.reduce((acc, item) => acc + (item.currentStock * item.costPrice), 0)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-3">
                        <Archive className="w-8 h-8 text-amber-500" />
                        Bodega & Inventario
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Gestión de insumos, bebidas y suministros.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Producto
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/50 dark:bg-stone-900/50 backdrop-blur border-stone-200 dark:border-stone-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-500">Total Items</CardTitle>
                        <Package className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItems}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/50 dark:bg-stone-900/50 backdrop-blur border-stone-200 dark:border-stone-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-500">Valor Inventario</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono">{formatMoney(totalValue)}</div>
                    </CardContent>
                </Card>
                <Card className={cn(
                    "bg-white/50 dark:bg-stone-900/50 backdrop-blur border-stone-200 dark:border-stone-800",
                    lowStockItems > 0 && "border-amber-500/50 bg-amber-50/50 dark:bg-amber-900/10"
                )}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-500">Alertas Stock</CardTitle>
                        <AlertTriangle className={cn("h-4 w-4", lowStockItems > 0 ? "text-amber-500" : "text-stone-500")} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", lowStockItems > 0 && "text-amber-600 dark:text-amber-500")}>
                            {lowStockItems} <span className="text-sm font-normal text-stone-500">productos bajos</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <Input
                        placeholder="Buscar producto..."
                        className="pl-9 bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus-visible:ring-amber-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="bebidas">Bebidas</SelectItem>
                        <SelectItem value="limpieza">Limpieza</SelectItem>
                        <SelectItem value="amenities">Amenities/Baño</SelectItem>
                        <SelectItem value="insumos">Insumos Cocina</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredInventory.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="uppercase tracking-widest text-[10px] flex items-center gap-1">
                                    {getCategoryIcon(item.category)}
                                    {item.category}
                                </Badge>
                                {item.currentStock <= item.minStockAlert && (
                                    <Badge variant="destructive" className="animate-pulse">BAJO STOCK</Badge>
                                )}
                            </div>
                            <CardTitle className="text-lg font-bold mt-2 truncate" title={item.name}>{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-1">Stock Actual</p>
                                    <p className={cn(
                                        "text-3xl font-bold font-mono",
                                        item.currentStock <= item.minStockAlert ? "text-rose-500" : "text-stone-900 dark:text-emerald-400"
                                    )}>
                                        {item.currentStock} <span className="text-sm font-sans text-stone-500 font-medium">{item.unit}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-stone-400">Costo Unit.</p>
                                    <p className="text-sm font-medium text-stone-600 dark:text-stone-400">{formatMoney(item.costPrice)}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-stone-50 dark:bg-stone-950/50 p-2 flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:hover:bg-emerald-900/20"
                                onClick={() => openStockModal(item.id, 'in')}
                            >
                                <TrendingUp className="w-4 h-4 mr-1" />
                                Entrada
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-900/20"
                                onClick={() => openStockModal(item.id, 'out')}
                            >
                                <TrendingDown className="w-4 h-4 mr-1" />
                                Salida
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Add Item Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nuevo Producto</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Categoría</Label>
                                <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bebidas">Bebidas</SelectItem>
                                        <SelectItem value="limpieza">Limpieza</SelectItem>
                                        <SelectItem value="amenities">Amenities/Baño</SelectItem>
                                        <SelectItem value="insumos">Insumos Cocina</SelectItem>
                                        <SelectItem value="otros">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unidad</Label>
                                <Select value={newItem.unit} onValueChange={(v) => setNewItem({ ...newItem, unit: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unidad">Unidad</SelectItem>
                                        <SelectItem value="litro">Litro</SelectItem>
                                        <SelectItem value="caja">Caja/Pack</SelectItem>
                                        <SelectItem value="kg">Kilogramo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="stock">Stock Inicial</Label>
                                <Input type="number" id="stock" value={newItem.currentStock} onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="min">Alerta Mín</Label>
                                <Input type="number" id="min" value={newItem.minStockAlert} onChange={(e) => setNewItem({ ...newItem, minStockAlert: Number(e.target.value) })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cost">Costo (Q)</Label>
                                <Input type="number" id="cost" value={newItem.costPrice} onChange={(e) => setNewItem({ ...newItem, costPrice: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddItem}>Crear Producto</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Stock Movement Modal */}
            <Dialog open={isStockModalOpen} onOpenChange={setIsStockModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{stockAction === 'in' ? 'Registrar Entrada' : 'Registrar Salida'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center justify-center p-6 bg-stone-50 dark:bg-stone-900 rounded-xl mb-4">
                            <div className="text-center">
                                <p className="text-sm font-medium text-stone-500 mb-2">Cantidad</p>
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" size="icon" onClick={() => setStockMovement(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}>-</Button>
                                    <span className="text-4xl font-bold font-mono">{stockMovement.quantity}</span>
                                    <Button variant="outline" size="icon" onClick={() => setStockMovement(prev => ({ ...prev, quantity: prev.quantity + 1 }))}>+</Button>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Motivo / Nota</Label>
                            <Input
                                placeholder={stockAction === 'in' ? "Ej: Compra Mayorista" : "Ej: Venta Bar, Consumo Staff..."}
                                value={stockMovement.reason}
                                onChange={(e) => setStockMovement({ ...stockMovement, reason: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className={cn("w-full", stockAction === 'in' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700")}
                            onClick={handleStockUpdate}
                        >
                            Confirmar {stockAction === 'in' ? 'Entrada' : 'Salida'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
