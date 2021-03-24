import { Ctx, Hears, Scene, Update, SceneEnter, SceneLeave, On, Action } from 'nestjs-telegraf';
import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import { Inject, Logger } from '@nestjs/common';
import { RethinkService } from '../../rethink-db/rethink.service';
import { getBackKeyboard, getMainKeyboard } from '../utils/keyboards';
import { getAnswerTypeMenu, getChannelsListMenu, getTeamReactMenu } from './add-event.helpers';

@Scene('newEvent')
export class NewEventScene {
    private readonly logger = new Logger(NewEventScene.name);
    private rethinkService: RethinkService

    constructor(@Inject('RethinkService') service) {
        this.rethinkService = service;
    }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ContextMessageUpdate): Promise<void> {
    if (!ctx.from.username) {
        this.logger.log('Enters newEvent scene & notify - no user name');
        ctx.reply(ctx.i18n.t('shared.noUserName'), ctx.scene.leave());
      } else {
        this.logger.log('Enters newEvent scene');
        const { backKeyboard } = getBackKeyboard(ctx);
        if (ctx.scene.state.channelNum >= 0) {
          await ctx.reply(ctx.i18n.t('scenes.newEvent.inputPost'), backKeyboard);
        } else {
          await ctx.reply('---------------------', backKeyboard);
          await ctx.reply(ctx.i18n.t('scenes.newEvent.channelsList'),  await getChannelsListMenu(ctx, this.rethinkService, this.logger));
        }
      }
  }

  @SceneLeave()
  async onSceneLeave(ctx: ContextMessageUpdate) {
    this.logger.log('Leaves newEvent scene');
    const { mainKeyboard } = getMainKeyboard(ctx);
    // deleteFromSession(ctx, 'events');
    await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
  }

  @Hears(match('keyboards.shared_keyboard.home'))
  async hearsGoHome(ctx: ContextMessageUpdate) {
    await ctx.scene.leave();
  }

  // @Command(['rng', 'random'])
  // onRandomCommand(): number {
  //   console.log('Use "random" command');
  //   return Math.floor(Math.random() * 11);
  // }

  @Action(/channelSelect/)
  async onChannelSelect(ctx: ContextMessageUpdate): Promise<void> {
    const action = JSON.parse((ctx.callbackQuery as any).data);
    ctx.scene.state.channelNum = ctx.scene.state.channels.findIndex(item => {
        return item.id === action.p;
    });
    await ctx.reply(ctx.i18n.t('scenes.newEvent.answerList'),  await getAnswerTypeMenu(ctx, this.rethinkService, this.logger));
  }

  @Action(/groupSelect/)
  async onGroupSelect(ctx: ContextMessageUpdate): Promise<void> {
    const action = JSON.parse((ctx.callbackQuery as any).data);
    ctx.scene.state.groupNum = ctx.scene.state.groups.findIndex(item => {
        return item.id === action.p;
    });
    await ctx.scene.enter('newEvent', ctx.scene.state);
  }

  @On('text')
  async onText(@Ctx() ctx: ContextMessageUpdate) {
    const channel = ctx.scene.state.channels[ctx.scene.state.channelNum];
    const group = ctx.scene.state.groups[ctx.scene.state.groupNum];
    const sendText = (group.url || group.link);
    const messageId = await this.rethinkService.generateUID();

    const repl = ctx.telegram.sendMessage(channel.id, ctx.i18n.t('scenes.newEvent.postText', {
        text: (ctx.message as any).text,
        link: sendText
    }), await getTeamReactMenu(messageId, 0));
    // Save to DB whole text for team changes (line index for add and delete). Think for future team composition 
    repl.then(res => {
        this.rethinkService.saveDB('postMessages', {
            id: messageId,
            text: res.text,
            chatId: res.chat.id,
            messageId: res.message_id,
            reply_markup: res.reply_markup
        });
    });

    ctx.reply(ctx.i18n.t('scenes.newEvent.afterPostNotify', {
        title: channel.title,
        link: channel.username ? `https://t.me/${channel.username}` : channel.invite_link
    }), ctx.scene.leave());
  }
}