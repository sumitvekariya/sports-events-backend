import { Markup, ContextMessageUpdate } from 'telegraf';
import * as rethinkDB from 'rethinkdb';
// import config from '../../../config/config';
// import { saveToSceneSession } from '../../utils/session';
import { RethinkService } from '../../rethink-db/rethink.service';
import { Logger } from '@nestjs/common';
import { saveToSceneSession } from '../utils/session';
import { InlineKeyboardMarkup } from 'typegram';
/**
 * Returns list of channels
 */
export async function getChannelsListMenu(ctx: ContextMessageUpdate, rethink: RethinkService, logger: Logger): Promise<any> {
    let channels;
    
    if (ctx.scene.state.channels && ctx.scene.state.channels.length >= 1) {
      channels = ctx.scene.state.channels;
    } else {
      channels = await rethink.getDB('channels');
      await saveToSceneSession(ctx, 'channels', channels);
      return Markup.inlineKeyboard(channels.map(channel => [
        { 
          text: `${channel.title}`,
          callback_data: JSON.stringify({ a: 'channelSelect', p: channel.id })
        }
      ]), {});
    }
  }

/**
 * Returns list of channels
 */
export async function getAnswerTypeMenu(ctx: ContextMessageUpdate, rethink: RethinkService, logger: Logger): Promise<any> {
  let groups = [
    {
      "id": 1,
      "title": ctx.i18n.t('scenes.newEvent.replyMeDirect', {
        nick: ctx.from.username
      }),
      "url": '@' + ctx.from.username
    }
  ];
    
  if (ctx.scene.state.groups) {
      groups = ctx.scene.state.groups;
  } else {
      await rethink.getDB('persistData', {telegramId: ctx.from.id})
      .then(result => {
        const resGr = result[0].groups;
        if (resGr) {
          let idCount = 1;
          resGr.reduce((acc, res) => {
            res.id = ++idCount;
            return groups.push(res)
          }, groups);
        }
        saveToSceneSession(ctx, 'groups', groups);
      }).catch(err => {
          this.logger.error('Some error fetching persistData from DB', err);
      });
  }

  return Markup.inlineKeyboard(groups.map(group => [
    { 
      text: `${group.title}`,
      callback_data: JSON.stringify({ a: 'groupSelect', p: group.id })
    }
  ]));
}

/**
 * Returns event reaction buttons
 */
// ToDo: issue with callback data and editing previous text
export async function getTeamReactMenu(messageId: any, count): Promise<any> {
  return Markup.inlineKeyboard(
      [
        {
          text: `➕`,
          callback_data: JSON.stringify({ a: 'editTeamPlus', t: messageId })
        },
        {
          text: `➖`,
          callback_data: JSON.stringify({ a: 'editTeamMinus', t: messageId })
        },
        {
          text: `TTL: ${count}`,
          callback_data: JSON.stringify({ a: 'stop', p: 0 })
        }
      ]
  );
}