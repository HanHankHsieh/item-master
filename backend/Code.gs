/**
 * ItemMaster Backend - Google Apps Script
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    
    if (rows.length < 2) {
      return createJsonResponse([]);
    }

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header.toLowerCase().replace(/ /g, '_')] = row[i];
      });
      return obj;
    });

    return createJsonResponse(data);
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getActiveSheet();
    
    // Header definition
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
    
    return createJsonResponse({ status: "success" });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
