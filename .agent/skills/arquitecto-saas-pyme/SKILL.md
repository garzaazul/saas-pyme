---
name: Arquitecto SaaS Pyme Core
description: Guardián de la arquitectura para software Multi-tenant, escalable y adaptado a la realidad operativa de las PYMES en Chile.
version: "1.1"
---

# Arquitecto SaaS Pyme Core (v1.1 - Localización Chile)

**Objetivo**: Actuar como el guardián de la arquitectura, garantizando un software Multi-tenant, escalable y fiel a la realidad operativa de las PYMES en Chile.

---

## 1. Estándar de Base de Datos (Supabase / PostgreSQL)

### 1.1 Campos Obligatorios

Toda nueva tabla debe incluir los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `UUID` | Identificador único (usar `gen_random_uuid()`) |
| `organization_id` | `UUID` | FK a `organizations.id` - Multi-tenancy |
| `created_at` | `TIMESTAMPTZ` | Momento de creación (`now()` por defecto) |
| `updated_at` | `TIMESTAMPTZ` | Última modificación (actualizar en cada operación) |
| `is_active` | `BOOLEAN` | Soft-delete flag (`true` por defecto) |

**Template SQL:**

```sql
CREATE TABLE nombre_tabla (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    -- campos específicos aquí
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);
```

### 1.2 Seguridad RLS (Row Level Security)

> [!CAUTION]
> Es **OBLIGATORIO** habilitar RLS en cada tabla. Sin RLS, los datos de una organización pueden ser accedidos por otra.

**Template de Políticas:**

```sql
-- Habilitar RLS
ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;

-- Política SELECT
CREATE POLICY "Users can view own org data"
ON nombre_tabla FOR SELECT
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Política INSERT
CREATE POLICY "Users can insert own org data"
ON nombre_tabla FOR INSERT
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Política UPDATE
CREATE POLICY "Users can update own org data"
ON nombre_tabla FOR UPDATE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()))
WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Política DELETE (soft-delete recomendado)
CREATE POLICY "Users can delete own org data"
ON nombre_tabla FOR DELETE
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));
```

### 1.3 Manejo de Moneda (Localización Chile)

| Moneda | Tipo de Dato | Justificación |
|--------|--------------|---------------|
| **CLP (Pesos Chilenos)** | `BIGINT` o `NUMERIC(15,0)` | Sin decimales, evitar errores de punto flotante |
| **UF (Unidad de Fomento)** | `NUMERIC(15,2)` | Solo 2 decimales; conversión a CLP se redondea al entero |

**Ejemplo:**

```sql
-- Columnas monetarias
base_price BIGINT NOT NULL DEFAULT 0,            -- CLP
total_amount BIGINT NOT NULL DEFAULT 0,          -- CLP
contract_value_uf NUMERIC(15,2),                 -- UF (solo si aplica)
```

**Conversión UF → CLP:**

```typescript
// lib/currency.ts contiene funciones de conversión
import { convertUFtoCLP } from '@/lib/currency';

const clpAmount = convertUFtoCLP(ufAmount, currentUfValue); // Redondea automáticamente
```

### 1.4 Tipos de Datos ENUM

Usar tipos personalizados para estados de documentos:

```sql
-- Crear ENUM para estados de cotización
CREATE TYPE estado_cotizacion AS ENUM (
    'borrador',
    'enviada', 
    'aceptada',
    'facturada',
    'rechazada'
);

-- Usar en tabla
status estado_cotizacion DEFAULT 'borrador';
```

**Estados comunes en el sistema:**

| Contexto | Valores |
|----------|---------|
| Cotizaciones | `borrador`, `enviada`, `aceptada`, `facturada`, `rechazada` |
| Ventas | `pendiente`, `pagado`, `anulada` |
| Productos | `activo`, `sin_stock`, `descontinuado` |

---

## 2. Lógica de Negocio y Multi-tenancy

### 2.1 Aislamiento de Datos

> [!IMPORTANT]
> El `organization_id` se extrae del token de sesión **NUNCA** se recibe como campo editable del frontend.

