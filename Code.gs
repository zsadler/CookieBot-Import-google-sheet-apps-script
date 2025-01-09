function downloadJSONFromURL() {
  // Replace this with your download URL
  const APIKEY = 'ACCOUNT_API_KEY';
  const CULTURE = 'default'; // ISO 639-1 language code or "default"
  const SERIAL = 'ACCOUNT_GROUP_ID';
  const DOMAIN = 'thedomain.com'; // domain name registered with cookieBot. Must match exactly. If there is no www then don't add it, otherwise it will break.
  const url = `https://consent.cookiebot.com/api/v1/${APIKEY}/json/domaingroup/${SERIAL}/${CULTURE}/domain/${DOMAIN}/cookies`

  try {
    // Configure advanced options for the URL fetch
    const options = {
      'method': 'GET',
      'muteHttpExceptions': false,
      'followRedirects': true,
      // Add headers if needed (e.g., for authentication)
      'headers': {
        'Authorization': '',
        'Accept': 'application/json'
      }
    };
    
    // Fetch the file
    const response = UrlFetchApp.fetch(url, options);
    
    // Check if the request was successful
    if (response.getResponseCode() !== 200) {
      throw new Error('Failed to download file. Status code: ' + response.getResponseCode());
    }
    
    // Get the content type
    const contentType = response.getHeaders()['Content-Type'];
    
    // Verify it's a JSON file
    if (!contentType.includes('application/json') && !contentType.includes('text/plain')) {
      // Some servers might send JSON with text/plain content type
      throw new Error('Downloaded file is not JSON. Content-Type: ' + contentType);
    }
    
    // Get the content and parse it
    const jsonString = response.getContentText();
    const jsonData = JSON.parse(jsonString);
    
    return jsonData;
    
  } catch (error) {
    Logger.log('Error downloading JSON: ' + error.toString());
    throw error;
  }
}

function clearSheet(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  
  if (lastRow > 0 && lastColumn > 0) {
    // Clear contents, formats, and filters
    sheet.getRange(1, 1, lastRow, lastColumn).clear({
      contentsOnly: true,
      formatOnly: true,
      skipFilteredRows: false
    });
    
    // Remove any existing filters
    const filter = sheet.getFilter();
    if (filter) {
      filter.remove();
    }
    
    // Clear any data validation rules
    sheet.getRange(1, 1, lastRow, lastColumn).clearDataValidations();
    
    // Reset column widths to default
    sheet.setColumnWidths(1, lastColumn, 100);
    
    // Clear any conditional formatting rules
    const rules = sheet.getConditionalFormatRules();
    if (rules.length > 0) {
      sheet.clearConditionalFormatRules();
    }
  }
}


function writeCookiesToSheet() {
  try {
    // Get the JSON data
    const cookiesJSON = downloadJSONFromURL();
    
    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    // Clear everything from the sheet
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    
    if (lastRow > 0 && lastColumn > 0) {
      // Clear contents, formats, and filters
      sheet.getRange(1, 1, lastRow, lastColumn).clear({
        contentsOnly: true,
        formatOnly: true,
        skipFilteredRows: false
      });
      
      // Remove any existing filters
      const filter = sheet.getFilter();
      if (filter) {
        filter.remove();
      }
      
      // Clear any data validation rules
      sheet.getRange(1, 1, lastRow, lastColumn).clearDataValidations();
      
      // Reset column widths to default
      sheet.setColumnWidths(1, lastColumn, 100);
      
      // Clear any conditional formatting rules
      const rules = sheet.getConditionalFormatRules();
      if (rules.length > 0) {
        sheet.clearConditionalFormatRules();
      }
    }
    
    // Set headers
    const headers = ["Name", "Purpose Description", "Provider"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Process each cookie
    let rowData = [];
    Object.keys(cookiesJSON.cookies).forEach(index => {
      const cookieData = cookiesJSON.cookies[index];
      
      rowData.push([
        cookieData.Name,
        cookieData.PurposeDescription,
        cookieData.Provider
      ]);
      
    });
    
    // Write data to sheet
    if (rowData.length > 0) {
      sheet.getRange(2, 1, rowData.length, headers.length).setValues(rowData);
    }
    
    // Format sheet
    sheet.autoResizeColumns(1, headers.length);
    sheet.getRange(1, 1, 1, headers.length).createFilter();
    
    // Add timestamp of last update
    const timestampRow = sheet.getLastRow() + 2;
    sheet.getRange(timestampRow, 1, 1, 2).setValues([
      ['Last Updated', new Date().toLocaleString()]
    ]);
    
    return "Success: Cookies data written to sheet";
    
  } catch (error) {
    Logger.log('Error in writeCookiesToSheet: ' + error.toString());
    throw error;
  }
}

// Add menu item to run the script
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Cookie Tools')
    .addItem('Download and Process Cookies', 'writeCookiesToSheet')
    .addToUi();
}
