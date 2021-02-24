import { ContextMessageUpdate, Markup } from 'telegraf';

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getBackKeyboard = (ctx: ContextMessageUpdate) => {
  const backKeyboardBack = ctx.i18n.t('keyboards.shared_keyboard.home');
  // const backKeyboardAddField = ctx.i18n.t('scenes.fields.add_field_button');
  // let backKeyboard: any = Markup.keyboard([
  //   [backKeyboardBack, backKeyboardAddField]
  // ]);
  let backKeyboard: any = Markup.keyboard([
    [backKeyboardBack]
  ]);

  backKeyboard = backKeyboard.resize().extra();

  return {
    backKeyboard,
    backKeyboardBack,
    // backKeyboardAddField
  };
};

/**
 * Returns main keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getMainKeyboard = (ctx: ContextMessageUpdate) => {
  const mainKeyboardEvents = ctx.i18n.t('keyboards.main_keyboard.events');
  
  let mainKeyboard: any = Markup.keyboard([
    [mainKeyboardEvents]
  ]);
  mainKeyboard = mainKeyboard.resize();

  return {
    mainKeyboard,
    mainKeyboardEvents
  };
};