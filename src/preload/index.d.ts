import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveToExcel: (formData: any) => void
      printReceipt: (html: string) => void
      readRegistrationFile: () => Promise<string | null>
      syncToDrive: () => Promise<{ success: boolean; message: string }>
    }
  }
}
