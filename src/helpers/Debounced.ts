import { useEffect, useState } from 'react'
const DELAY = 300

export const useDebounced = (
  value: string,
  validate: (value: string) => string
) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const [error, setError] = useState<string>()
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
        if (debouncedValue) {
          setError(validate(value))
        }
      }, DELAY)

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [debouncedValue, validate, value] // Only re-call effect if value or delay changes
  )
  return error
}
