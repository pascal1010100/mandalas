# 📅 Guía de Sincronización iCal

## 🎯 Overview

El sistema de sincronización iCal permite conectar Mandalas con plataformas de booking externas como Booking.com, Airbnb, Expedia, etc. Esto asegura que las disponibilidades y reservas estén siempre sincronizadas.

## 🔄 ¿Cómo Funciona?

### Import (Entrada)
- **Origen**: Booking.com → Mandalas
- **Proceso**: Lee el calendario iCal de la plataforma externa
- **Resultado**: Crea/actualiza reservas en Mandalas

### Export (Salida)  
- **Origen**: Mandalas → Booking.com
- **Proceso**: Genera un calendario iCal con las disponibilidades de Mandalas
- **Resultado**: La plataforma externa lee las disponibilidades

## 🛠️ Configuración

### 1. Obtener URL iCal de Booking.com

1. Inicia sesión en Booking.com
2. Ve a "Propiedades" → "Calendario y tarifas"
3. Selecciona "Exportar calendario"
4. Copia la URL del calendario iCal

### 2. Configurar en Mandalas

1. Ve a **Admin → Settings → Sincronización (iCal)**
2. Selecciona la habitación
3. Pega la URL en el campo "Importar"
4. Haz clic en "Sincronizar Ahora"

### 3. Configurar Exportación

1. Copia la URL del campo "Exportar"
2. Pega esta URL en Booking.com en "Importar calendario"
3. La sincronización será bidireccional

## 📊 Dashboard de Sincronización

El nuevo dashboard proporciona:

- **Estado general**: Número de habitaciones sincronizadas
- **Reservas activas**: Total de reservas importadas
- **Última sincronización**: Timestamp de la última actualización
- **Errores y advertencias**: Problemas detectados
- **Estado por habitación**: Detalles individuales

## 🔧 Características Mejoradas

### 1. Sincronización Inteligente
- Validación de URLs antes de sincronizar
- Manejo robusto de errores
- Logging detallado con emojis para fácil identificación
- Cancelación automática de reservas obsoletas

### 2. Notificaciones en Tiempo Real
- Alertas de conexión (online/offline)
- Notificaciones de progreso de sincronización
- Errores con acciones de reintento
- Advertencias con contexto

### 3. Dashboard Analítico
- Estadísticas agregadas
- Estado por habitación
- Historial de sincronización
- Métricas de rendimiento

### 4. Validación Avanzada
- Verificación de formato de URLs
- Validación de fechas y eventos
- Detección de calendarios vacíos
- Manejo de eventos duplicados

## 🚨 Manejo de Errores

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Invalid URL format" | URL mal formada | Verifica que la URL sea válida |
| "Failed to fetch iCal" | URL inaccesible | Verifica conexión y permisos |
| "No valid events found" | Calendario vacío | Revisa configuración en Booking.com |
| "Connection lost" | Sin internet | Espera a restaurar conexión |

### Acciones Automáticas

- **Reintentos**: El sistema reintenta automáticamente fallas temporales
- **Cancelación**: Reservas no presentes en el feed son canceladas
- **Logging**: Todos los eventos son registrados para debugging

## 📈 Mejoras de UX

### 1. Interfaz Moderna
- Cards con información clara
- Badges de estado visibles
- Progress bars para sincronización
- Iconos intuitivos

### 2. Feedback Inmediato
- Toast notifications para acciones
- Indicadores de carga
- Mensajes de error específicos
- Confirmaciones de éxito

### 3. Acciones Rápidas
- Botones de sincronización individual
- Sincronización global con un clic
- Copiar URLs con un click
- Reintentar sincronizaciones fallidas

## 🔍 Monitoreo y Logs

### Logs del Sistema
```bash
🔄 Starting iCal sync for room room-123 from https://...
📥 Fetched iCal feed from https://...
📊 Processed 15 valid events out of 20 total
📋 Found 12 existing active bookings
✅ Sync completed: 8 imported, 3 cancelled, 1250ms
```

### Métricas Disponibles
- Tiempo de sincronización por habitación
- Número de eventos procesados
- Tasa de éxito/fracaso
- Frecuencia de sincronización

## 🛡️ Seguridad

### Tokens de Exportación
- Cada habitación tiene un token único
- URLs no predecibles
- Acceso restringido por token

### Validación de Datos
- Sanitización de eventos iCal
- Validación de fechas
- Prevención de inyección de datos

## ⚡ Optimización

### Rendimiento
- Procesamiento paralelo de múltiples habitaciones
- Cache de respuestas frecuentes
- Lazy loading de datos del dashboard

### Red
- Timeouts configurables
- Reintentos exponenciales
- Manejo de rate limiting

## 🔮 Próximas Mejoras

1. **Sincronización en tiempo real** con WebSockets
2. **Soporte para más plataformas** (Airbnb, Expedia)
3. **Reglas de negocio avanzadas** (precios dinámicos)
4. **Analytics y reportes** detallados
5. **Integración con mobile apps**

## 📞 Soporte

Si encuentras problemas:

1. Revisa el dashboard para errores específicos
2. Verifica la conexión a internet
3. Confirma que las URLs iCal sean correctas
4. Contacta soporte con los logs del sistema

---

**Última actualización**: Enero 2026  
**Versión**: 2.0 con mejoras de UX y robustez
