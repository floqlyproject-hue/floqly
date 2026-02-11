'use client'

export default function SimpleWidgetTemplate() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      {/* Widget Preview Container */}
      <div className="relative h-[600px] w-full max-w-4xl rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Simple Widget — Design Template
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Разработка базового дизайна виджета
          </p>
        </div>

        {/* Widget будет здесь */}
        <div className="flex h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
          <p className="text-muted-foreground">
            Добавьте код виджета из source/ или создайте новый дизайн
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-4 rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground">
          <p><strong>Инструкция:</strong></p>
          <p>1. Добавьте HTML/CSS/JS код в папку source/</p>
          <p>2. Добавьте референсы в папку references/</p>
          <p>3. Обновите notes.md с описанием и статусом</p>
          <p>4. Реализуйте дизайн в этом файле</p>
        </div>
      </div>
    </main>
  )
}
