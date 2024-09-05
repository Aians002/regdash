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

  // Convert formData into a row format
  const rowData = [
    {
      Name: formData.name,
      Phone: formData.phone,
      Village: formData.village,
      District: formData.district
    }
  ]

  // Append the new data to the worksheet
  XLSX.utils.sheet_add_json(worksheet, rowData, { skipHeader: true, origin: -1 })

  // Write the updated workbook to the file
  XLSX.writeFile(workbook, EXCEL_FILE_NAME)

  console.log(`Excel file saved to: ${EXCEL_FILE_NAME}`)

  // Optionally, return or use this path elsewhere in your app
  return EXCEL_FILE_NAME
}

module.exports = { addDataToExcel }
