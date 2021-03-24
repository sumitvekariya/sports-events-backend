import { ContextMessageUpdate, Markup } from 'telegraf';
// import * as Extra from 'telegraf/extra';
// const markup = extra.markdown()

/*
 * Returns language keyboard
 */
export function getLanguageKeyboard(ctx: ContextMessageUpdate): unknown {
  const keyboard = Markup.inlineKeyboard([
    {
      text: `English`,
      callback_data: JSON.stringify({ a: 'languageChange', p: 'en' })
    },
    {
      text: `Українська`,
      callback_data: JSON.stringify({ a: 'languageChange', p: 'ua' })
    }
  ]);
  return keyboard;
}

/**
 * Returns button that user has to click to start working with the bot
 */
export function getAccountConfirmKeyboard(ctx: ContextMessageUpdate): unknown {
  const keyboard = Markup.inlineKeyboard([
    {
      text: ctx.i18n.t('scenes.start.lets_go'),
      callback_data: JSON.stringify({ a: 'confirmAccount' })
    }
  ]);
  return keyboard;
}