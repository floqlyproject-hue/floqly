# @floqly/database

Пакет для работы с Supabase БД.

---

## ⚠️ ВАЖНО: Типы требуют генерации!

**Текущий статус:** В проекте используется **placeholder** (`src/types.ts`) с заглушками типов.

**Когда нужно сгенерировать реальные типы:**
- Когда создашь схему БД в Supabase (таблицы, views, functions)
- Когда начнёшь работать с базой данных в коде
- Перед продакшеном (чтобы типы соответствовали реальной БД)

---

## 🚀 Генерация типов из Supabase

### **Вариант 1: Через Supabase CLI (рекомендуется)**

```bash
# 1. Авторизоваться в Supabase CLI (откроет браузер)
npx supabase login

# 2. Сгенерировать типы из remote проекта
npx supabase gen types typescript --project-id rhdvlmhcfdqbqjgmcgcc > packages/database/src/types.ts

# Или через npm скрипт:
pnpm db:generate
```

### **Вариант 2: Через Dashboard Supabase (без CLI)**

1. Открой https://supabase.com/dashboard/project/rhdvlmhcfdqbqjgmcgcc
2. Перейди в **Settings** → **API**
3. Внизу страницы найди секцию **"Generate Types"**
4. Скопируй сгенерированный TypeScript код
5. Вставь в `packages/database/src/types.ts` (заменив весь файл)

---

## 📦 Конфигурация Supabase

**Remote проект настроен:**
- Project ID: `rhdvlmhcfdqbqjgmcgcc`
- URL: `https://rhdvlmhcfdqbqjgmcgcc.supabase.co`
- Ключи: см. `apps/web/.env.local`

**Файлы конфигурации:**
- `src/client.ts` — клиенты для браузера и сервера
- `src/types.ts` — типы БД (сейчас placeholder!)
- `src/index.ts` — экспорты

---

## 🛠️ Использование

### **Создание клиента**

```typescript
import { createClient } from '@floqly/database'

// В браузере
const supabase = createClient()

// На сервере (с service_role правами)
import { createServerClient } from '@floqly/database'
const supabase = createServerClient()
```

### **Работа с типами**

```typescript
import type { Database, Tables } from '@floqly/database'

// Тип таблицы
type Profile = Tables<'profiles'>

// Тип для insert
type ProfileInsert = TablesInsert<'profiles'>
```

---

## 📋 Checklist перед продакшеном

- [ ] Создана схема БД в Supabase (таблицы, relationships)
- [ ] Сгенерированы реальные типы из БД (`pnpm db:generate`)
- [ ] Проверены типы в коде (нет ошибок TypeScript)
- [ ] Row Level Security (RLS) настроен для всех таблиц
- [ ] Миграции закоммичены в репозиторий

---

## 🔗 Ссылки

- **Supabase Dashboard:** https://supabase.com/dashboard/project/rhdvlmhcfdqbqjgmcgcc
- **Supabase Docs:** https://supabase.com/docs
- **TypeScript Types:** https://supabase.com/docs/guides/api/generating-types
