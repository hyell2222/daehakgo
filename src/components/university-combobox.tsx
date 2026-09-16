import { useEffect, useMemo, useRef, useState } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function UniversityCombobox({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const filtered = useMemo(() => {
    const keyword = value.trim()
    if (!keyword) {
      return options
    }
    return options.filter((name) => name.includes(keyword))
  }, [options, value])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  useEffect(() => {
    setHighlight(0)
  }, [filtered])

  function choose(name: string) {
    onChange(name)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative max-w-md">
      <Input
        value={value}
        autoComplete="off"
        spellCheck={false}
        role="combobox"
        aria-expanded={open}
        aria-controls="university-search-options"
        aria-autocomplete="list"
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault()
            setOpen(true)
            setHighlight((index) => Math.min(filtered.length - 1, index + 1))
          }
          if (event.key === "ArrowUp") {
            event.preventDefault()
            setHighlight((index) => Math.max(0, index - 1))
          }
          if (event.key === "Enter" && open && filtered[highlight]) {
            event.preventDefault()
            choose(filtered[highlight])
          }
          if (event.key === "Escape") {
            setOpen(false)
          }
        }}
      />
      {open && filtered.length > 0 ? (
        <ul
          id="university-search-options"
          role="listbox"
          className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {filtered.map((name, index) => (
            <li key={name} role="option" aria-selected={index === highlight}>
              <button
                type="button"
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-sm",
                  index === highlight && "bg-accent text-accent-foreground",
                )}
                onMouseEnter={() => setHighlight(index)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  choose(name)
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
