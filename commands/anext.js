/*CMD
  command: anext
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// anext - robust handler with HEX-decoding fallback
// It will attempt:
// 1) normal JSON parsing
// 2) extract JSON from HTML wrappers
// 3) find a long hex literal and decode it to text, then parse
// 4) small heuristics for other JS-embedded encodings
// 5) send helpful preview if nothing works

function stripBOM(s) {
  if (!s || typeof s !== "string") return s;
  if (s.charCodeAt(0) === 0xFEFF) return s.slice(1);
  return s.replace(/^\uFEFF|\u200B/g, "");
}

function isJsonString(str) {
  try { JSON.parse(str); return true; } catch (e) { return false; }
}

function replaceNulls(obj) {
  if (obj === null) return "NA";
  if (Array.isArray(obj)) return obj.map(replaceNulls);
  if (typeof obj === "object") {
    var out = {};
    for (var k in obj) {
      if (!obj.hasOwnProperty(k)) continue;
      out[k] = replaceNulls(obj[k]);
    }
    return out;
  }
  return obj;
}

// decode hex string (supports both even-length hex and optional 0x prefix)
function hexToUtf8(hex) {
  try {
    hex = hex.replace(/0x/ig, "").replace(/\s+/g, "");
    if (hex.length % 2 !== 0) {
      // odd length -> maybe missing leading zero; try to pad
      hex = "0" + hex;
    }
    var bytes = [];
    for (var i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    // convert bytes to UTF-8 string
    var str = "";
    for (var j = 0; j < bytes.length; j++) {
      str += String.fromCharCode(bytes[j]);
    }
    try {
      // handle UTF-8 multi-byte sequences
      return decodeURIComponent(escape(str));
    } catch (e) {
      return str;
    }
  } catch (err) {
    return null;
  }
}

// try to extract candidate JSON from raw string (previous strategies)
function getCandidateJson(raw) {
  if (!raw || typeof raw !== "string") return null;
  raw = stripBOM(raw).trim();

  // direct JSON
  if ((raw[0] === "{" && raw[raw.length - 1] === "}") || (raw[0] === "[" && raw[raw.length - 1] === "]")) {
    return raw;
  }

  // wrapped in <pre> or <textarea>
  var pre = raw.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (pre && pre[1]) return pre[1].trim();
  var ta = raw.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/i);
  if (ta && ta[1]) return ta[1].trim();

  // find by common keys
  var keys = ['"rc_number"', '"owner_name"', '"aadhar"', '"owner"', '"name"'];
  for (var k = 0; k < keys.length; k++) {
    var idx = raw.indexOf(keys[k]);
    if (idx !== -1) {
      // find nearest { before idx and matching }
      var start = raw.lastIndexOf("{", idx);
      if (start !== -1) {
        var depth = 0;
        for (var i = start; i < raw.length; i++) {
          var ch = raw[i];
          if (ch === "{") depth++;
          else if (ch === "}") {
            depth--;
            if (depth === 0) {
              return raw.substring(start, i + 1).trim();
            }
          }
        }
      }
    }
  }

  // fallback first { ... } block
  var first = raw.indexOf("{");
  var last = raw.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return raw.substring(first, last + 1).trim();
  }
  return null;
}

// Try to find large hex-like literal in text and decode
function findAndDecodeHex(raw) {
  if (!raw || typeof raw !== "string") return null;
  // look for quoted hex strings of length >= 40 (adjust threshold if needed)
  var hexMatch = raw.match(/['"]([0-9a-fA-F]{40,})['"]/);
  if (hexMatch && hexMatch[1]) {
    var decoded = hexToUtf8(hexMatch[1]);
    if (decoded && decoded.length > 0) return decoded;
  }
  // sometimes hex is assigned without quotes: var s=abcdef0123...
  var bareHex = raw.match(/(?:=\s*|:\s*)([0-9a-fA-F]{80,})/);
  if (bareHex && bareHex[1]) {
    var dec2 = hexToUtf8(bareHex[1]);
    if (dec2 && dec2.length > 0) return dec2;
  }
  // sometimes hex appears inside JS functions like toHex(...) or inside a variable named data
  // look for long runs of hex anywhere
  var longHex = raw.match(/([0-9a-fA-F]{60,})/);
  if (longHex && longHex[1]) {
    var dec3 = hexToUtf8(longHex[1]);
    if (dec3 && dec3.length > 0) return dec3;
  }
  return null;
}

// Try other simple JS-decoding heuristics
function trySimpleJsUnescape(raw) {
  if (!raw || typeof raw !== "string") return null;
  // look for escape sequences like "%7B%22key%22%3A..." (URL-encoded JSON)
  var urlEncoded = raw.match(/(%7B%22[\s\S]{20,})/i);
  if (urlEncoded && urlEncoded[1]) {
    try {
      var dec = decodeURIComponent(urlEncoded[1]);
      return dec;
    } catch (e) {
      // ignore
    }
  }
  // look for sequences like "\x7b\x22..." (hex escapes)
  var hexEsc = raw.match(/((?:\\x[0-9a-fA-F]{2}){10,})/);
  if (hexEsc && hexEsc[1]) {
    var seq = hexEsc[1].replace(/\\x/g, "");
    var dec = hexToUtf8(seq);
    if (dec) return dec;
  }
  return null;
}

// ---------- Begin main flow ----------

// quick guard for server-side "Internal Error" or empty responses
if (!content || (String(content).indexOf("Internal Error") !== -1 && String(content).length < 500)) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "⚠️ API returned an internal error or empty response. Try again later or use the private bot.",
    reply_to_message_id: request.message_id
  });
  return;
}

var raw = String(content || "");
var candidate = getCandidateJson(raw);
var parsed = null;

// If direct candidate found and is valid JSON parse
if (candidate && isJsonString(candidate)) {
  try { parsed = JSON.parse(candidate); } catch (e) { parsed = null; }
}

// If not parsed yet, try hex decoding
if (!parsed) {
  var decodedFromHex = findAndDecodeHex(raw);
  if (decodedFromHex) {
    // maybe decoded text contains JSON or further wrappers - try to extract JSON
    var c2 = getCandidateJson(decodedFromHex) || decodedFromHex.trim();
    if (isJsonString(c2)) {
      try { parsed = JSON.parse(c2); } catch (e) { parsed = null; }
    } else {
      // sometimes decodedFromHex is already a JSON-like string but with single quotes - try to replace
      var alt = c2.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":'); // best-effort attempt (risky)
      if (isJsonString(alt)) {
        try { parsed = JSON.parse(alt); } catch (e) { parsed = null; }
      }
    }
  }
}

// If still not parsed, try other JS unescape heuristics
if (!parsed) {
  var tryUn = trySimpleJsUnescape(raw);
  if (tryUn) {
    var cand3 = getCandidateJson(tryUn) || tryUn.trim();
    if (isJsonString(cand3)) {
      try { parsed = JSON.parse(cand3); } catch (e) { parsed = null; }
    }
  }
}

// If still no parsed object, provide helpful preview so you can paste it here
if (!parsed) {
  // include a short preview from the response to help debugging
  var preview = raw.replace(/\s+/g, " ").trim().slice(0, 700);
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "⚠️ Could not parse API response into JSON. Here's a preview (paste this here if you want me to inspect):\n\n" + "```" + preview + (preview.length >= 700 ? "... (truncated)" : "") + "```",
    parse_mode: "Markdown",
    reply_to_message_id: request.message_id
  });
  return;
}

// parsed is an object now; handle null or non-object
if (parsed === null || typeof parsed !== "object") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "ℹ️ No data found for this Aadhar (API returned null).",
    reply_to_message_id: request.message_id
  });
  return;
}

// Optional: change only api owner username field (uncomment if required)
// parsed.owner = "@frappeash";

// Replace nulls with "NA" for clean output
parsed = replaceNulls(parsed);

// Deduct 1 credit (only now)
var credits = Libs.ResourcesLib.userRes("credits");
if (credits.value() < 1) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "❌ You don't have enough credits to perform this lookup.",
    reply_to_message_id: request.message_id
  });
  return;
}
credits.add(-1);

// Send JSON + credits + buttons
var prettyJson = JSON.stringify(parsed, null, 2);
var msg = "```json\n" + prettyJson + "\n```\n\n📊 Your remaining credits: " + credits.value() + "/1000";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "Markdown",
  reply_to_message_id: request.message_id,
  reply_markup: {
    inline_keyboard: [
      [{ text: "🤫 Use Privately", url: "https://t.me/JackXsparrowbot" }],
      [{ text: "➕️ Add me to Your Group/Channel", url: "https://t.me/JackXsparrowbot?startgroup=true" }]
    ]
  }
});
