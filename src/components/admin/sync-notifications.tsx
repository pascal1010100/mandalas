"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
    CheckCircle, 
    AlertTriangle, 
    Info, 
    X,
    Calendar,
    RefreshCw,
    Wifi,
    WifiOff
} from "lucide-react"

interface SyncNotification {
    id: string
    type: 'success' | 'warning' | 'error' | 'info'
    title: string
    message: string
    timestamp: Date
    roomId?: string
    roomName?: string
    action?: {
        label: string
        onClick: () => void
    }
    autoHide?: boolean
}

export function SyncNotifications() {
    const [notifications, setNotifications] = useState<SyncNotification[]>([])
    const [isVisible, setIsVisible] = useState(true)

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    // Listen for sync events
    useEffect(() => {
        const handleSyncEvent = (event: CustomEvent) => {
            const { type, roomId, roomName, status, details } = event.detail
            
            let notification: SyncNotification | null = null
            
            switch (type) {
                case 'sync_start':
                    notification = {
                        id: `sync-start-${roomId}-${Date.now()}`,
                        type: 'info',
                        title: 'Sincronización iniciada',
                        message: `Sincronizando ${roomName || roomId}...`,
                        timestamp: new Date(),
                        roomId,
                        roomName,
                        autoHide: false
                    }
                    break
                    
                case 'sync_success':
                    notification = {
                        id: `sync-success-${roomId}-${Date.now()}`,
                        type: 'success',
                        title: 'Sincronización completada',
                        message: `${roomName || roomId}: ${details?.imported || 0} eventos importados`,
                        timestamp: new Date(),
                        roomId,
                        roomName,
                        autoHide: true
                    }
                    break
                    
                case 'sync_error':
                    notification = {
                        id: `sync-error-${roomId}-${Date.now()}`,
                        type: 'error',
                        title: 'Error de sincronización',
                        message: `${roomName || roomId}: ${details?.error || 'Error desconocido'}`,
                        timestamp: new Date(),
                        roomId,
                        roomName,
                        action: {
                            label: 'Reintentar',
                            onClick: () => {
                                // Trigger retry sync
                                window.dispatchEvent(new CustomEvent('retry-sync', { detail: { roomId } }))
                            }
                        },
                        autoHide: false
                    }
                    break
                    
                case 'sync_warning':
                    notification = {
                        id: `sync-warning-${roomId}-${Date.now()}`,
                        type: 'warning',
                        title: 'Advertencia de sincronización',
                        message: `${roomName || roomId}: ${details?.warning || 'Advertencia'}`,
                        timestamp: new Date(),
                        roomId,
                        roomName,
                        autoHide: true
                    }
                    break
                    
                case 'connection_lost':
                    notification = {
                        id: `connection-lost-${Date.now()}`,
                        type: 'error',
                        title: 'Conexión perdida',
                        message: 'Se ha perdido la conexión a internet. La sincronización automática está pausada.',
                        timestamp: new Date(),
                        autoHide: false
                    }
                    break
                    
                case 'connection_restored':
                    notification = {
                        id: `connection-restored-${Date.now()}`,
                        type: 'success',
                        title: 'Conexión restaurada',
                        message: 'La conexión a internet ha sido restaurada. Reanudando sincronización automática.',
                        timestamp: new Date(),
                        autoHide: true
                    }
                    break
            }
            
            if (notification) {
                setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep max 10 notifications
                
                // Auto-hide after delay
                if (notification.autoHide) {
                    setTimeout(() => {
                        removeNotification(notification.id)
                    }, 5000)
                }
            }
        }

        window.addEventListener('sync-event', handleSyncEvent as EventListener)
        
        return () => {
            window.removeEventListener('sync-event', handleSyncEvent as EventListener)
        }
    }, [])

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => {
            const notification: SyncNotification = {
                id: `online-${Date.now()}`,
                type: 'success',
                title: 'Conexión restaurada',
                message: 'Conexión a internet restaurada',
                timestamp: new Date(),
                autoHide: true
            }
            
            setNotifications(prev => [notification, ...prev.slice(0, 9)])
            
            setTimeout(() => {
                removeNotification(notification.id)
            }, 3000)
        }

        const handleOffline = () => {
            const notification: SyncNotification = {
                id: `offline-${Date.now()}`,
                type: 'error',
                title: 'Sin conexión',
                message: 'Conexión a internet perdida',
                timestamp: new Date(),
                autoHide: false
            }
            
            setNotifications(prev => [notification, ...prev.slice(0, 9)])
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const clearAllNotifications = () => {
        setNotifications([])
    }

    const getNotificationIcon = (type: SyncNotification['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />
            case 'error':
                return <AlertTriangle className="w-4 h-4 text-red-500" />
            case 'info':
                return <Info className="w-4 h-4 text-blue-500" />
        }
    }

    const getNotificationColor = (type: SyncNotification['type']) => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50 dark:bg-green-950/20'
            case 'warning':
                return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
            case 'error':
                return 'border-red-200 bg-red-50 dark:bg-red-950/20'
            case 'info':
                return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20'
        }
    }

    const formatTimestamp = (date: Date) => {
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
        
        if (diffInMinutes < 1) return 'Ahora'
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
        if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`
        return `Hace ${Math.floor(diffInMinutes / 1440)} días`
    }

    if (notifications.length === 0) {
        return null
    }

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-stone-600 dark:text-stone-400">
                    Notificaciones ({notifications.length})
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                    >
                        {isVisible ? 'Ocultar' : 'Mostrar'}
                    </button>
                    <button
                        onClick={clearAllNotifications}
                        className="text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                    >
                        Limpiar
                    </button>
                </div>
            </div>
            
            {isVisible && (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-3 rounded-lg border shadow-sm transition-all duration-300 ${getNotificationColor(notification.type)}`}
                        >
                            <div className="flex items-start gap-3">
                                {getNotificationIcon(notification.type)}
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-stone-900 dark:text-stone-100">
                                            {notification.title}
                                        </h4>
                                        <button
                                            onClick={() => removeNotification(notification.id)}
                                            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    
                                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                                        {notification.message}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-stone-500">
                                            {formatTimestamp(notification.timestamp)}
                                        </span>
                                        
                                        {notification.action && (
                                            <button
                                                onClick={notification.action.onClick}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                {notification.action.label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Hook to dispatch sync events
export function useSyncEvents() {
    const dispatchSyncEvent = (type: string, details: any) => {
        window.dispatchEvent(new CustomEvent('sync-event', { detail: { type, ...details } }))
    }

    return { dispatchSyncEvent }
}
