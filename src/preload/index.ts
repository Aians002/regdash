import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Expose a method to save data to Excel
  saveToExcel: (formData: any) => {
    ipcRenderer.send('save-to-excel', formData)
  },
  printImage: (imageData: string) => {
    ipcRenderer.send('print-image', imageData)
  }

  // printReceipt2: (html) => {
  //   ipcRenderer.send('print-receipt2', html)
  // } // Optional: Listen for success or error messages from the main process
  // onExcelSaveSuccess: (callback: (message: string) => void) => {
  //   ipcRenderer.on('excel-save-success', (_, message) => callback(message))
  // },

  // onExcelSaveError: (callback: (message: string) => void) => {
  //   ipcRenderer.on('excel-save-error', (_, message) => callback(message))
  // },

  // Expose a method to print the receipt
  // printReceipt: () => {
  //   ipcRenderer.send('print-receipt')
  // }

  // // Optional: Listen for print success or error (if needed)
  // onPrintSuccess: (callback: (message: string) => void) => {
  //   ipcRenderer.on('print-success', (_, message) => callback(message))
  // },

  // onPrintError: (callback: (message: string) => void) => {
  //   ipcRenderer.on('print-error', (_, message) => callback(message))
  // }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
