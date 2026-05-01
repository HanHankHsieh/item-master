/**
 * ItemMaster Backend - Google Apps Script
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    
    if (rows.length < 2) {
      return sendResponse([], e);
    }

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        // Normalize keys for the frontend
        let key = header.toLowerCase().replace(/ /g, '_');
        obj[key] = row[i];
      });
      return obj;
    });

    return sendResponse(data, e);
  } catch (error) {
    return sendResponse({ status: "error", message: error.toString() }, e);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getActiveSheet();
    
    const headers = ["Timestamp", "Item Name", "Expiration Date", "Storage Location", "Created At"];
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
    }
    
    const items = Array.isArray(data) ? data : [data];
    items.forEach(item => {
      sheet.appendRow([
        new Date().toLocaleString(),
        item.name || "Unknown",
        item.expiry || "",
        item.location || "",
        item.created_at || new Date().toLocaleString()
      ]);
    });
    
    return sendResponse({ status: "success" });
  } catch (error) {
    return sendResponse({ status: "error", message: error.toString() });
  }
}

/**
 * Helper to handle both standard JSON and JSONP responses
 */
function sendResponse(data, e) {
  const json = JSON.stringify(data);
  const callback = e && e.parameter ? e.parameter.callback : null;
  
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService.createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
