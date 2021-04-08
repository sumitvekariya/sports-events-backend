import { ContextMessageUpdate } from 'telegraf';
import { getTeamReactMenu } from './add-event.helpers';
import { insertText } from '../utils/other';
import { RethinkService } from '../../rethink-db/rethink.service';

export const teamEditAction = async (ctx: ContextMessageUpdate, adding: boolean, rethink: RethinkService) => {
    let count = 0;
    let newText;
    let idArray = [];
    const messageData = JSON.parse((ctx.callbackQuery as any).data);
    rethink.getDB('postMessages', { telegramId: messageData.t }).then(async res => {
        let text = res[0].text;
        const index = text.indexOf('.\nУсі деталі сюди');
        let repl;
        idArray = res[0].idArray ? res[0].idArray : idArray;
        const idIndex = idArray.indexOf(ctx.from.id);
        if (adding) {
            if (idIndex > -1) {
                var countSame = {};
                idArray.forEach(function(x) { countSame[x] = (countSame[x] || 0)+1; });
                if (countSame[ctx.from.id] > 10) {
                    return;
                }
            }
            count = res[0].count ? ++res[0].count : 1;
            idArray.push(ctx.from.id);
            newText = await insertText(text, index, `<a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name ? ctx.from.first_name : 'N/A'}${ctx.from.last_name ? (' ' + ctx.from.last_name) : ''}${idIndex === -1 ? '' : '+1'}</a>`)
            const inlineKeyboard = await getTeamReactMenu(messageData.t, count);

            repl = ctx.editMessageText(
                newText,
                {
                    parse_mode: 'HTML',
                    ...inlineKeyboard
                }
            );
        } else {
            if (idIndex > -1) {
                idArray.splice(idIndex, 1);
            } else {
                return;
            }
            count = --res[0].count;
            const textId = text.lastIndexOf(ctx.from.id);
            newText = `${text.slice(0, textId - 23)}${text.slice((textId + 4 + (text.slice(textId)).indexOf('</a>')))}`;
            const inlineKeyboard = await getTeamReactMenu(messageData.t, count);

            repl = ctx.editMessageText(
                newText,
                {
                    parse_mode: 'HTML',
                    ...inlineKeyboard
                }
            );
        }
        repl.then((res: any) => {
            rethink.updateDB('postMessages', messageData.t, {
              id: messageData.t,
              count: count,
              idArray: idArray,
              text: newText,
              chatId: res.chat.id,
              messageId: res.message_id
            });
        });
    });
};