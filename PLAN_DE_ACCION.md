# 🚀 Plan de Acción — FLUXU SaaS Pyme
> Auditoría realizada el 22 de mayo de 2026  
> Objetivo: lanzar el producto a la venta en formato mensual

---

## Estado Actual

| Dimensión | Estado |
|---|---|
| Core del producto (cotizaciones, catálogo, flujo de caja) | ✅ Funcional |
| Seguridad multi-tenant | 🔴 Bugs críticos |
| Integridad de datos (transacciones DB) | 🟡 Frágil |
| SaaS readiness (planes, pagos, onboarding) | ❌ No existe |
| Calidad de código (tipos, dependencias) | 🟡 Mejorable |

---

## FASE 1 — Seguridad Crítica
> ⚠️ **Completar antes de dar acceso a cualquier usuario real**  
> Estimado: 3–5 días

### 1.1 Corregir fuga de datos en módulo de Clientes

**Archivo:** `app/actions/clients.ts`

- [ ] Agregar filtro `organization_id` en `getClients()` — actualmente retorna clientes de TODAS las empresas
- [ ] Agregar verificación de organización en `updateClientAction()` — cualquier usuario puede editar clientes ajenos
- [ ] Agregar verificación de organización en `softDeleteClient()` — misma vulnerabilidad
- [ ] Agregar verificación de organización en `reactivateClient()` — misma vulnerabilidad

```ts
// Patrón correcto a aplicar en todas las funciones:
const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

// Luego en la query:
.eq("organization_id", profile.organization_id)
```

---

### 1.2 Corregir acceso cruzado en módulo de Cotizaciones

**Archivo:** `app/actions/quotes.ts`

- [ ] `getQuote(id)` — agregar `.eq("organization_id", orgId)` para que no retorne cotizaciones ajenas
- [ ] `approveQuote(id)` — agregar verificación de organización antes de actualizar
- [ ] `updateQuoteStatus(id, status)` — agregar verificación de organización
- [ ] `softDeleteQuote(id)` — agregar verificación de organización
- [ ] `reactivateQuote(id)` — agregar verificación de organización
- [ ] `updateQuote(input)` — agregar `.eq("organization_id", orgId)` en el UPDATE

---

### 1.3 Convertir operaciones críticas a transacciones atómicas

**Archivo:** `app/actions/quotes.ts` → mover lógica a RPCs en Supabase

- [ ] Crear función PostgreSQL `create_quote_with_items(...)` que ejecute insert de header + items en una sola transacción
- [ ] Crear función PostgreSQL `update_quote_with_items(...)` que ejecute update + delete + insert + recálculo en una sola transacción
- [ ] Eliminar el rollback manual de `createQuote` (línea 129) — no es atómico ni confiable

> **Por qué:** hoy si falla el INSERT de items, el header de la cotización queda huérfano. Si falla la tercera query de `updateQuote`, el total en DB es incorrecto.

---

## FASE 2 — SaaS Mínimo Viable
> Estimado: 1–2 semanas

### 2.1 Onboarding de nuevo usuario

**Nuevos archivos a crear**

- [ ] Crear trigger en Supabase (PostgreSQL) que al insertar en `auth.users` cree automáticamente:
  - Un registro en `organizations` con nombre provisional
  - Un registro en `profiles` vinculando el user a la organización
- [ ] Crear página `/onboarding` que se muestre la primera vez que el usuario entra al dashboard
  - Campos: nombre de la empresa, RUT, giro, ciudad
  - Redirigir a `/dashboard` al completar
- [ ] En el `DashboardLayout`, detectar si la organización está "vacía" y redirigir a `/onboarding`

---

### 2.2 Recuperación de contraseña

**Archivo:** `app/login/page.tsx`

- [ ] Agregar botón "¿Olvidaste tu contraseña?" en el formulario de login
- [ ] Crear página `/reset-password` que use `supabase.auth.resetPasswordForEmail()`
- [ ] Crear página `/update-password` para el callback de Supabase con el nuevo password

---

### 2.3 Controlar el registro de nuevos usuarios

- [ ] **Decisión de modelo:** elegir entre estas dos opciones antes de implementar:

| Opción | Descripción | Recomendado para |
|---|---|---|
| **Trial automático** | Cualquiera puede registrarse, tiene N días gratis antes de pedir tarjeta | Máximo crecimiento |
| **Invite-only** | Solo entran con un link de invitación generado por ti | Control total, lanzamiento cerrado |

- [ ] Implementar el modelo elegido
- [ ] Si se elige trial: agregar campo `trial_ends_at` en `organizations` y verificarlo en el middleware

---

## FASE 3 — Monetización
> Estimado: 1–2 semanas

### 3.1 Modelo de datos para planes

- [ ] Crear tabla `plans` en Supabase: `id, name, price_monthly, max_clients, max_quotes_per_month, features (jsonb)`
- [ ] Crear tabla `subscriptions` en Supabase: `id, organization_id, plan_id, status, current_period_end, stripe_subscription_id`
- [ ] Definir los planes iniciales (ej: Gratis / Básico / Pro)

---

### 3.2 Integración de pagos

- [ ] **Decisión:** Stripe (global, fácil de integrar) vs Transbank (Chile, más familiar para usuarios locales)
  - Recomendación: **Stripe** — mejor DX, webhooks confiables, soporte de suscripciones nativo
