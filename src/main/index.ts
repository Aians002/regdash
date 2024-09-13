import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Import the Excel utility function
import { addDataToExcel } from './excelUtils'

let mainWindow: BrowserWindow

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
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
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
    event.reply('excel-save-error', 'Failed to save data.')
  }
})

// Handle automatic printing when triggered from the renderer process
ipcMain.on('print-receipt', (event) => {
  if (mainWindow) {
    mainWindow.webContents.print(
      { silent: true, printBackground: false, color: false },
      (success, failureReason) => {
        if (success) {
          event.reply('print-success') // Notify renderer when printing is complete
        } else {
          console.error('Print failed:', failureReason)
        }
      }
    )
  }
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
