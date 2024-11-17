// hooks/useDarkMode.ts
import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode,
  } as const
}

export type UseDarkModeReturn = ReturnType<typeof useDarkMode>