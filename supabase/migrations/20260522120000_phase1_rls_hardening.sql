-- =============================================================================
-- FLUXU · Fase 1.5 — RLS Hardening Consolidado
-- Fecha: 2026-05-22
--
-- PROPÓSITO
-- Segunda barrera de aislamiento multi-tenant, independiente del código de la app.
-- La primera barrera (filtros organization_id en server actions) ya está aplicada.
-- Si una falla, la otra bloquea igualmente.
--
-- ESTADO PREVIO (revisado en historial de migraciones)
-- ✅ Ya tenían RLS + políticas: clients, profiles, organizations, sales, expenses,
--    organization_sequences (solo SELECT)
-- ⚠️  Incompletos (faltaba UPDATE/DELETE): quotes, products
-- ❌ Sin políticas de org para usuarios auth: categories, product_categories
-- ❌ Sin RLS en absoluto: quote_items, recurring_expenses
--
-- ADVERTENCIA ANTES DE EJECUTAR
-- Activar RLS sin políticas bloquea TODO acceso a la tabla.
-- Este script es idempotente: usa DROP POLICY IF EXISTS antes de cada CREATE.
-- Rollback tabla a tabla: ALTER TABLE public.<tabla> DISABLE ROW LEVEL SECURITY;
--
-- PRUEBA RECOMENDADA: ejecutar primero en staging o en horario de bajo tráfico.
-- =============================================================================


-- =============================================================================
-- PASO 1 — Función helper canónica (security definer, evita recursión en profiles)
-- =============================================================================
-- Nota: ya existe get_my_organization_id() de migraciones anteriores.
-- Creamos get_user_org_id() como nombre canónico nuevo; ambas conviven.
-- Las políticas de esta migración usan get_user_org_id() exclusivamente.

CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT organization_id
    FROM public.profiles
    WHERE id = auth.uid()
$$;

COMMENT ON FUNCTION public.get_user_org_id() IS
'Retorna el organization_id del usuario autenticado. SECURITY DEFINER para evitar
recursión cuando se usa en políticas de la tabla profiles. Función canónica de Fase 1.5.';


-- =============================================================================
-- PASO 2 — profiles
-- Política basada en auth.uid() directamente para evitar recursión circular
-- (get_user_org_id lee de profiles → si profiles también llamara a get_user_org_id
-- se produciría recursión infinita).
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- El usuario ve y edita únicamente su propio perfil
DROP POLICY IF EXISTS "profiles_self_select"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_update"  ON public.profiles;
-- Limpieza de políticas anteriores con nombres distintos
DROP POLICY IF EXISTS "Users can view own profile"      ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"    ON public.profiles;
DROP POLICY IF EXISTS "Users can view org teammates"    ON public.profiles;

CREATE POLICY "profiles_self_select"
ON public.profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "profiles_self_update"
ON public.profiles FOR UPDATE
USING  (id = auth.uid())
WITH CHECK (id = auth.uid());

-- NOTA: "ver teammates de la org" no se usa en ningún componente del dashboard
-- actual (solo se resuelve el propio perfil). Si en el futuro se necesita,
-- la implementación segura es:
--   CREATE POLICY "profiles_org_teammates_select" ON public.profiles FOR SELECT
--   USING (organization_id = public.get_user_org_id());
-- (get_user_org_id es SECURITY DEFINER, lo que rompe la recursión).


-- =============================================================================
-- PASO 3 — organizations (tabla madre de tenants)
-- Requiere dos capas de políticas: aislamiento de org (para usuarios auth)
-- y lectura pública (para el catálogo /catalogo/[slug] con rol anon).
-- =============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Limpieza de todas las políticas previas en esta tabla
DROP POLICY IF EXISTS "organizations_self"                    ON public.organizations;
DROP POLICY IF EXISTS "organizations_public_read"             ON public.organizations;
DROP POLICY IF EXISTS "Users can view own organization"       ON public.organizations;
DROP POLICY IF EXISTS "Users can update own organization"     ON public.organizations;
DROP POLICY IF EXISTS "Public can view organizations by slug" ON public.organizations;

