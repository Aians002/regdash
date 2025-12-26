# Google Drive Sync Setup Instructions

To enable the synchronization feature, you need to set up a Google Apps Script that will receive the file from your application and save it to your Google Drive.

## Step 1: Create the Google Apps Script

1.  Go to [script.google.com](https://script.google.com/) and click on **"New Project"**.
2.  Delete any code in the editor and paste the following code:

```javascript
function doPost(e) {
  try {
    // 1. Parse the incoming data
    var data = JSON.parse(e.postData.contents)

    // 2. Get the folder where you want to save the files
    // REPLACE THIS WITH YOUR ACTUAL FOLDER ID
    var folderId = 'YOUR_FOLDER_ID_HERE'
    var folder = DriveApp.getFolderById(folderId)

    // 3. Create the file blob from base64 data
    var blob = Utilities.newBlob(
      Utilities.base64Decode(data.fileData),
      data.mimeType,
      data.filename
    )

    // 4. Save the file to the folder
    var file = folder.createFile(blob)

    // 5. Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success', fileId: file.getId() })
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
```

## Step 2: Get your Folder ID

1.  Open Google Drive and navigate to the folder where you want to save the files.
2.  Look at the URL in your browser. It will look like this:
    `https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J`
3.  The part after `folders/` is your **Folder ID** (e.g., `1A2B3C4D5E6F7G8H9I0J`).
4.  Copy this ID and replace `"YOUR_FOLDER_ID_HERE"` in the script code above.

## Step 3: Deploy the Script

1.  Click the **"Deploy"** button (blue button top right) -> **"New deployment"**.
2.  Click the **gear icon** next to "Select type" and choose **"Web app"**.
3.  Fill in the details:
    - **Description:** "RegDash Sync"
    - **Execute as:** "Me" (your email)
    - **Who has access:** **"Anyone"** (This is crucial for the app to access it without login).
4.  Click **"Deploy"**.
5.  You might be asked to authorize the script. Click "Review permissions", choose your account, and if you see a warning "Google hasn't verified this app", click "Advanced" -> "Go to ... (unsafe)" -> "Allow".
6.  Copy the **"Web app URL"** generated (it starts with `https://script.google.com/macros/s/...`).

## Step 4: Update the Application Code

1.  Open the file `src/renderer/src/components/LanguageSelector.tsx` in your project.
2.  Find the line:
    ```javascript
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec'
    ```
3.  Replace the URL with the **Web app URL** you copied in Step 3.

## Step 5: Test

1.  Run your app.
2.  Ensure you are connected to the internet.
3.  On the first screen (Language Selector), you should see a sync icon in the top right.
4.  Click it. It should rotate and then say "Sync successful!".
5.  Check your Google Drive folder for the new file.
