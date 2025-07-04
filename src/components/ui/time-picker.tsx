import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TimePickerProps extends Omit<React.ComponentProps<"input">, "type"> {
  value?: string
  onValueChange?: (value: string) => void
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, value, onValueChange, onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState(value || '')
    const [inputType, setInputType] = React.useState<'text' | 'time'>('text')

    React.useEffect(() => {
      setInputValue(value || '')
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onValueChange?.(newValue)
      onChange?.(e)
    }

    const handleFocus = () => {
      // Switch to time type on focus for native picker
      setInputType('time')
    }

    const handleBlur = () => {
      // Switch back to text for manual editing
      setInputType('text')
    }

    const isValidTimeFormat = (time: string) => {
      return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
    }

    return (
      <Input
        {...props}
        ref={ref}
        type={inputType}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="HH:MM"
        className={cn(
          !isValidTimeFormat(inputValue) && inputValue ? "border-destructive" : "",
          className
        )}
      />
    )
  }
)
TimePicker.displayName = "TimePicker"

export { TimePicker }