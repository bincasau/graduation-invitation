const SPREADSHEET_ID = "1TBkN2z19mJQB1vVHP50CKi9DjTSlZrAWr4Utc-_-J6g";
const SHEET_NAME = "RSVP";
const HEADERS = ["Thời gian", "Tên khách", "Tham dự", "Lời nhắn", "Link thiệp"];

function doGet() {
  return ContentService.createTextOutput("RSVP endpoint is ready.");
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Quietly discard automated submissions caught by the hidden form field.
    if (String(data.company || "").trim()) {
      return jsonOutput_({ ok: true });
    }

    const guest = safeCell_(data.guest, 120);
    const attendance = data.attendance === "yes"
      ? "Có thể tham dự"
      : data.attendance === "no"
        ? "Không thể tham dự"
        : "";
    const message = safeCell_(data.message, 1000);
    const pageUrl = safeCell_(data.pageUrl, 1000);

    if (!guest || !attendance) {
      return jsonOutput_({ ok: false, error: "Thiếu tên khách hoặc câu trả lời." });
    }
    if (!SPREADSHEET_ID || SPREADSHEET_ID === "PASTE_SPREADSHEET_ID_HERE") {
      return jsonOutput_({ ok: false, error: "Chưa cấu hình Spreadsheet ID." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

      sheet.appendRow([new Date(), guest, attendance, message, pageUrl]);
    } finally {
      lock.releaseLock();
    }

    return jsonOutput_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonOutput_({ ok: false, error: "Không lưu được phản hồi." });
  }
}

function safeCell_(value, maxLength) {
  const text = String(value == null ? "" : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, maxLength);

  // Prevent user-supplied text from being evaluated as a Sheets formula.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonOutput_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
