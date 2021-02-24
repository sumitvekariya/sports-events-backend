import { Ctx, Hears, Update } from "nestjs-telegraf";
import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';

@Update()
export class EventsBotUpdate {
    @Hears(match('keyboards.main_keyboard.events'))
    async hears(@Ctx() ctx: ContextMessageUpdate) {
        // try {
        //     await ctx.reply('Hey there translate');
        // } catch(err) {
        //     this.logger.error('HearsEvents: issue with events button');
        //     await ctx.reply(`Some internal issue, use "/sos" command to start over`);
        // }
    }
}