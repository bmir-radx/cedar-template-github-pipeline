const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function copyAndProtectSheet() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetId = parseInt(process.env.GOOGLE_SHEET_ID);
  const newSheetName = process.env.NEW_SHEET_NAME;

  try {
    // Copy the sheet
    const copyResponse = await sheets.spreadsheets.sheets.copyTo({
      spreadsheetId: spreadsheetId,
      sheetId: sheetId,
      resource: { destinationSpreadsheetId: spreadsheetId },
    });

    const newSheetId = copyResponse.data.sheetId;

    // Rename the copied sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: newSheetId,
                title: newSheetName,
              },
              fields: 'title',
            },
          },
        ],
      },
    });

    // Get the properties of the new sheet to determine the number of rows and columns
    const sheetPropertiesResponse = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
      ranges: [],
      includeGridData: false
    });

    const newSheet = sheetPropertiesResponse.data.sheets.find(sheet => sheet.properties.sheetId === newSheetId);
    const rowCount = newSheet.properties.gridProperties.rowCount;
    const columnCount = newSheet.properties.gridProperties.columnCount;

    // Protect the new sheet (make it read-only)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [
          {
            addProtectedRange: {
              protectedRange: {
                range: {
                  sheetId: newSheetId,
                  startRowIndex: 0,
                  endRowIndex: rowCount,
                  startColumnIndex: 0,
                  endColumnIndex: columnCount
                },
                description: 'Read-only copy',
                warningOnly: false,
                editors: {
                  users: ['bmir-radx@radx-template-pipeline.iam.gserviceaccount.com',
                    'ycao77@stanford.edu', 
                    'matthew.horridge@stanford.edu'], 
                  groups: [], 
                  domainUsersCanEdit: false,
                }
              }
            }
          }
        ]
      }
    });

    console.log(`Copied and protected sheet: ${newSheetName}`);
  } catch (error) {
    console.error('Error copying and protecting sheet:', error);
  }
}

async function verifySheetProtection() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const newSheetName = process.env.NEW_SHEET_NAME;

  try {
    // Get the spreadsheet metadata including protected ranges
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
      ranges: [],
      includeGridData: false,
    });

    const newSheet = response.data.sheets.find(sheet => sheet.properties.title === newSheetName);
    if (!newSheet) {
      console.log(`Sheet named '${newSheetName}' not found.`);
      return;
    }

    const protectedRanges = newSheet.protectedRanges || [];
    if (protectedRanges.length === 0) {
      console.log(`No protected ranges found for sheet: ${newSheetName}`);
      return;
    }

    let isFullyProtected = false;
    for (const protectedRange of protectedRanges) {
      const range = protectedRange.range;
      console.log(`Protected range: Rows ${range.startRowIndex}-${range.endRowIndex}, Columns ${range.startColumnIndex}-${range.endColumnIndex}`);
      if (range.startRowIndex === 0 && range.endRowIndex === newSheet.properties.gridProperties.rowCount &&
          range.startColumnIndex === 0 && range.endColumnIndex === newSheet.properties.gridProperties.columnCount) {
        isFullyProtected = true;
      }
    }

    if (isFullyProtected) {
      console.log(`Sheet '${newSheetName}' is fully protected (read-only).`);
    } else {
      console.log(`Sheet '${newSheetName}' is not fully protected.`);
    }
  } catch (error) {
    console.error('Error verifying sheet protection:', error);
  }
}

async function main() {
  await copyAndProtectSheet();
  await verifySheetProtection();
}

main();

