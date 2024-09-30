import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveToExcel: (formData: any) => void
      // onExcelSaveSuccess: (callback: (message: string) => void) => void
      // onExcelSaveError: (callback: (message: string) => void) => void
      printReceipt: () => void
      print(
        options?: WebContentsPrintOptions,
        callback?: (success: boolean, failureReason: string) => void
      ): void

      printReceipt2: (html: string) => void
      //   onPrintSuccess: (callback: (message: string) => void) => void
      //   onPrintError: (callback: (message: string) => void) => void
    }
  }
}
