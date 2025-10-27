/*CMD
  command: adresponse
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

// Safe JSON check
function isJsonString(str) {
  try {
    if (typeof str !== "string") return false;
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// Safely stringify objects (handles circular refs)
function safeStringify(obj, maxLen = 20000) {
  const seen = new WeakSet();
  try {
    const s = JSON.stringify(obj, function (key, value) {
      if (value && typeof value === "object") {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      return value;
    }, 2);
    return s.length > maxLen ? s.substring(0, maxLen) + "\n...[truncated]" : s;
  } catch (e) {
    try {
      return String(obj);
    } catch (ee) {
      return "[unstringifiable]";
    }
  }
}

// Shorten very long string fields inside objects to avoid huge messages
function shallowTruncate(obj, maxFieldLen = 1000) {
  if (!obj || typeof obj !== "object") return obj;
  const out = Array.isArray(obj) ? [] : {};
  for (const k in obj) {
    try {
      const v = obj[k];
      if (typeof v === "string" && v.length > maxFieldLen) {
        out[k] = v.slice(0, maxFieldLen) + "...[truncated]";
      } else {
        out[k] = v;
      }
    } catch (e) {
      out[k] = "[error reading field]";
    }
  }
  return out;
}

// Robust debug helper: tries Api.sendMessage, falls back to console.log
function sendDebug(maybeChat, maybeRequest, obj) {
  const safeText = safeStringify(shallowTruncate(obj));
  // Try to extract chat_id and reply id from provided objects (many environments differ)
  const chatId =
    (maybeChat && (maybeChat.chatid || maybeChat.id || maybeChat.chat_id)) ||
    (maybeRequest && (maybeRequest.chatid || maybeRequest.chat_id || maybeRequest.chatId)) ||
    null;
  const replyTo =
    (maybeRequest && (maybeRequest.message_id || maybeRequest.messageId || maybeRequest.id)) ||
    (maybeChat && maybeChat.message_id) ||
    null;

  // If Api isn't available, log to console
  if (typeof Api === "undefined" || typeof Api.sendMessage !== "function") {
    // Console fallback (useful in many worker/Flask/node environments)
    try {
      console.log("DEBUG ->", safeText);
      return;
    } catch (e) {
      // swallow
      return;
    }
  }

  // Attempt to send via Api; be defensive about exceptions
  try {
    const payload = {
      chat_id: chatId || undefined,
      text: safeText,
      reply_to_message_id: replyTo || undefined
    };
    // Some environments require exact keys — remove undefined keys
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    Api.sendMessage(payload);
  } catch (e) {
    // last-resort console log
    try {
      console.log("DEBUG SEND FAILED:", e && e.message ? e.message : e, safeText);
    } catch (ee) {
      // ignore
    }
  }
}

// Main flow (robust)
try {
  // `content` should be provided by the environment (upstream API response)
  if (typeof content === "undefined" || content === null || content === "") {
    sendDebug(chat || {}, request || {}, {
      status: "error",
      reason: "missing_content",
      note: "The variable `content` is empty or undefined. Check your request to the upstream API."
    });
    return;
  }

  // If content is already an object (parsed earlier by environment), use it directly
  var parsed;
  if (typeof content === "object" && content !== null) {
    parsed = content;
  } else if (!isJsonString(content)) {
    // content exists but is not valid JSON — include a trimmed sample for debugging
    var sample = ("" + content).substring(0, 1000); // first 1000 chars
    sendDebug(chat || {}, request || {}, {
      status: "error",
      reason: "invalid_json",
      note: "Upstream API returned non-JSON or invalid JSON.",
      sample: sample
    });
    return;
  } else {
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      sendDebug(chat || {}, request || {}, {
        status: "error",
        reason: "json_parse_error",
        message: e && e.message ? e.message : String(e)
      });
      return;
    }
  }

  // Normalize parsed.data to an array (support single-object responses)
  var dataArr = [];
  if (parsed && parsed.data !== undefined && parsed.data !== null) {
    if (Array.isArray(parsed.data)) {
      dataArr = parsed.data;
    } else if (typeof parsed.data === "object") {
      dataArr = [parsed.data];
    } else {
      dataArr = [];
    }
  }

  // If upstream returned an error structure or no usable data, show it for debugging
  if (!parsed || parsed.status !== "success" || dataArr.length === 0) {
    sendDebug(chat || {}, request || {}, {
      status: "error",
      reason: "no_valid_data",
      parsed: shallowTruncate(parsed || {}),
      note: "Either parsed.status !== 'success' or parsed.data is empty/missing."
    });
    return;
  }

  // Build clean JSON response for valid data
  var response = {
    status: "success",
    response_time_ms: parsed.response_time_ms || null,
    made_by: parsed.Made_by || parsed.made_by || null,
    count: dataArr.length,
    results: []
  };

  for (var i = 0; i < dataArr.length; i++) {
    var d = dataArr[i] || {};
    response.results.push({
      name: d.name || d.fullname || null,
      father_name: d.fname || d.father || null,
      mobile: d.mobile || d.phone || null,
      alt: d.alt || null,
      circle: d.circle || null,
      address: d.address || null,
      id: d.id || d.uid || null,
      raw: shallowTruncate(d) // keep a truncated raw entry for completeness
    });
  }

  // Send as plain JSON (no Markdown) — be defensive about Api availability
  if (typeof Api !== "undefined" && typeof Api.sendMessage === "function") {
    try {
      Api.sendMessage({
        chat_id: (chat && (chat.chatid || chat.id || chat.chat_id)) || undefined,
        text: safeStringify(response),
        reply_to_message_id: (request && (request.message_id || request.messageId)) || undefined
      });
    } catch (e) {
      sendDebug(chat || {}, request || {}, {
        status: "error",
        reason: "send_failed",
        message: e && e.message ? e.message : String(e),
        response_sample: response
      });
    }
  } else {
    // fallback console.log so you still see output in logs
    console.log("Would send message:", safeStringify(response));
  }
} catch (err) {
  // unexpected error — send error and stack for debugging (truncate if too long)
  var errObj = {
    status: "error",
    reason: "exception",
    message: err && err.message ? err.message : String(err),
    stack: (err && err.stack ? err.stack.split("\n").slice(0, 6) : [])
  };
  sendDebug(chat || {}, request || {}, errObj);
}
