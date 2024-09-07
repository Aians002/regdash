import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveToExcel: (formData: any) => void
      onExcelSaveSuccess: (callback: (message: string) => void) => void
      onExcelSaveError: (callback: (message: string) => void) => void
      printReceipt: () => void
      onPrintSuccess: (callback: (message: string) => void) => void
      onPrintError: (callback: (message: string) => void) => void
    }
  }
}