-- Usuarios autenticados: ven y editan ÚNICAMENTE su propia organización
CREATE POLICY "organizations_self"
ON public.organizations FOR ALL
USING  (id = public.get_user_org_id())
WITH CHECK (id = public.get_user_org_id());

-- Rol anon (catálogo público): lectura de organizaciones con web_slug configurado.
-- NOTA DE SEGURIDAD: esta política expone TODAS las columnas de la fila al rol anon,
-- incluidas transfer_details, rut y email. Esto es intencional: son datos que la
-- empresa decide mostrar en su catálogo. Si en el futuro se quiere ocultar alguna
-- columna al público, restringir el select en getStoreData() a columnas explícitas —
-- la política no necesita cambiar.
CREATE POLICY "organizations_public_read"
ON public.organizations FOR SELECT TO anon
USING (web_slug IS NOT NULL);


-- =============================================================================
-- PASO 4 — clients
-- Aislamiento completo: un usuario solo ve y opera clientes de su organización.
-- Ya existía política con nombre "Users can manage own org clients"; se reemplaza.
-- =============================================================================

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clients_org_isolation"           ON public.clients;
DROP POLICY IF EXISTS "Users can manage own org clients" ON public.clients;

CREATE POLICY "clients_org_isolation"
ON public.clients FOR ALL
USING  (organization_id = public.get_user_org_id())
WITH CHECK (organization_id = public.get_user_org_id());


-- =============================================================================
-- PASO 5 — categories
-- ⚠️  BRECHA DETECTADA: solo existía política pública (anon); faltaba aislamiento
-- para usuarios autenticados. Un usuario autenticado podía leer categorías de
-- cualquier organización. Corregido aquí.
-- =============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Limpieza
DROP POLICY IF EXISTS "categories_org_isolation"          ON public.categories;
DROP POLICY IF EXISTS "categories_public_read"            ON public.categories;
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;

-- Usuarios autenticados: solo ven y operan categorías de su propia organización
CREATE POLICY "categories_org_isolation"
ON public.categories FOR ALL
USING  (organization_id = public.get_user_org_id())
WITH CHECK (organization_id = public.get_user_org_id());

-- Rol anon (catálogo público): solo categorías activas de orgs con catálogo visible
CREATE POLICY "categories_public_read"
ON public.categories FOR SELECT TO anon
USING (
    is_active = true
    AND organization_id IN (
        SELECT id FROM public.organizations WHERE web_slug IS NOT NULL
    )
);


-- =============================================================================
-- PASO 6 — products
-- ⚠️  BRECHA DETECTADA: existían SELECT + INSERT pero faltaban UPDATE y DELETE.
-- Las operaciones de edición y soft-delete de productos fallaban silenciosamente
-- contra RLS. Corregido reemplazando por una política FOR ALL.
-- =============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Limpieza de las políticas parciales anteriores
DROP POLICY IF EXISTS "products_org_isolation"         ON public.products;
DROP POLICY IF EXISTS "products_public_read"           ON public.products;
DROP POLICY IF EXISTS "Users can view own org products"   ON public.products;
DROP POLICY IF EXISTS "Users can insert own org products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products"   ON public.products;

-- Usuarios autenticados: gestión completa (CRUD) dentro de su organización
CREATE POLICY "products_org_isolation"
ON public.products FOR ALL
USING  (organization_id = public.get_user_org_id())
WITH CHECK (organization_id = public.get_user_org_id());

-- Rol anon (catálogo público): solo productos activos de orgs con catálogo visible
CREATE POLICY "products_public_read"
ON public.products FOR SELECT TO anon
USING (
    is_active = true
    AND organization_id IN (
        SELECT id FROM public.organizations WHERE web_slug IS NOT NULL
    )
);