**Patrón correcto en Server Actions:**

```typescript
// app/actions/ejemplo.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function createRecord(formData: FormData) {
    const supabase = await createClient();
    
    // Obtener profile del usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");
    
    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();
    
    // Insertar con organization_id del perfil (NO del formulario)
    const { data, error } = await supabase
        .from("mi_tabla")
        .insert({
            ...campos,
            organization_id: profile.organization_id, // ← Siempre desde el perfil
        });
}
```

### 2.2 Categorización

> [!WARNING]
> **NO usar texto libre** para categorías. Siempre usar tablas relacionales.

**Estructura correcta:**

```sql
-- Tabla de categorías por organización
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'product', 'expense', etc.
    is_active BOOLEAN DEFAULT true,
    UNIQUE(organization_id, name, type)
);

-- Uso en productos
category_id UUID REFERENCES categories(id) -- En lugar de category TEXT
```

**Beneficios:**
- Reportes de "Top productos" y "Categorías de gasto" limpios
- Evita duplicados por errores de tipeo
- Facilita análisis y agrupación

### 2.3 Tratamiento de Ventas

El sistema distingue tres tipos de documentación:

| Tipo | Documento | Impacto Tributario |
|------|-----------|-------------------|
| **Factura** | PDF electrónico | ✅ Afecta reportes formalización |
| **Boleta** | Manual consolidada | ✅ Afecta reportes formalización |
| **Interna** | Sin documento | ❌ No afecta reportes |

**Filtrado para reportes tributarios:**

```typescript
const { data: salesForReport } = await supabase
    .from("sales")
    .select("*")
    .eq("organization_id", orgId)
    .in("sale_type", ["factura", "boleta"]); // Solo documentadas
```

---

## 3. Sistema de Diseño y UI (Coherencia Visual)

### 3.1 Layout General

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header con user info]                                          │
├────────────┬────────────────────────────────────────────────────┤
│            │                                                    │
│  Sidebar   │     Panel Central                                  │
│  (oscuro)  │     (tarjetas blancas con borde radius: 8-12px)   │
│            │                                                    │
│            │                                                    │
└────────────┴────────────────────────────────────────────────────┘
```

**Especificaciones:**
- **Sidebar**: Fondo oscuro, navegación vertical
- **Panel central**: Fondo gris claro (`bg-muted/40`), tarjetas blancas
- **Border radius**: 8px-12px (`rounded-lg` o `rounded-xl`)
- **Spacing**: Consistente usando sistema de 4px de Tailwind

### 3.2 Formularios y Modales

**Estructura de modales:**

```tsx
<Dialog>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader className="text-center">
      <DialogTitle>Título Centrado</DialogTitle>
      <DialogDescription>Descripción breve</DialogDescription>
    </DialogHeader>
    
    <form className="space-y-4">
      {/* Campos con placeholders descriptivos */}
      <Input placeholder="Ej: Mantención preventiva mensual" />
    </form>
    
    <DialogFooter className="justify-end">
      <Button variant="outline">Cancelar</Button>
      <Button type="submit">Guardar</Button> {/* Azul, a la derecha */}
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 3.3 Visualización de Dinero

> [!IMPORTANT]
> Siempre usar `formatCLP()` de `@/lib/currency` para mostrar montos.

```typescript
import { formatCLP } from "@/lib/currency";

// Correcto: $1.250.000
<span>{formatCLP(1250000)}</span>

// Incorrecto: 1250000 o $1,250,000.00
```

**Formato esperado:**
- Símbolo `$` al inicio
- Separador de miles con punto `.`
- Sin decimales para CLP
- Ejemplo: `$1.250.000`

### 3.4 Badges de Estado

Usar variantes consistentes del componente `Badge`:

| Estado | Clase/Variante | Color |
|--------|----------------|-------|
| Activo / Pagado | `bg-green-100 text-green-700` | Verde |
| Pendiente | `bg-yellow-100 text-yellow-700` | Amarillo |
| Sin Stock / Crítico | `bg-red-100 text-red-700` | Rojo |
| Borrador | `bg-gray-100 text-gray-700` | Gris |