- [ ] Instalar `stripe` SDK
- [ ] Crear API Route `/api/stripe/create-checkout-session`
- [ ] Crear API Route `/api/stripe/webhook` para manejar eventos: `checkout.completed`, `invoice.paid`, `subscription.deleted`
- [ ] Crear página `/dashboard/billing` con estado de la suscripción y botón de upgrade

---

### 3.3 Enforcement de límites por plan

**Archivo:** `utils/supabase/middleware.ts` o nuevo `lib/plan-guard.ts`

- [ ] En el middleware, verificar que la organización tiene suscripción activa
- [ ] En `createQuote`, verificar que no superó el límite mensual de cotizaciones del plan
- [ ] En `createClientAction`, verificar que no superó el límite de clientes del plan
- [ ] Mostrar mensaje claro en el UI cuando se alcanza un límite

---

## FASE 4 — Calidad y Performance
> Estimado: 3–4 días (puede hacerse en paralelo con Fase 3)

### 4.1 Eliminar el tipo `any` en cotizaciones

- [ ] Crear tipo `QuoteWithRelations` en `types/quotes.ts` que incluya `items`, `client`, y `organization`
- [ ] Reemplazar `useState<any[]>` en `quotes/page.tsx` con el tipo correcto
- [ ] Reemplazar `return data as any` en `getQuote()`

---

### 4.2 Paralelizar queries del dashboard

**Archivo:** `app/actions/dashboard.ts`

- [ ] Refactorizar `getDashboardKPIs()` para ejecutar las 5 queries con `Promise.all` en lugar de secuencialmente

```ts
const [salesData, expensesData, totalClients, newClients] = await Promise.all([
    supabase.from("sales").select(...),
    supabase.from("expenses").select(...),
    supabase.from("clients").select(...).count(),
    supabase.from("clients").select(...).count()
]);
```

---

### 4.3 Convertir la página de Cotizaciones a Server Component

**Archivo:** `app/dashboard/quotes/page.tsx`

- [ ] Mover el fetch inicial a un Server Component padre
- [ ] Pasar los datos como props a un Client Component `QuotesClient` que maneje la interactividad
- [ ] Resultado: cero spinner en carga inicial, datos disponibles en el primer render

---

### 4.4 Pinear versiones de dependencias

**Archivo:** `package.json`

- [ ] Cambiar `"@supabase/ssr": "latest"` → versión exacta actual
- [ ] Cambiar `"@supabase/supabase-js": "latest"` → versión exacta actual
- [ ] Cambiar `"@tanstack/react-query": "latest"` → versión exacta actual (o eliminarlo si no se usa)
- [ ] Verificar si `@tanstack/react-query` se usa en algún componente; si no, eliminarlo del bundle

---

### 4.5 Extraer constante de IVA

- [ ] Crear `lib/constants.ts` con `export const IVA_RATE = 0.19`
- [ ] Reemplazar los tres `* 1.19` hardcodeados en `quotes.ts`

---

## FASE 5 — Pre-Lanzamiento
> Estimado: 1 semana

### 5.1 Legal y compliance

- [ ] Crear página `/terminos` — Términos y Condiciones de uso
- [ ] Crear página `/privacidad` — Política de Privacidad (especialmente importante con datos de RUT y empresas)
- [ ] Agregar checkbox de aceptación en el registro

---

### 5.2 Landing page de marketing

- [ ] Crear `app/page.tsx` como landing page pública (hoy es el dashboard o redirige directo)
- [ ] Secciones mínimas: Hero, Funcionalidades, Precios, CTA de registro
- [ ] Agregar `og:image` y meta tags para compartir en redes

---

### 5.3 Email transaccional

- [ ] Configurar emails en Supabase Auth (personalizar plantilla de bienvenida y recuperación de contraseña)
- [ ] Considerar Resend o SendGrid para emails de negocio: bienvenida, fin de trial, factura pagada

---

### 5.4 Rate limiting en autenticación

- [ ] Habilitar rate limiting en Supabase Auth (panel de Supabase → Auth → Rate Limits)
- [ ] Agregar protección CAPTCHA en el formulario de registro (Supabase soporta hCaptcha nativamente)

---

## Resumen de Prioridades

```
🔴 FASE 1 — Seguridad        → Hacer AHORA (antes de usuarios reales)
🟠 FASE 2 — SaaS MVP         → Semana 1-2
🟡 FASE 3 — Monetización     → Semana 2-3
🟢 FASE 4 — Calidad          → Paralelo con Fase 3
🔵 FASE 5 — Pre-Lanzamiento  → Semana 4-5
```

---

## Checklist Final antes de Lanzar

- [ ] Fase 1 completa (seguridad multi-tenant)
- [ ] Onboarding funcional para nuevos usuarios
- [ ] Recuperación de contraseña funcional
- [ ] Al menos un plan de pago activo y cobrable
- [ ] Webhook de Stripe procesando pagos correctamente
- [ ] Términos y Política de Privacidad publicados
- [ ] Variables de entorno en producción revisadas (no usar `.env.local` en Vercel)
- [ ] RLS (Row Level Security) de Supabase revisada y activa en todas las tablas
- [ ] Test manual del flujo completo: registro → onboarding → cotización → PDF → pago

---

*Generado tras auditoría de código el 22/05/2026*
