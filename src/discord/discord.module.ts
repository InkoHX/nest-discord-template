import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import { DiscordEventExplorer } from './discord-event-explorer.service'
import { DiscordService } from './discord.service'

@Module({
  providers: [DiscordService, DiscordEventExplorer],
  exports: [DiscordService],
})
export class DiscordModule implements OnModuleInit, OnModuleDestroy {
  public constructor(
    private readonly bot: DiscordService,
    private readonly eventExplorer: DiscordEventExplorer
  ) {}

  public async onModuleInit() {
    this.registerEvents()

    await this.bot.login()
  }

  public onModuleDestroy() {
    this.bot.destroy()
  }

  private registerEvents() {
    const events = this.eventExplorer.explore()

    for (const { eventName, callback, once } of events) {
      if (once) {
        this.bot.once(eventName, callback)
      } else {
        this.bot.on(eventName, callback)
      }
    }
  }
}