-- =============================================================================
-- PASO 7 — product_categories (tabla puente many-to-many)
-- ⚠️  BRECHA DETECTADA: solo existía política pública (anon); faltaba aislamiento
-- para usuarios autenticados. La tabla tiene organization_id directo: se puede
-- filtrar sin subquery. Las operaciones de createProduct/updateProduct (que hacen
-- DELETE + INSERT sobre esta tabla) fallaban silenciosamente.
-- =============================================================================

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Limpieza
DROP POLICY IF EXISTS "product_categories_org_isolation"                   ON public.product_categories;
DROP POLICY IF EXISTS "product_categories_public_read"                     ON public.product_categories;
DROP POLICY IF EXISTS "Public can view product_categories via web_slug"    ON public.product_categories;

-- Usuarios autenticados: gestión completa dentro de su organización
CREATE POLICY "product_categories_org_isolation"
ON public.product_categories FOR ALL
USING  (organization_id = public.get_user_org_id())
WITH CHECK (organization_id = public.get_user_org_id());

-- Rol anon (catálogo): tabla puente, sin datos sensibles; lectura pública
-- restringida a orgs con catálogo visible (consistente con products y categories)
CREATE POLICY "product_categories_public_read"
ON public.product_categories FOR SELECT TO anon
USING (
    organization_id IN (
        SELECT id FROM public.organizations WHERE web_slug IS NOT NULL
    )
);


-- =============================================================================
-- PASO 8 — quotes
-- ⚠️  BRECHA DETECTADA: existían SELECT + INSERT pero faltaban UPDATE y DELETE.
-- Todas las operaciones de edición (updateQuote, approveQuote, updateQuoteStatus,
-- softDeleteQuote, reactivateQuote) fallaban silenciosamente contra RLS.
-- Corregido reemplazando por una política FOR ALL.
-- =============================================================================

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Limpieza de las políticas parciales anteriores
DROP POLICY IF EXISTS "quotes_org_isolation"              ON public.quotes;
DROP POLICY IF EXISTS "Users can view own org quotes"     ON public.quotes;
DROP POLICY IF EXISTS "Users can insert own org quotes"   ON public.quotes;

CREATE POLICY "quotes_org_isolation"
ON public.quotes FOR ALL
USING  (organization_id = public.get_user_org_id())
WITH CHECK (organization_id = public.get_user_org_id());


-- =============================================================================
-- PASO 9 — quote_items (hereda organización por relación: quote_id → quotes)
-- ❌ SIN RLS EN ABSOLUTO hasta esta migración. Cualquier usuario autenticado
-- podía leer y modificar items de cotizaciones ajenas. Corregido.
-- El filtro usa EXISTS sobre quotes para verificar organización.
-- =============================================================================

ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quote_items_org_isolation" ON public.quote_items;

CREATE POLICY "quote_items_org_isolation"
ON public.quote_items FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM public.quotes q
        WHERE q.id = quote_items.quote_id
          AND q.organization_id = public.get_user_org_id()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.quotes q
        WHERE q.id = quote_items.quote_id
          AND q.organization_id = public.get_user_org_id()
    )
);


-- =============================================================================
-- PASO 10 — sales
-- Ya tenía política ALL correcta. Se reemplaza para usar get_user_org_id()
-- (nombre canónico) y limpiar políticas con nombres anteriores.
-- =============================================================================

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sales_org_isolation"           ON public.sales;
DROP POLICY IF EXISTS "Users can manage own org sales" ON public.sales;

CREATE POLICY "sales_org_isolation"
ON public.sales FOR ALL
USING  (organization_id = public.get_user_org_id())
WITH CHECK (organization_id = public.get_user_org_id());


-- =============================================================================
-- PASO 11 — expenses
-- Ya tenía política ALL correcta. Se reemplaza para usar get_user_org_id()
-- (nombre canónico) y limpiar políticas con nombres anteriores.
-- =============================================================================

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "expenses_org_isolation"           ON public.expenses;
DROP POLICY IF EXISTS "Users can manage own org expenses" ON public.expenses;

CREATE POLICY "expenses_org_isolation"
ON public.expenses FOR ALL
USING  (organization_id = public.get_user_org_id())
WITH CHECK (organization_id = public.get_user_org_id());


-- =============================================================================
-- PASO 12 — recurring_expenses
-- ❌ SIN RLS hasta esta migración. Gastos recurrentes no estaban protegidos.
-- =============================================================================

ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recurring_expenses_org_isolation" ON public.recurring_expenses;

