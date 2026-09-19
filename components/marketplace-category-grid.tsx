'use client'

import Link from 'next/link'

export type CategoryCardItem = {
  id: string
  name: string
  subtitle?: string
  badgeText?: string
  letterBadge?: string
  image: string
  href?: string
  onClick?: () => void
  isActive?: boolean
}

export type MarketplaceCategoryGridProps = {
  kicker: string
  title: string
  description?: string
  categories: CategoryCardItem[]
  activeId?: string
  onSelect?: (id: string) => void
  columnsDesktop?: 4 | 5 | 6
}

export function CategoryCard({
  item,
  isActive,
  onSelect,
}: {
  item: CategoryCardItem
  isActive?: boolean
  onSelect?: (id: string) => void
}) {
  const content = (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 cursor-pointer ${
        isActive
          ? 'border-[#173b32] ring-2 ring-[#173b32]/20 shadow-md'
          : 'border-[#dfe4dc] hover:border-[#c89c47] hover:shadow-md hover:-translate-y-0.5'
      }`}
      onClick={() => {
        if (onSelect) onSelect(item.id)
        if (item.onClick) item.onClick()
      }}
    >
      {/* Photo top 60-65% */}
      <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-[#eef2ec]">
        <img
          src={item.image}
          alt={`${item.name} category`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {item.badgeText && (
          <span className="absolute left-2.5 top-2.5 rounded bg-[#173b32]/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
            {item.badgeText}
          </span>
        )}
      </div>

      {/* Category Details Underneath */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="flex items-center gap-2">
          {item.letterBadge && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e4eee2] text-[10px] font-bold text-[#173b32]">
              {item.letterBadge}
            </span>
          )}
          <h3 className="text-sm font-bold leading-tight text-[#173b32] group-hover:text-[#c89c47] transition-colors line-clamp-1">
            {item.name}
          </h3>
        </div>

        {item.subtitle && (
          <p className="mt-1 text-[11px] font-medium text-[#65766e] line-clamp-1">
            {item.subtitle}
          </p>
        )}
      </div>
    </div>
  )

  if (item.href) {
    return (
      <Link href={item.href} className="block no-underline">
        {content}
      </Link>
    )
  }

  return content
}

export default function MarketplaceCategoryGrid({
  kicker,
  title,
  description,
  categories,
  activeId,
  onSelect,
  columnsDesktop = 6,
}: MarketplaceCategoryGridProps) {
  const colClass =
    columnsDesktop === 6
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      : columnsDesktop === 5
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
      : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4'

  return (
    <section className="mb-10 w-full" aria-label={title}>
      <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#c89c47]">
            {kicker}
          </p>
          <h2 className="mt-1 font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#173b32]">
            {title}
          </h2>
          {description && (
            <p className="mt-1.5 max-w-2xl text-xs md:text-sm text-[#65766e]">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className={`grid ${colClass} gap-3 md:gap-4`}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            item={cat}
            isActive={activeId ? activeId === cat.id : cat.isActive}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