**Ejemplo:**

```tsx
<Badge className="bg-green-100 text-green-700">Activo</Badge>
<Badge className="bg-red-100 text-red-700">Sin Stock</Badge>
```

---

## 4. Directrices de Desarrollo (Scope Guardian)

### 4.1 Priorización

> [!NOTE]
> Si una funcionalidad **no contribuye directamente** al control de flujo de caja o visibilidad financiera, se mueve a la **Fase 2**.

**Criterios de Fase 1:**
- ✅ Registro de ingresos y gastos
- ✅ Dashboard de flujo de caja
- ✅ Cotizaciones y conversión a ventas
- ✅ Gestión de productos con inventario básico
- ✅ Reportes financieros esenciales

**Criterios de Fase 2:**
- ⏳ Integraciones con SII
- ⏳ Multi-usuario por organización
- ⏳ Roles y permisos avanzados
- ⏳ Automatizaciones de marketing

### 4.2 Exportación de Datos

> [!IMPORTANT]
> **Todo listado** debe incluir función de exportación a Excel y PDF.

**Usar utilidades existentes:**

```typescript
import { exportToExcel, exportToPDF } from "@/lib/export-utils";

// Exportar a Excel
const columnMapping = {
    date: 'Fecha',
    client_name: 'Cliente',
    total_amount: 'Total', // formatCLP se aplica antes
};

exportToExcel(filteredData, 'ventas-enero-2026', columnMapping);

// Exportar a PDF
const pdfColumns = [
    { header: 'Fecha', dataKey: 'date' },
    { header: 'Cliente', dataKey: 'client_name' },
    { header: 'Total', dataKey: 'total_formatted' },
];

exportToPDF('Reporte de Ventas', filteredData, pdfColumns, 'Mi Empresa SpA');
```

**Requisitos:**
- Respetar filtros activos (fecha, estado, categoría)
- Usar formato de moneda chileno en columnas numéricas
- Incluir nombre de empresa y fecha de generación

---

## 5. Snippets de Referencia

### 5.1 TypeScript Interface Pattern

```typescript
// types/index.ts
export interface BaseEntity {
    id: string;
    organization_id: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

export interface Product extends BaseEntity {
    name: string;
    base_price: number;
    category_id: string;
    current_stock: number;
}
```

### 5.2 Server Action con Validación

```typescript
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
    const supabase = await createClient();
    
    // Autenticación y organization_id
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };
    
    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();
    
    if (!profile) return { error: "Perfil no encontrado" };
    
    // Validar y preparar datos
    const name = formData.get("name") as string;
    const base_price = parseInt(formData.get("base_price") as string) || 0;
    
    if (!name.trim()) return { error: "El nombre es requerido" };
    
    // Insertar
    const { data, error } = await supabase
        .from("products")
        .insert({
            name: name.trim(),
            base_price,
            organization_id: profile.organization_id,
        })
        .select()
        .single();
    
    if (error) return { error: error.message };
    
    revalidatePath("/dashboard/products");
    return { success: true, data };
}
```

---

## 6. Checklist para nuevas funcionalidades

Antes de cerrar cualquier PR o feature, verificar:

- [ ] Tabla tiene campos obligatorios (`id`, `organization_id`, `created_at`, `updated_at`, `is_active`)
- [ ] RLS habilitado con políticas para SELECT, INSERT, UPDATE, DELETE
- [ ] Montos en CLP usan `BIGINT` o `NUMERIC(15,0)`
- [ ] Categorías usan tabla relacional (no texto libre)
- [ ] `organization_id` se obtiene del perfil del usuario (no del frontend)
- [ ] Montos se muestran con `formatCLP()`
- [ ] Listados incluyen exportación a Excel y PDF
- [ ] La funcionalidad contribuye al flujo de caja / visibilidad financiera (Fase 1)
