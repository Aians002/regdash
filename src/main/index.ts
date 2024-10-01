import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'

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
    const pdfPath = join(app.getPath('temp'), 'receipt.pdf')
    // const printOptions = {
    //   silent: true,
    //   printBackground: false,
    //   color: false,
    //   margins: {
    //     marginType: 'printableArea' as 'printableArea'
    //   },
    //   landscape: false,
    //   pagesPerSheet: 1,
    //   collate: false,
    //   copies: 1,
    //   header: 'Page header',
    //   footer: 'Page footer'
    // }

    mainWindow.webContents
      .printToPDF({})
      .then((data) => {
        fs.writeFile(pdfPath, data, (error) => {
          if (error) {
            console.error('Failed to write PDF', error)
            event.reply('print-error', 'Failed to generate PDF')
          } else {
            console.log(`Wrote PDF successfully to ${pdfPath}`)

            // Print the PDF file
            const win = new BrowserWindow({
              show: false
              // webPreferences: { nodeIntegration: true }
            })
            win.loadFile(pdfPath)
            setTimeout(() => {
              win.webContents.on('did-finish-load', () => {
                // win.webContents.print(printOptions, (success, errorType) => {
                //   if (!success) {
                //     console.log('Print failed', errorType)
                //     event.reply('print-error', `Print failed: ${errorType}`)
                //   } else {
                //     console.log('Print successful')
                //     event.reply('print-success')
                //   }
                //   win.close()
                // })
                window.print()
              })
            }, 1500)
          }
        })
      })
      .catch((error) => {
        console.log('Failed to generate PDF', error)
        event.reply('print-error', 'Failed to generate PDF')
      })
  }
})

ipcMain.on('print-receipt2', (event, receiptHTML) => {
  if (mainWindow) {
    const tempPath = join(app.getPath('temp'), 'receipt.html')

    // Write the receipt HTML to a temporary file
    fs.writeFile(tempPath, receiptHTML, (err) => {
      if (err) {
        console.error('Failed to write temporary HTML file:', err)
        event.reply('print-error', 'Failed to prepare receipt for printing')
        return
      }

      // Create a new window to load the receipt HTML
      const printWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      })

      printWindow.loadFile(tempPath)

      printWindow.webContents.on('did-finish-load', () => {
        // Wait a bit to ensure content is fully rendered
        setTimeout(() => {
          printWindow.webContents.print(
            {
              silent: false,
              printBackground: true,
              color: true,
              margins: {
                marginType: 'printableArea'
              },
              landscape: false,
              pagesPerSheet: 1,
              collate: false,
              copies: 1
            },
            (success, failureReason) => {
              if (!success) {
                console.error('Print failed:', failureReason)
                event.reply('print-error', `Printing failed: ${failureReason}`)
              } else {
                console.log('Print successful')
                event.reply('print-success')
              }

              // Clean up
              printWindow.close()
              fs.unlink(tempPath, (err) => {
                if (err) console.error('Failed to delete temporary file:', err)
              })
            }
          )
        }, 1000) // Adjust this delay as needed
      })
    })
  }
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
