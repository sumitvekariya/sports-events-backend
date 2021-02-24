import { ContextMessageUpdate } from 'telegraf';
// import { loggerMessage } from './other';

// type SessionDataField = 'settingsScene' | 'language';

// /**
//  * Saving data to the session
//  * @param ctx - telegram context
//  * @param field - field to store in
//  * @param data - data to store
//  */
export function saveToSceneSession(ctx: ContextMessageUpdate, field: string, data: any) {
//   loggerMessage('debug', ctx, 'Saving %s to session', field);
  ctx.scene.state[field] = data;
}

// /**
//  * Removing data from the session
//  * @param ContextMessageUpdate - telegram context
//  * @param field - field to delete
//  */
// export function deleteFromSession(ctx: ContextMessageUpdate, field: SessionDataField) {
//   loggerMessage('debug', ctx, 'Deleting %s from session', field);
//   delete ctx.session[field];
// }