CREATE POLICY "recurring_expenses_org_isolation"
ON public.recurring_expenses FOR ALL
USING  (organization_id = public.get_user_org_id())
WITH CHECK (organization_id = public.get_user_org_id());


-- =============================================================================
-- PASO 13 — organization_sequences
-- Ya tenía RLS + SELECT. Se completa con INSERT + UPDATE para coherencia,
-- aunque en la práctica estas operaciones las realiza la función
-- get_next_correlative() que es SECURITY DEFINER (bypassa RLS por diseño).
-- La política explícita es una red de seguridad adicional.
-- =============================================================================

ALTER TABLE public.organization_sequences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "organization_sequences_org_isolation" ON public.organization_sequences;
DROP POLICY IF EXISTS "Users can view own org sequences"      ON public.organization_sequences;

CREATE POLICY "organization_sequences_org_isolation"
ON public.organization_sequences FOR ALL
USING  (organization_id = public.get_user_org_id())
WITH CHECK (organization_id = public.get_user_org_id());


-- =============================================================================
-- RESUMEN — Tablas con RLS activo tras esta migración
-- =============================================================================
--
-- Tabla                  | RLS | Política de org (auth) | Lectura pública (anon)
-- -----------------------|-----|------------------------|------------------------
-- profiles               | ON  | SELECT/UPDATE propio   | —
-- organizations          | ON  | ALL (id = org)         | SELECT (web_slug IS NOT NULL)
-- clients                | ON  | ALL                    | —
-- categories             | ON  | ALL                    | SELECT (is_active + org pública)
-- products               | ON  | ALL                    | SELECT (is_active + org pública)
-- product_categories     | ON  | ALL                    | SELECT (org pública)
-- quotes                 | ON  | ALL                    | —
-- quote_items            | ON  | ALL (vía join quotes)  | —
-- sales                  | ON  | ALL                    | —
-- expenses               | ON  | ALL                    | —
-- recurring_expenses     | ON  | ALL                    | —
-- organization_sequences | ON  | ALL                    | —
--
-- ROLLBACK POR TABLA (ejecutar en caso de emergencia):
-- ALTER TABLE public.profiles               DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.organizations          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.clients                DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.categories             DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.products               DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.product_categories     DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.quotes                 DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.quote_items            DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.sales                  DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.expenses               DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.recurring_expenses     DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.organization_sequences DISABLE ROW LEVEL SECURITY;


-- =============================================================================
-- PASO 14 — Queries de verificación (ejecutar manualmente después del deploy)
-- =============================================================================

-- 1) Confirmar que RLS está activo en todas las tablas protegidas:
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
--   AND tablename IN (
--     'profiles','organizations','clients','categories','products',
--     'product_categories','quotes','quote_items','sales','expenses',
--     'recurring_expenses','organization_sequences'
--   )
-- ORDER BY tablename;
-- Resultado esperado: rowsecurity = true en todas.

-- 2) Listar todas las políticas activas:
-- SELECT tablename, policyname, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
-- Resultado esperado: cada tabla tiene su política *_org_isolation y, donde aplica,
-- su política *_public_read con roles = {anon}.

-- 3) Confirmar que get_user_org_id() existe:
-- SELECT routine_name, security_type
-- FROM information_schema.routines
-- WHERE routine_schema = 'public'
--   AND routine_name IN ('get_user_org_id','get_my_organization_id');
-- Resultado esperado: ambas funciones listadas con security_type = 'DEFINER'.

-- 4) Prueba funcional manual:
--    a) Iniciar sesión como Tenant A → verificar que /dashboard/clients
--       solo muestra clientes de A.
--    b) Intentar acceder a una cotización de Tenant B vía URL directa →
--       debe retornar "Cotización no encontrada".
--    c) Abrir /catalogo/<slug> SIN sesión (ventana de incógnito) →
--       el catálogo debe seguir mostrando productos normalmente.
--    d) Editar una cotización y confirmar que el UPDATE se guarda
--       (validar que la política FOR ALL incluye UPDATE correctamente).
