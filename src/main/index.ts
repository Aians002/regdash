import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import os from 'os'
import path from 'path'

// Import the Excel utility function
import { addDataToExcel } from './excelUtils'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    fullscreen: true
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Cleanup on window close
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // Handle re-creation of windows on macOS
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Handle saving data to Excel when triggered from the renderer process
ipcMain.on('save-to-excel', (event, formData) => {
  try {
    addDataToExcel(formData)
    event.reply('excel-save-success', 'Data saved successfully!')
  } catch (error) {
    console.error('Error saving data to Excel:', error)
    event.reply(
      'excel-save-error',
      `Failed to save data: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
})

// Handle automatic printing when triggered from the renderer process
ipcMain.on('print-receipt', (event, receiptHTML) => {
  if (mainWindow) {
    let printWindow: BrowserWindow | null = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    })

    const styledReceiptHTML = `
      <html>
        <head>
          <style>
            body {
              font-size: 10px; /* Adjust the font size as needed */
              line-height: 0.7;
            }
          </style>
        </head>
        <body>
          ${receiptHTML}
        </body>
      </html>
    `

    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(styledReceiptHTML)}`)

    printWindow.webContents.on('did-finish-load', () => {
      if (!printWindow) return

      printWindow.webContents.print(
        {
          silent: true,
          printBackground: true,
          color: true,
          margins: {
            marginType: 'printableArea'
          },
          landscape: false,
          pagesPerSheet: 1,
          collate: false,
          copies: 1,
          pageSize: { width: 80000, height: 60000 } // Adjust as needed for your receipt size
        },
        (success, failureReason) => {
          if (!success) {
            event.reply('print-error', `Printing failed: ${failureReason}`)
          } else {
            event.reply('print-success', 'Printing successful')
          }
          // Ensure window is closed and dereferenced
          if (printWindow && !printWindow.isDestroyed()) {
            printWindow.close()
            printWindow = null
          }
        }
      )
    })

    // Handle window close and cleanup
    printWindow.on('closed', () => {
      printWindow = null
    })
  }
})

ipcMain.handle('read-registration-file', async () => {
  const filePath = path.join(os.homedir(), 'Downloads', 'registration_data.xlsx')
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath)
    return fileBuffer.toString('base64')
  }
  return null
})

ipcMain.handle('sync-to-drive', async () => {
  const filePath = path.join(os.homedir(), 'Downloads', 'registration_data.xlsx')
  if (!fs.existsSync(filePath)) {
    return { success: false, message: 'Registration file not found.' }
  }

  try {
    const fileBuffer = fs.readFileSync(filePath)
    const fileData = fileBuffer.toString('base64')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `registration_data_${timestamp}.xlsx`

    // REPLACE THIS URL WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
    const SCRIPT_URL =
      'https://script.google.com/macros/s/AKfycbxVhDqh6753f1n41uI7vk1D6edC6yDN3E31aq5rjPwrmQUV24QImenwmYo7nKJIv0hi/exec'

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        fileData,
        filename,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`)
    }

    const text = await response.text()
    let result
    try {
      result = JSON.parse(text)
    } catch (e) {
      console.error('Failed to parse response as JSON:', text)
      throw new Error("Invalid response from server. Check if the script is deployed as 'Anyone'.")
    }

    if (result.status === 'success') {
      return { success: true, message: 'Sync successful!' }
    } else {
      return { success: false, message: result.message || 'Unknown error from script' }
    }
  } catch (error: any) {
    console.error('Sync failed', error)
    return { success: false, message: `Sync failed: ${error.message}` }
  }
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
