/**
 * BUILDATHON 2026 — GOOGLE APPS SCRIPT BACKEND
 * 
 * Instructions:
 * 1. Open Google Sheets (sheets.google.com) and create a new spreadsheet named "Buildathon Registrations".
 * 2. In Google Sheets, click Extensions -> Apps Script.
 * 3. Delete any default code in Code.gs and paste this code.
 * 4. Click Save, then click Deploy -> New deployment.
 * 5. Select type: "Web app".
 * 6. Set Description: "Buildathon Backend API".
 * 7. Set Execute as: "Me (your email address)".
 * 8. Set Who has access: "Anyone".
 * 9. Click Deploy, authorize permissions, and copy the Web App URL.
 * 10. Open register.js and members.js in your WEBSITE/js folder and replace SCRIPT_URL with your Web App URL.
 */

// Handle POST request from the registration website
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Set headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Team ID", "Team Name", "Leader Name", "Leader Email", 
        "Leader Phone", "Class / Year", "College / Institution", "Track Selected", 
        "Team Size", "Member 1 Name", "Member 1 Email", "Member 1 Class", "Member 1 College", "Member 1 Phone", "Member 1 Role",
        "Member 2 Name", "Member 2 Email", "Member 2 Class", "Member 2 College", "Member 2 Phone", "Member 2 Role",
        "Member 3 Name", "Member 3 Email", "Member 3 Class", "Member 3 College", "Member 3 Phone", "Member 3 Role",
        "Member 4 Name", "Member 4 Email", "Member 4 Class", "Member 4 College", "Member 4 Phone", "Member 4 Role"
      ]);
      // Format headers
      var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#07070f");
      headerRange.setFontColor("#00f5ff");
      sheet.setFrozenRows(1);
    }

    if (data.action === "registerLeader") {
      // Find if team already exists by looking for Leader Email
      var existingRow = findRowByValue(sheet, data.leaderEmail, 5);
      
      var rowData = [
        data.timestamp,
        data.teamId,
        data.teamName,
        data.leaderName,
        data.leaderEmail,
        data.leaderPhone,
        data.classYear,
        data.college,
        data.track,
        data.teamSize
      ];
      
      if (existingRow > 0) {
        // Update existing row leader details
        var range = sheet.getRange(existingRow, 1, 1, 10);
        range.setValues([rowData]);
      } else {
        // Append new row
        sheet.appendRow(rowData);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Leader registered", teamId: data.teamId }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    else if (data.action === "addMembers") {
      var existingRow = findRowByValue(sheet, data.leaderEmail, 5);
      if (existingRow === -1) {
        // Fallback: search by Team ID in column 2
        existingRow = findRowByValue(sheet, data.teamId, 2);
      }
      
      if (existingRow > 0) {
        var members = data.members;
        // Maximum 4 team members
        for (var i = 0; i < 4; i++) {
          var colStart = 11 + (i * 6); // Column K is 11
          var memberRange = sheet.getRange(existingRow, colStart, 1, 6);
          
          if (i < members.length) {
            var m = members[i];
            memberRange.setValues([[
              m.name || "",
              m.email || "",
              m.cls || "",
              m.college || "",
              m.phone || "",
              m.role || ""
            ]]);
          } else {
            memberRange.clearContent();
          }
        }
        
        // Trigger automated emails
        sendConfirmationEmails(data);
        
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Members added & emails sent" }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Team not found to add members" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    else if (data.action === "queryTeam") {
      var existingRow = findRowByValue(sheet, data.teamId, 2);
      if (existingRow === -1) {
        // Fallback: search by Leader Email in column 5
        existingRow = findRowByValue(sheet, data.teamId, 5);
      }
      
      if (existingRow > 0) {
        var rowRange = sheet.getRange(existingRow, 1, 1, 10);
        var vals = rowRange.getValues()[0];
        
        // Collect team member count
        var memberCount = 1; // leader is 1
        for (var i = 0; i < 4; i++) {
          var colStart = 12 + (i * 6); // Column L is 12
          var mEmail = sheet.getRange(existingRow, colStart).getValue();
          if (mEmail && mEmail.toString().trim() !== "") {
            memberCount++;
          }
        }
        
        var teamInfo = {
          status: "success",
          teamId: vals[1],
          teamName: vals[2],
          leaderName: vals[3],
          track: vals[8],
          memberCount: memberCount
        };
        
        return ContentService.createTextOutput(JSON.stringify(teamInfo))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Team not found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid action" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Find row index where cell value matches query in a specific column index
function findRowByValue(sheet, query, colIndex) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;
  
  var values = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][0].toString().trim().toLowerCase() === query.toString().trim().toLowerCase()) {
      return i + 2; // Rows are 1-indexed, starting from 2
    }
  }
  return -1;
}

// Send automated styling HTML emails to all team members with an embedded QR code
function sendConfirmationEmails(data) {
  var teamId = data.teamId;
  var teamName = data.teamName;
  var leaderName = data.leaderName;
  var leaderEmail = data.leaderEmail;
  var track = data.track;
  var members = data.members;
  
  var subject = "🚀 BUILDATHON 2026: Team Registration Confirmed (" + teamName + ")";
  
  // Generate QR Code using QR Server API
  var qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(teamId);
  var qrBlob;
  try {
    qrBlob = UrlFetchApp.fetch(qrCodeUrl).getBlob().setName("qrcode.png");
  } catch (err) {
    Logger.log("Error fetching QR Code: " + err.message);
  }

  // Base details HTML
  var detailsHtml = 
    "<div style='background-color:#0f0f1a; border: 1px solid #7b2ff7; border-radius:12px; padding:20px; font-family:sans-serif; color:#e8eaf6; max-width: 600px; margin: 0 auto;'>" +
      "<h2 style='color:#00f5ff; font-weight:bold; font-family:sans-serif; margin-top:0;'>BUILDATHON 2026</h2>" +
      "<p style='color:#8b93b8; font-size:14px;'>Hi Team,</p>" +
      "<p style='font-size:15px; line-height:1.6;'>Your registration for <strong>Buildathon 2026</strong> AI Hackathon has been successfully verified! Below are your team registration details:</p>" +
      
      "<table style='width:100%; border-collapse:collapse; margin:20px 0; color:#e8eaf6; font-size:14px;'>" +
        "<tr style='border-bottom:1px solid #222;'><td style='padding:8px 0; color:#8b93b8; font-weight:bold;'>TEAM ID</td><td style='padding:8px 0; color:#00f5ff; font-weight:bold; font-family:monospace;'>" + teamId + "</td></tr>" +
        "<tr style='border-bottom:1px solid #222;'><td style='padding:8px 0; color:#8b93b8;'>Team Name</td><td style='padding:8px 0; font-weight:600;'>" + teamName + "</td></tr>" +
        "<tr style='border-bottom:1px solid #222;'><td style='padding:8px 0; color:#8b93b8;'>Team Leader</td><td style='padding:8px 0;'>" + leaderName + " (" + leaderEmail + ")</td></tr>" +
        "<tr style='border-bottom:1px solid #222;'><td style='padding:8px 0; color:#8b93b8;'>Challenge Track</td><td style='padding:8px 0; color:#ff6b00; font-weight:600;'>" + track + "</td></tr>" +
        "<tr style='border-bottom:1px solid #222;'><td style='padding:8px 0; color:#8b93b8;'>Date &amp; Time</td><td style='padding:8px 0; font-weight:bold;'>August 13, 2026 @ 9:00 AM IST</td></tr>" +
        "<tr><td style='padding:8px 0; color:#8b93b8;'>Hackathon Duration</td><td style='padding:8px 0;'>24 Hours (Non-Stop Coding)</td></tr>" +
      "</table>" +
      
      // Inline QR Code Section
      (qrBlob ? 
        "<div style='text-align:center; background:rgba(255,255,255,0.03); border:1px dashed rgba(0,245,255,0.3); border-radius:8px; padding:20px; margin:20px 0;'>" +
          "<p style='color:#00f5ff; font-size:13px; font-weight:bold; font-family:monospace; margin-top:0; text-transform:uppercase;'>Your Check-in QR Code</p>" +
          "<img src='cid:qrCode' width='160' height='160' style='border:4px solid #fff; border-radius:4px;' alt='Registration QR Code' />" +
          "<p style='color:#8b93b8; font-size:11px; margin-bottom:0; margin-top:8px;'>Scan this code at the registration desk for instant entry.</p>" +
        "</div>" : "") +

      "<h3 style='color:#7b2ff7; font-family:sans-serif; margin-bottom:10px;'>Team Members:</h3>" +
      "<ul style='padding-left:20px; line-height:1.6; font-size:14px;'>";
      
  // Add leader as member #1
  detailsHtml += "<li><strong>Leader:</strong> " + leaderName + " (" + leaderEmail + ")</li>";
  
  // Add other members
  for (var j = 0; j < members.length; j++) {
    detailsHtml += "<li><strong>Member " + (j + 2) + ":</strong> " + members[j].name + " (" + members[j].email + " - " + (members[j].role || "Developer") + ")</li>";
  }
  
  detailsHtml += 
      "</ul>" +
      "<div style='border-top:1px solid #222; margin-top:20px; padding-top:20px; text-align:center; font-size:12px; color:#8b93b8;'>" +
        "<p style='margin:0;'>Please keep your <strong>Team ID (" + teamId + ")</strong> handy for physically checking in at the venue.</p>" +
        "<p style='margin:5px 0 0;'>See you at the hackathon. Hack responsibly, build impactfully!</p>" +
        "<p style='margin:15px 0 0; font-size:10px; color:#4a5580;'>© 2026 Buildathon Organizers. Automated message.</p>" +
      "</div>" +
    "</div>";

  // Mail details payload
  var mailOptions = {
    subject: subject,
    htmlBody: detailsHtml
  };
  
  // Attach inline QR image if successful
  if (qrBlob) {
    mailOptions.inlineImages = {
      qrCode: qrBlob
    };
  }

  // Send to Leader
  try {
    mailOptions.to = leaderEmail;
    MailApp.sendEmail(mailOptions);
  } catch(e) {
    Logger.log("Failed to send email to leader: " + e.message);
  }
  
  // Send to other members
  for (var k = 0; k < members.length; k++) {
    var email = members[k].email;
    if (email && email.trim() !== "") {
      try {
        mailOptions.to = email;
        MailApp.sendEmail(mailOptions);
      } catch(e) {
        Logger.log("Failed to send email to member: " + email + ". Error: " + e.message);
      }
    }
  }
}
