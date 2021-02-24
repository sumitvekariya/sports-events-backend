// import { ContextMessageUpdate } from 'telegraf';
// import logger from '../../config/winston';
// import { saveToSceneSession } from './session';
// import { loggerMessage } from './other';

// /**
//  * Function that updates language for the current user in all known places
//  * @param ContextMessageUpdate - telegram context
//  * @param newLang - new language
//  */
// export async function updateLanguage(ContextMessageUpdate: ContextMessageUpdate, newLang: 'en' | 'ru') {
//   loggerMessage('error', ContextMessageUpdate, 'Updating language for user to %s', newLang);
// //   await User.findOneAndUpdate(
// //     { _id: ContextMessageUpdate.from.id },
// //     {
// //       language: newLang
// //     },
// //     { new: true }
// //   );

//   saveToSceneSession(ContextMessageUpdate, 'language', newLang);

//   ContextMessageUpdate.i18n.locale(newLang);
// }