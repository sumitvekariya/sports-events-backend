import { Injectable, Logger } from "@nestjs/common";
import { ContextMessageUpdate } from 'telegraf';

@Injectable()
export class CoreBotService {

    constructor() {}

    async tryAndLog(func: Function ,ctx: ContextMessageUpdate, logger: Logger, targetText: string) {
        try {
            func();
        } catch(err) {
            logger.error('Catched error');
            await ctx.reply(`${err} in ${targetText}, use "/sos" command`);
        }
    }
}