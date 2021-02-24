import { Command, Ctx, Start, Update } from "nestjs-telegraf";
import { ContextMessageUpdate } from 'telegraf';
import { Inject, Logger } from "@nestjs/common";
import { CoreBotService } from './core.bot.service';
import { getMainKeyboard } from '../utils/keyboards';
import asyncWrapper from "../utils/error-handler";
import { RethinkService } from '../../rethink-db/rethink.service';

@Update()
export class CoreBotUpdate {
  private readonly logger = new Logger(CoreBotUpdate.name);
  private rethinkService: RethinkService

  constructor(@Inject('RethinkService') service) {
      this.rethinkService = service;
  }
  
  @Start()
  async start(@Ctx() ctx: ContextMessageUpdate) {
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('start'), ctx, this.logger);
  }

  @Command('sos')
  async command(@Ctx() ctx: ContextMessageUpdate) {
    try {
        const { mainKeyboard } = getMainKeyboard(ctx);
        await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
    } catch(err) {
        this.logger.error('CommandSos: issue with sos command');
        await ctx.reply(`Some internal issue, use "/sos" command to start over`);
    }
  }
}