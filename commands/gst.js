/*CMD
  command: gst
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 💳 Send GST Number 👇

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var gst = message; // User's 10-digit phone number
    var apiUrl = "https://gstlookup.hideme.eu.org/?gstNumber=" + gst;
 // Replace with your actual API endpoint

    HTTP.get({
        url: apiUrl,
        success: "gst2" // Callback command on successful API response
    });

