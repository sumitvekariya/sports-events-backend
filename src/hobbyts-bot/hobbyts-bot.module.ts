import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
const TelegrafI18n = require('telegraf-i18n');
import * as path from 'path';
import { CoreBotModule } from './core/core.bot.module';
import { RethinkModule } from 'src/rethink-db/rethink.module';

const i18n = new TelegrafI18n({
    useSession: true,
    defaultLanguage: 'ua',
    directory: path.resolve(__dirname, '../locales'),
    allowMissing: false,
    // defaultLanguageOnMissing: true, // implies allowMissing = true
    sessionName: 'session'
});
const telegramOptions = {
    middlewares: [
        session(),
        i18n.middleware(),
    ],
    include: [CoreBotModule]
}

@Module({
    imports: [
        RethinkModule,
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return { 
                    ...configService.get('TELEGRAM.CONFIG'),
                    ...telegramOptions
                }
            },
            inject: [ConfigService],
        }),
        CoreBotModule
    ]
})
export class HobbytsBotModule {}
