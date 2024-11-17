// types/toast.ts
import { Toast as ToastType } from "@/components/ui/toast"

export interface ToastData {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  action?: React.ReactNode
}

export type ToastOptions = Partial<ToastType> & ToastData

export interface ToastContextValue {
  toast: (data: ToastData) => void
  dismiss: (toastId?: string) => void
}