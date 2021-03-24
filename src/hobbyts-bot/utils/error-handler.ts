import { Logger } from '@nestjs/common';
import { ContextMessageUpdate } from 'telegraf';

/**
 * Wrapper to catch async errors within a stage. Helps to avoid try catch blocks in there
 * @param fn - function to enter a stage
 */
const asyncWrapper = async (fn: Function, ctx: ContextMessageUpdate, logger: Logger) => {
    try {
        return await fn(ctx);
    } catch (error) {
        logger.error('asyncWrapper error, %O', error);
        return ctx.reply(ctx.i18n.t('shared.something_went_wrong'));
    }
};

export default asyncWrapper;