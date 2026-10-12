// Setup:
// 1. Create a Google Sheet. Put these headers in row 1: Time | Name | Email | Message
// 2. Extensions -> Apps Script, paste this whole file, save.
// 3. Deploy -> New deployment -> type "Web app" -> Execute as: Me -> Who has access: Anyone -> Deploy.
//    Google asks you to authorize (Sheets + Gmail send). Allow it.
// 4. Copy the Web app URL (ends in /exec) into the Netlify variable VITE_SHEET_URL, then redeploy the site.
// If you edit this script later, use Deploy -> Manage deployments -> Edit -> New version, or the old code keeps running.

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (!d.name || !d.email || !d.message) return reply({ ok: false, error: 'Missing fields' });

    // 1. Save a row in the sheet
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([new Date(), d.name, d.email, d.message]);

    // 2. Email it to the account that owns this script (your Gmail)
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      replyTo: d.email,
      subject: 'Portfolio message from ' + d.name,
      body: d.message + '\n\n— ' + d.name + ' <' + d.email + '>'
    });

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
