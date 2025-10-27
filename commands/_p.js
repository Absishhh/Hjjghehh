/*CMD
  command: /p
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

const { message_id } = options?.result;

if (message_id) {
Api.pinChatMessage({
  chat_id: chat.chatid,
  message_id: message_id,
  disable_notification: false
});
}
