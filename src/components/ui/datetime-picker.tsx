import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  date?: Date
  onDateTimeChange?: (date: Date) => void
  className?: string
}

const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(
  ({ date, onDateTimeChange, className }, ref) => {
    const [hours, setHours] = React.useState(date ? date.getHours().toString().padStart(2, '0') : '00')
    const [minutes, setMinutes] = React.useState(date ? date.getMinutes().toString().padStart(2, '0') : '00')
    const [seconds, setSeconds] = React.useState(date ? date.getSeconds().toString().padStart(2, '0') : '00')

    React.useEffect(() => {
      if (date) {
        setHours(date.getHours().toString().padStart(2, '0'))
        setMinutes(date.getMinutes().toString().padStart(2, '0'))
        setSeconds(date.getSeconds().toString().padStart(2, '0'))
      }
    }, [date])

    const updateDateTime = (newHours: string, newMinutes: string, newSeconds: string) => {
      if (!date) return
      
      const newDate = new Date(date)
      newDate.setHours(parseInt(newHours) || 0)
      newDate.setMinutes(parseInt(newMinutes) || 0)
      newDate.setSeconds(parseInt(newSeconds) || 0)
      
      onDateTimeChange?.(newDate)
    }

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 2)
      const numValue = Math.min(parseInt(value) || 0, 23)
      const formattedValue = numValue.toString().padStart(2, '0')
      setHours(formattedValue)
      updateDateTime(formattedValue, minutes, seconds)
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 2)
      const numValue = Math.min(parseInt(value) || 0, 59)
      const formattedValue = numValue.toString().padStart(2, '0')
      setMinutes(formattedValue)
      updateDateTime(hours, formattedValue, seconds)
    }

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 2)
      const numValue = Math.min(parseInt(value) || 0, 59)
      const formattedValue = numValue.toString().padStart(2, '0')
      setSeconds(formattedValue)
      updateDateTime(hours, minutes, formattedValue)
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <Label className="text-xs text-slate-500">Hora (HH:MM:SS)</Label>
        <div className="flex items-center space-x-1">
          <Input
            type="text"
            value={hours}
            onChange={handleHoursChange}
            placeholder="00"
            className="w-12 text-center text-sm"
            maxLength={2}
          />
          <span className="text-slate-400">:</span>
          <Input
            type="text"
            value={minutes}
            onChange={handleMinutesChange}
            placeholder="00"
            className="w-12 text-center text-sm"
            maxLength={2}
          />
          <span className="text-slate-400">:</span>
          <Input
            type="text"
            value={seconds}
            onChange={handleSecondsChange}
            placeholder="00"
            className="w-12 text-center text-sm"
            maxLength={2}
          />
        </div>
      </div>
    )
  }
)
DateTimePicker.displayName = "DateTimePicker"

export { DateTimePicker }