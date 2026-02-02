export const metadata = {
  title: 'Cookie Generator',
  description: 'Бесплатный генератор плашки cookie-согласия для вашего сайта',
}

export default function CookieGeneratorPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Cookie Generator</h1>
        <p className="mt-2 text-muted-foreground">
          Создайте плашку cookie-согласия для вашего сайта. Настройте стиль,
          текст и поведение.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Настройки</h2>

            <div className="mt-6 space-y-4">
              {/* Position */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Позиция
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {['Снизу', 'Сверху', 'Плавающая'].map((pos) => (
                    <button
                      key={pos}
                      className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted first:border-primary first:bg-primary/10 first:text-primary"
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Scheme */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Цветовая схема
                </label>
                <div className="mt-2 flex gap-2">
                  {[
                    { name: 'Светлая', class: 'bg-white border-border' },
                    { name: 'Тёмная', class: 'bg-zinc-900 border-zinc-700' },
                    { name: 'Синяя', class: 'bg-blue-600 border-blue-500' },
                  ].map((scheme) => (
                    <button
                      key={scheme.name}
                      className={`size-10 rounded-lg border ${scheme.class}`}
                      title={scheme.name}
                    />
                  ))}
                </div>
              </div>

              {/* Text */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Текст сообщения
                </label>
                <textarea
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  defaultValue="Мы используем cookies для улучшения работы сайта."
                />
              </div>

              {/* Policy Link */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Ссылка на политику
                </label>
                <input
                  type="url"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://example.com/privacy"
                />
              </div>

              {/* Days */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Срок скрытия (дней)
                </label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue={365}
                  min={1}
                  max={365}
                />
              </div>

              {/* Backdrop Blur */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Размытие фона
                </label>
                <button className="relative h-6 w-11 rounded-full bg-primary transition-colors">
                  <span className="absolute left-1 top-1 size-4 rounded-full bg-white transition-transform translate-x-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Get Code Button */}
          <button className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Получить код
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Предпросмотр</h2>

          <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
            {/* Fake website background */}
            <div className="absolute inset-0 bg-gradient-to-b from-muted to-muted/50 p-4">
              <div className="h-4 w-24 rounded bg-muted-foreground/20" />
              <div className="mt-4 h-3 w-full rounded bg-muted-foreground/10" />
              <div className="mt-2 h-3 w-3/4 rounded bg-muted-foreground/10" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted-foreground/10" />
            </div>

            {/* Cookie banner preview */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-card-foreground">
                  Мы используем cookies для улучшения работы сайта.{' '}
                  <a href="#" className="text-primary hover:underline">
                    Подробнее
                  </a>
                </p>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted">
                    Отклонить
                  </button>
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90">
                    Принять
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Виджет адаптируется под размер экрана пользователя
          </p>
        </div>
      </div>
    </main>
  )
}
