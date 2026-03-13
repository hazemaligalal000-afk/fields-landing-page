/**
 * META CONVERSION API (CAPI) - GOOGLE APPS SCRIPT BRIDGE
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Paste this code.
 * 4. Replace ACCESS_TOKEN and PIXEL_ID.
 * 5. Deploy > New Deployment > Web App (Set "Who has access" to "Anyone").
 * 6. Copy the URL and update your SCRIPT_URL in script.js.
 */

const ACCESS_TOKEN = 'EAAib1p8XrGkBQ7qDsMNGJZBOLqq26lRt3mSHXCXZCIJ3j1HuRbjZCaLEbOcR1oVLmVNXJmmoGUP9ERAJy7LRZCFlcOp78u4TczHKYVfEKsigpJgC8fkULZBBvB1qiICh0sq0fNKZAlbMRgWVQQgdOCwULc3usjECgU96S7v6plnkMmp6bBWEbUiNZCZB9r7gfAZDZD'; // ✅ CONFIGURED
const PIXEL_ID = '947262467653801'; // ✅ CONFIGURED

function doGet(e) {
  const p = e.parameter;
  
  // 1. Log to Google Sheet for your records
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    new Date(), 
    p.name, 
    p.phone, 
    p.city, 
    p.address, 
    p.offer, 
    p.event_id, 
    p.fbp, 
    p.fbc
  ]);

  // 2. Prepare Facebook CAPI Payload
  const eventName = p.event_name || "Purchase";
  const payload = {
    "data": [
      {
        "event_name": eventName,
        "event_time": Math.floor(Date.now() / 1000),
        "action_source": "website",
        "event_id": p.event_id,
        "event_source_url": p.source_url || "https://yourdomain.com", 
        "user_data": {
          "ph": [hashSensitiveData(p.phone_normalized)],
          "fn": [hashSensitiveData(p.name.split(' ')[0].toLowerCase().trim())],
          "ct": [hashSensitiveData(p.city.toLowerCase().trim())],
          "country": [hashSensitiveData("jo")],
          "fbp": p.fbp,
          "fbc": p.fbc,
          "client_user_agent": p.user_agent,
          "client_ip_address": p.ip // Optional: If you pass IP from JS
        },
        "custom_data": {
          "currency": "JOD",
          "value": p.offer.includes('40') ? 40 : 25,
          "content_name": p.offer,
          "content_ids": ["set_1"],
          "content_type": "product"
        }
      }
    ]
  };

  // 3. Send to Meta Conversions API
  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  try {
    UrlFetchApp.fetch("https://graph.facebook.com/v18.0/" + PIXEL_ID + "/events?access_token=" + ACCESS_TOKEN, options);
  } catch (err) {
    console.error("CAPI Error: " + err);
  }

  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

/**
 * SHA-256 Hashing for PII (Meta Requirement)
 */
function hashSensitiveData(data) {
  if (!data) return null;
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, data);
  return digest.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}
