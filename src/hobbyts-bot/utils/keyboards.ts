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
  const mainKeyboardAddEvent = ctx.i18n.t('keyboards.main_keyboard.add_event');
  const mainKeyboardEvents = ctx.i18n.t('keyboards.main_keyboard.events');
  // const mainKeyboardFields = ctx.i18n.t('keyboards.main_keyboard.fields');
  const mainKeyboardAbout = ctx.i18n.t('keyboards.main_keyboard.about');
  const mainKeyboardSupport = ctx.i18n.t('keyboards.main_keyboard.support');
  // const mainKeyboardProfile = ctx.i18n.t('keyboards.main_keyboard.profile');
  
  let mainKeyboard: any = Markup.keyboard([
    [mainKeyboardAddEvent, mainKeyboardEvents] as any,
    [mainKeyboardSupport, mainKeyboardAbout]
    // [mainKeyboardFields, mainKeyboardAbout],
    // [mainKeyboardSupport, mainKeyboardProfile]
  ]);

  return {
    mainKeyboard,
    mainKeyboardAddEvent,
    mainKeyboardEvents,
    // mainKeyboardFields,
    mainKeyboardSupport,
    mainKeyboardAbout
    // mainKeyboardProfile
  };
};