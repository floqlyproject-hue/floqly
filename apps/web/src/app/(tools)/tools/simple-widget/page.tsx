export const metadata = {
  title: 'Simple Widget',
  description:
    'Бесплатный конструктор кнопок связи: WhatsApp, Telegram, VK и другие каналы',
}

export default function SimpleWidgetPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Simple Widget</h1>
        <p className="mt-2 text-muted-foreground">
          Создайте виджет с кнопками связи для вашего сайта. WhatsApp, Telegram,
          VK и другие каналы.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Каналы связи</h2>

            <div className="mt-6 space-y-3">
              {[
                { name: 'WhatsApp', color: 'bg-green-500', enabled: true },
                { name: 'Telegram', color: 'bg-blue-500', enabled: true },
                { name: 'VK', color: 'bg-blue-600', enabled: false },
                { name: 'Email', color: 'bg-red-500', enabled: false },
                { name: 'Телефон', color: 'bg-emerald-500', enabled: false },
              ].map((channel) => (
                <div
                  key={channel.name}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    channel.enabled
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-lg ${channel.color}`} />
                    <span className="font-medium text-foreground">
                      {channel.name}
                    </span>
                  </div>
                  <button
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      channel.enabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${
                        channel.enabled ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              + Добавить канал
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Настройки</h2>

            <div className="mt-6 space-y-4">
              {/* Position */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Позиция
                </label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {['↙️', '↘️', '↖️', '↗️'].map((pos, i) => (
                    <button
                      key={i}
                      className={`rounded-lg border px-4 py-2 text-lg transition-colors ${
                        i === 1
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:bg-muted'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Цвет кнопки
                </label>
                <div className="mt-2 flex gap-2">
                  {[
                    'bg-primary',
                    'bg-green-500',
                    'bg-blue-500',
                    'bg-purple-500',
                    'bg-zinc-900',
                  ].map((color, i) => (
                    <button
                      key={i}
                      className={`size-10 rounded-lg ${color} ${
                        i === 0 ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* CTA Message */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Приветственное сообщение
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Напишите нам!"
                  defaultValue="Есть вопрос? Напишите нам!"
                />
              </div>

              {/* Show CTA */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Показывать облачко
                </label>
                <button className="relative h-6 w-11 rounded-full bg-primary transition-colors">
                  <span className="absolute left-6 top-1 size-4 rounded-full bg-white" />
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

            {/* Widget preview */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
              {/* CTA Bubble */}
              <div className="rounded-lg bg-card px-3 py-2 text-sm text-card-foreground shadow-lg">
                Есть вопрос? Напишите нам!
              </div>

              {/* Expanded buttons */}
              <div className="flex flex-col gap-2">
                <button className="size-12 rounded-full bg-green-500 shadow-lg transition-transform hover:scale-110">
                  <svg
                    className="mx-auto size-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>
                <button className="size-12 rounded-full bg-blue-500 shadow-lg transition-transform hover:scale-110">
                  <svg
                    className="mx-auto size-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </button>
              </div>

              {/* Main FAB */}
              <button className="size-14 rounded-full bg-primary shadow-lg transition-transform hover:scale-110">
                <svg
                  className="mx-auto size-6 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Виджет появляется в углу экрана и раскрывается при нажатии
          </p>
        </div>
      </div>
    </main>
  )
}
