import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MultiSelectProps {
  options: { value: string; label: string }[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  maxDisplay?: number
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "No se encontraron opciones",
  className,
  maxDisplay = 3,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onValueChange(value.filter((i) => i !== item))
  }

  const handleSelect = (item: string) => {
    if (item === "todos") {
      onValueChange(["todos"])
    } else {
      const newValue = value.includes("todos") 
        ? [item] 
        : value.includes(item) 
          ? value.filter((i) => i !== item)
          : [...value.filter(i => i !== "todos"), item]
      onValueChange(newValue.length === 0 ? ["todos"] : newValue)
    }
  }

  const displayValue = React.useMemo(() => {
    if (value.includes("todos")) return "Todos"
    if (value.length === 0) return placeholder
    if (value.length <= maxDisplay) {
      return value.map(v => options.find(opt => opt.value === v)?.label || v).join(", ")
    }
    return `${value.length} seleccionados`
  }, [value, options, placeholder, maxDisplay])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between text-left font-normal", className)}
        >
          <span className="truncate">{displayValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="checkbox"
                      checked={value.includes(option.value) || (option.value !== "todos" && value.includes("todos"))}
                      onChange={() => {}}
                      className="h-4 w-4"
                    />
                    <span>{option.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// For selected items display
export function MultiSelectDisplay({ 
  value, 
  options, 
  onRemove,
  maxDisplay = 3 
}: { 
  value: string[]
  options: { value: string; label: string }[]
  onRemove: (item: string) => void
  maxDisplay?: number
}) {
  if (value.includes("todos") || value.length === 0) return null

  const displayItems = value.slice(0, maxDisplay)
  const remaining = value.length - maxDisplay

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {displayItems.map((item) => {
        const option = options.find(opt => opt.value === item)
        return (
          <Badge key={item} variant="secondary" className="text-xs">
            {option?.label || item}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => onRemove(item)}
            />
          </Badge>
        )
      })}
      {remaining > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remaining} más
        </Badge>
      )}
    </div>
  )
}