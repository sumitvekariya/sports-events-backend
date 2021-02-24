// import { ContextMessageUpdate } from 'telegraf';
// import * as util from 'util';
// import logger from '../../config/winston';

// export function loggerMessage(typeInfo: string = 'info', ContextMessageUpdate: ContextMessageUpdate, msg: string, ...data: any[]) {
//     const formattedMessage = data.length ? util.format(msg, ...data) : msg;

//     if (ContextMessageUpdate && ContextMessageUpdate.from) {
//         return `[${ContextMessageUpdate.from.id}/${ContextMessageUpdate.from.username}]: ${formattedMessage}`;
//     }

//     return logger[typeInfo](`: ${formattedMessage}`);
// }

// export async function getChatWithLink(tg, id) {
//     let chat = await tg.getChat(id);
//     if (!chat.invite_link) {
//         await tg.exportChatInviteLink(id);
//         chat = await tg.getChat(id);
//     }
//     return chat;
// }

// export async function insertText(text, index, insertText, removeChars = 0) {
//     return text.slice(0, index) + '\n' + insertText + text.slice(index + Math.abs(removeChars));
// }