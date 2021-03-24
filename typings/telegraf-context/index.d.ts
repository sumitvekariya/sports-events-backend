import { I18n } from 'telegraf-i18n';
import { Context } from 'telegraf';

declare module 'telegraf' {
  interface ContextMessageUpdate extends Context {
    i18n: I18n;
    scene: any;
    session: any;
    // session: {
    //   // fields: [];
    //   // settingsScene: {
    //   //   messagesToDelete: any[];
    //   // };
    //   // language: 'ua' | 'en' | 'ru';
    // };
    // field: any;
    // webhookReply: boolean;
  }
}