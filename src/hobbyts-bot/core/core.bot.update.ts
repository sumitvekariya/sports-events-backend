import { Action, Command, Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { ContextMessageUpdate } from 'telegraf';
import { Inject, Logger } from "@nestjs/common";
import { getMainKeyboard } from '../utils/keyboards';
import asyncWrapper from "../utils/error-handler";
import { RethinkService } from '../../rethink-db/rethink.service';
import { match } from 'telegraf-i18n';
import { teamEditAction } from '../events/add-event.action';
import { ConfigService } from '@nestjs/config';
import { getChatWithLink } from '../utils/other';

@Update()
export class CoreBotUpdate {
  private updateMap = new Map();
  private logger = new Logger(CoreBotUpdate.name);
  private rethinkService: RethinkService;

  constructor(@Inject('RethinkService') service, private config: ConfigService) {
      this.rethinkService = service;
  }

  // @Use()
  // useScenes(ctx, next) {
  //   // Create scene manager
  //   const stage = new Scenes.Stage();
  //   // Scene registration
  //   stage.register('start');
  //   stage.middleware(ctx);
  //   next();
  // }
  
  @Start()
  async start(@Ctx() ctx: ContextMessageUpdate) {
    (ctx.session as any).__language_code = 'ua';
    ctx.i18n.locale('ua');
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('start'), ctx, this.logger);
  }

  @Command('sos')
  async command(@Ctx() ctx: ContextMessageUpdate) {
    try {
        const { mainKeyboard } = getMainKeyboard(ctx);
        await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
    } catch(err) {
        this.logger.error('CommandSos: issue with sos command');
        await ctx.reply(`Some internal issue, use "/sos" command to start over or contact @hobbyts911`);
    }
  }

  @Hears(match('keyboards.main_keyboard.add_event'))
  async hearsAddEvent(@Ctx() ctx: ContextMessageUpdate) {
    this.updateUserTimestamp(ctx);
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('newEvent'), ctx, this.logger);
  };

  @Hears(match('keyboards.main_keyboard.events'))
  async hearsAllEvents(@Ctx() ctx: ContextMessageUpdate) {
    this.logger.log('Opens events section');
    await ctx.reply(ctx.i18n.t('scenes.events.link'), {
      disable_web_page_preview: true
    } as any);
  };

  @Hears(match('keyboards.main_keyboard.about'))
  async hearsAbout(@Ctx() ctx: ContextMessageUpdate) {
    this.logger.log('Opens about section');
    await ctx.reply(ctx.i18n.t('scenes.about.main'), {
      disable_web_page_preview: true
    } as any);
  }

  @Hears(match('keyboards.main_keyboard.support'))
  async hearsSupport(@Ctx() ctx: ContextMessageUpdate) {
    this.logger.log('Opens support section');
    await ctx.reply(ctx.i18n.t('scenes.support.main'), {
      disable_web_page_preview: true
    } as any);
  }

  @Action(/editTeamPlus/)
  async plusMember(@Ctx() ctx: ContextMessageUpdate) {
    await teamEditAction(ctx, true, this.rethinkService)
  }

  @Action(/editTeamMinus/)
  async minusMember(@Ctx() ctx: ContextMessageUpdate) {
    await teamEditAction(ctx, false, this.rethinkService)
  }

  @On('text')
  async onText(@Ctx() ctx: ContextMessageUpdate) {
    // ToDo: change if logic to allow other add its own groups and channels
    const admin = this.config.get<number>('myId');
    if ((ctx.message as any).forward_from_chat && (ctx.from.id === admin)) {
      let chat = (ctx.message as any).forward_from_chat;
      const channels = await this.rethinkService.getDB('channels');
      
      for (let i = 0; i < channels.length; i++) {
        if (channels[i].id === chat.id) {
          i = channels.length;
          chat = null;
        }
      }
      if (chat === null) {
        return ctx.reply('this channel exists');
      }
      if (!chat.username) {
        chat = await getChatWithLink((ctx.message as any).forward_from_chat.id, ctx.telegram);
      }
      delete chat.description;
      
      await this.rethinkService.saveDB('channels', chat);
      ctx.reply('channels list updated');
    }
  }

  // Implement Exception filter
  // @Catch()
  // catchGlobalError(error) {
  //   this.logger.error('Global error has happened, %O', error);
  // }

  // @On('callback_query')
  // async on(@Ctx() ctx: ContextMessageUpdate) {
  //   ctx.i18n.locale('ua');
  // }

  private updateUserTimestamp = async (ctx: ContextMessageUpdate) => {
    const uuid = ctx.from.id;
    const time = Number(new Date());
    if (this.updateMap.size > 10000) {
      this.updateMap.clear();
    }
    if (!this.updateMap.get(uuid)) {
      this.updateMap.set(uuid, time);
    }
    if ((time - this.updateMap.get(uuid)) > 60000) {
      this.rethinkService.updateDB('users', uuid, {
        lastTelegramActivityAt: time
      }).then(() => {
        this.updateMap.delete(uuid);
      }).catch(err => this.logger.error('Update user timestamp error', err));
    }
  };
}