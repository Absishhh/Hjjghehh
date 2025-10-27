/*CMD
  command: buy
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

Api.editMessageMedia({
  chat_id: request.message.chat.id,
  message_id: request.message.message_id,
  media: {
    type: "photo",
    media: "https://ibb.co/84ckC89p",
    caption: "• 10₹ = 3 Days Access\n• 20₹ = 7 Days Access\n• 50₹ = 15 Days Access\n• 90₹ = 1 Month Access\n\n👆 Pay on the given QR and then press Submit UTR Number 👇\n\n_⚠ Warning: Fake payment can lead to permanent ban. _",
    parse_mode: "Markdown"
  },
  reply_markup: {
    inline_keyboard: [[{ text: "📝 Submit UTR", callback_data: "utr" }],
      [{ text: "🔙 Back", callback_data: "menu2" }]
    ]
  }
});

