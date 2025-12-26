const fs = require('fs')
const path = require('path')
const os = require('os')
const XLSX = require('xlsx')

// Set the Excel file to be saved in the user's Downloads folder
const EXCEL_FILE_NAME = path.join(os.homedir(), 'Downloads', 'registration_data.xlsx')

export function addDataToExcel(formData) {
  let workbook
  let worksheet

  // Check if the file already exists
  if (fs.existsSync(EXCEL_FILE_NAME)) {
    workbook = XLSX.readFile(EXCEL_FILE_NAME)
    worksheet = workbook.Sheets[workbook.SheetNames[0]]
  } else {
    // Create a new workbook if the file doesn't exist
    workbook = XLSX.utils.book_new()
    worksheet = XLSX.utils.json_to_sheet([])
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registration Data')
  }

  // Build a row object including a timestamp (last column)
  const timestamp = new Date().toLocaleString()
  const rowObject = {
    Name: formData.name,
    Phone: formData.phone,
    Village: formData.village,
    District: formData.district,
    Timestamp: timestamp
  }

  // If the file already exists, append the row without headers.
  if (fs.existsSync(EXCEL_FILE_NAME)) {
    XLSX.utils.sheet_add_json(worksheet, [rowObject], { skipHeader: true, origin: -1 })
  } else {
    // If it doesn't exist, create the sheet with headers and the first row.
    worksheet = XLSX.utils.json_to_sheet([rowObject])
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registration Data')
  }

  // Write the updated workbook to the file
  XLSX.writeFile(workbook, EXCEL_FILE_NAME)

  console.log(`Excel file saved to: ${EXCEL_FILE_NAME}`)

  // Optionally, return or use this path elsewhere in your app
  return EXCEL_FILE_NAME
}

module.exports = { addDataToExcel }
