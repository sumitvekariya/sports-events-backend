import { Inject } from '@nestjs/common';
import { Scene, SceneEnter, SceneLeave, Command, Ctx } from 'nestjs-telegraf';
import { ContextMessageUpdate } from 'telegraf';
import { RethinkService } from '../../rethink-db/rethink.service';

@Scene('start')
export class StartScene {
    private rethinkService: RethinkService

    constructor(@Inject('RethinkService') service) {
        this.rethinkService = service;
    }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ContextMessageUpdate): Promise<void> {
    ctx.i18n.locale('ua');
    const uuid = await this.rethinkService.generateUID();
    console.log(uuid)
    await ctx.reply(ctx.i18n.t('scenes.start.welcome_back'));
    // return 'Welcome on scene ✋';
  }

  @SceneLeave()
  onSceneLeave(): string {
    console.log('Leave from scene');
    return 'Bye Bye 👋';
  }

  @Command(['rng', 'random'])
  onRandomCommand(): number {
    console.log('Use "random" command');
    return Math.floor(Math.random() * 11);
  }

  @Command('leave')
  async onLeaveCommand(ctx: ContextMessageUpdate): Promise<void> {
    await ctx.scene.leave();
  }
}