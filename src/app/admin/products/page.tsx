"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Plus, Search, Pencil, Trash2, Package, Beer, Coffee, Cookie, Zap, X } from "lucide-react"

// Types
interface Product {
    id: string
    name: string
    price: number
    category: 'beer' | 'soda' | 'water' | 'snack' | 'other'
    icon: string
    active: boolean
    created_at: string
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Modal State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        price: "0",
        category: "beer",
        icon: "🍺",
        active: true
    })

    // Fetch Products
    const fetchProducts = async () => {
        // setLoading(true) - Removed to avoid useEffect warning. Initial state is true.
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            console.error(error)
            toast.error("Error al cargar productos")
        } else {
            setProducts(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        // eslint-disable-next-line
        fetchProducts()
    }, [])

    // Form Handlers
    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                name: product.name,
                price: product.price.toString(),
                category: product.category,
                icon: product.icon,
                active: product.active
            })
        } else {
            setEditingProduct(null)
            setFormData({
                name: "",
                price: "0",
                category: "beer",
                icon: "🍺",
                active: true
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!formData.name || !formData.price) return

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            icon: formData.icon,
            active: formData.active
        }

        let error
        if (editingProduct) {
            const { error: err } = await supabase
                .from('products')
                .update(payload)
                .eq('id', editingProduct.id)
            error = err
        } else {
            const { error: err } = await supabase
                .from('products')
                .insert([payload])
            error = err
        }

        if (error) {
            console.error(error)
            toast.error("Error al guardar producto")
        } else {
            toast.success(editingProduct ? "Producto actualizado" : "Producto creado")
            setIsDialogOpen(false)
            fetchProducts()
        }
    }

    const toggleActive = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('products')
            .update({ active: !currentStatus })
            .eq('id', id)

        if (error) {
            toast.error("No se pudo cambiar el estado")
        } else {
            // Optimistic update
            setProducts(products.map(p => p.id === id ? { ...p, active: !currentStatus } : p))
            toast.success("Estado actualizado")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este producto? Esto podría afectar historiales de cargos.")) return

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error("Error al eliminar")
        } else {
            toast.success("Producto eliminado")
            fetchProducts()
        }
    }

    // Filter Logic
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <Package className="w-8 h-8 text-amber-500" />
                        Minibar & Extras
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400">Gestiona el inventario de productos para el Honesty Bar.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 bg-white dark:bg-stone-900 p-2 rounded-lg border border-stone-200 dark:border-stone-800 shadow-sm md:w-96">
                <Search className="w-4 h-4 text-stone-400 ml-2" />
                <Input
                    placeholder="Buscar producto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 h-8"
                />
            </div>

            {/* Table */}
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
                <Table>
                    <TableHeader className="bg-stone-50 dark:bg-stone-950">
                        <TableRow>
                            <TableHead className="w-[80px]">Icono</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-stone-500">
                                    Cargando inventario...
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-stone-500">
                                    No se encontraron productos. ¡Agrega el primero!
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id} className="group hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                    <TableCell className="font-medium text-2xl">{product.icon}</TableCell>
                                    <TableCell className="font-medium text-stone-900 dark:text-stone-100">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {product.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono font-bold text-stone-700 dark:text-stone-300">
                                        Q{product.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={product.active}
                                                onCheckedChange={() => toggleActive(product.id, product.active)}
                                            />
                                            <span className="text-xs text-stone-500">{product.active ? 'Activo' : 'Inactivo'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                                                <Pencil className="w-4 h-4 text-indigo-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                                <Trash2 className="w-4 h-4 text-rose-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    {/* Manual Close Button for consistency */}
                    <button
                        onClick={() => setIsDialogOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-full transition-all z-50 text-stone-500"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                        <DialogDescription>
                            Define los detalles del item para el menú del Honesty Bar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nombre</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Precio (Q)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Categoría</Label>
                            <Select
                                value={formData.category}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onValueChange={(val) => setFormData({ ...formData, category: val as any })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beer">Cerveza 🍺</SelectItem>
                                    <SelectItem value="soda">Gaseosa 🥤</SelectItem>
                                    <SelectItem value="water">Agua 💧</SelectItem>
                                    <SelectItem value="snack">Snack 🍿</SelectItem>
                                    <SelectItem value="other">Otro ⚡</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="icon" className="text-right">Emoji</Label>
                            <div className="col-span-3 flex gap-2">
                                <div className="flex-none bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center w-12 h-12 border border-stone-200 dark:border-stone-700">
                                    <span className="text-2xl">{formData.icon}</span>
                                </div>
                                <ScrollArea className="flex-1 w-full border border-stone-200 dark:border-stone-800 rounded-lg h-12 p-1">
                                    <div className="flex gap-1">
                                        {['🍺', '🍻', '🍷', '🍸', '🥤', '🧃', '💧', '🧉', '☕', '🍵', '🍿', '🥜', '🥔', '🍫', '🍪', '🍰', '🥐', '🥪', '🔋', '🔌', '🧴', '🧵', '🛁'].map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => setFormData({ ...formData, icon: emoji })}
                                                className="w-10 h-10 flex-none text-xl hover:bg-stone-100 dark:hover:bg-stone-700 rounded-md transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                                                type="button"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} className="bg-stone-900 text-white dark:bg-white dark:text-stone-900">
                            {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
