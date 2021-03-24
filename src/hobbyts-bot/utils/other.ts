import { Telegraf } from 'telegraf';

export async function getChatWithLink(id, tg) {
    let chat = await tg.getChat(id);
    if (!chat.invite_link) {
        await tg.exportChatInviteLink(id);
        chat = await tg.getChat(id);
    }
    return chat;
}

export async function insertText(text, index, insertText, removeChars = 0) {
    return text.slice(0, index) + '\n' + insertText + text.slice(index + Math.abs(removeChars));
}