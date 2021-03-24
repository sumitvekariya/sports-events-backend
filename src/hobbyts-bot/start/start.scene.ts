import { Inject, Logger } from '@nestjs/common';
import { Scene, SceneEnter, SceneLeave, Ctx, Action } from 'nestjs-telegraf';
import { ContextMessageUpdate } from 'telegraf';
import { RethinkService } from '../../rethink-db/rethink.service';
import { getMainKeyboard } from '../utils/keyboards';
import { getAccountConfirmKeyboard } from '../utils/helper-keyboards';
import { updateLanguage } from '../utils/language';
import User from 'src/rethink-db/models/user.model';

@Scene('start')
export class StartScene {
    private readonly logger = new Logger(StartScene.name);
    private rethinkService: RethinkService

    constructor(@Inject('RethinkService') service) {
        this.rethinkService = service;
    }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ContextMessageUpdate): Promise<void> {
    const uuid = ctx.from.id;
    let userExist = false;
    let user;
    
    const res = await this.rethinkService.getDB('users', {id: uuid});
    userExist = res.length > 0 ? true : false;
    user = userExist ? res[0] : '';
    
    if (userExist) {
      this.logger.log('Existing user entered');
      
      if (user.nickName !== ctx.from.username) {
        await this.rethinkService.updateDB('users', uuid, {
          nickName: ctx.from.username
        });
      }
      // if (user.firstName === 'I am' || user.firstName === '...') {
      //   if (!ctx.from.first_name) {
      //     await this.rethinkService.updateDB('users', uuid, {
      //       firstName: '...'
      //     });
      //   } else if (user.firstName !== ctx.from.first_name) {
      //     await this.rethinkService.updateDB('users', uuid, {
      //       firstName: ctx.from.first_name
      //     });
      //   }
      // }
      // if (user.lastName === 'Robot' || user.lastName === '...') {
      //   if (!ctx.from.last_name) {
      //     await this.rethinkService.updateDB('users', uuid, {
      //       lastName: '...'
      //     });
      //   } else if (user.lastName !== ctx.from.last_name) {
      //     await this.rethinkService.updateDB('users', uuid, {
      //       lastName: ctx.from.last_name
      //     });
      //   }
      // }
      // const regex = /^NA\d{13}$/gi;
      // if (user && regex.test(user.nickName)) {
      //   await this.rethinkService.updateDB('users', uuid, {
      //     nickName: ctx.from.username
      //   });
      // }
      const { mainKeyboard } = getMainKeyboard(ctx);
      await ctx.reply(ctx.i18n.t('scenes.start.welcome_back'), mainKeyboard);
    } else {
      if (!ctx.from.username) {
        this.logger.log('Enters newEvent scene & notify - no user name');
        ctx.reply(ctx.i18n.t('shared.noUserName'), ctx.scene.leave());
      } else {
        this.logger.log('New user has been created');
        const now = new Date().getTime();
        
        const newUser = new User({
          id: Number(uuid),
          createdAt: now,
          nickName: ctx.from.username,
          firstName: ctx.from.first_name || '',
          lastName: ctx.from.last_name || '',
          lastTelegramActivityAt: now
        });

        await this.rethinkService.saveDB('users', newUser);

        const userData = {
          id: Number(uuid),
          hobbies: [],
          cities: [],
          groups: []
        }
        await this.rethinkService.saveDB('persistData', userData);
        // await ctx.reply('Choose language / Выбери язык', getLanguageKeyboard(ctx));
        // Use later logic inside chooseLang Action
        const accountConfirmKeyboard = getAccountConfirmKeyboard(ctx);
        await ctx.reply(ctx.i18n.t('scenes.start.new_account', {
            nickName: newUser.nickName
        }));
        await ctx.reply(ctx.i18n.t('scenes.start.bot_description'), accountConfirmKeyboard);
      }
    }
  }

  @SceneLeave()
  async onSceneLeave(ctx: ContextMessageUpdate) {
    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
  }

  // @Command(['rng', 'random'])
  // onRandomCommand(): number {
  //   console.log('Use "random" command');
  //   return Math.floor(Math.random() * 11);
  // }

  @Action(/languageChange/)
  async onChangeLangCommand(ctx: ContextMessageUpdate): Promise<void> {
    const langData = JSON.parse((ctx.callbackQuery as any).data);

    await updateLanguage(ctx, langData.p);

    const accountConfirmKeyboard = getAccountConfirmKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.start.bot_description'), accountConfirmKeyboard);
    await ctx.answerCbQuery();
  }

  @Action(/confirmAccount/)
  async onLeaveCommand(ctx: ContextMessageUpdate): Promise<void> {
    await ctx.answerCbQuery();
    await ctx.scene.leave();
  }

  // @On('callback_query')
  // async on(@Ctx() ctx: ContextMessageUpdate) {
  //   ctx.i18n.locale('ua');
  // }
}