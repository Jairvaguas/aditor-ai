# Directiva: Hydration de Métricas Globales del Dashboard

## Objetivo
El Dashboard no estaba leyendo los resultados post-auditoría. Solo veía si existía > 0 auditorías, pero no extraía los datos.

## Resolución (SOP de Extracción)
1. **Fetch**: Usamos `supabaseAdmin.from('auditorias').select('*').eq('clerk_user_id', user.id).order('created_at', { ascending: false }).limit(1).single()`.
2. **Parseo**: Dado que la data se guarda en `xml_raw`, construimos un extractor Regex nativo que busca `<metricas_globales>`.
3. **Mapeo**: 
   - `ROAS`, `CTR`, `CPM`, y `Gasto` se vuelcan directamente en las tarjetas superiores.
   - Extraemos los top 4 `<hallazgo>` y parseamos su tipo, para asignarle un color (🔴, 🟡, 🟢) y renderizar la "Tabla de Campañas" orgánicamente.
4. Si el XML se rompe o no hay data, se activan los fallbacks (`--`, `$0`) sin crashear el Server Component.
