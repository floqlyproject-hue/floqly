# /component — Создание нового UI компонента

Создай новый React компонент для Floqly.

## Инструкции

1. Спроси у пользователя:
   - Название компонента (PascalCase)
   - Где создать: `packages/ui` или `apps/web/components`
   - Нужны ли варианты (variants)?

2. Создай файлы:
   ```
   ComponentName/
   ├── index.tsx        # Основной компонент
   ├── ComponentName.tsx
   └── ComponentName.test.tsx (если в критическом пути)
   ```

3. Используй:
   - TypeScript
   - Tailwind CSS для стилей
   - forwardRef если нужен ref
   - Правильные aria-атрибуты

## Пример структуры компонента

```tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          // variants...
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
```
