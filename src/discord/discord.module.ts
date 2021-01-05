import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'

import { DiscordCommandService } from './discord-command-explorer.service'
import { DiscordEventExplorer } from './discord-event-explorer.service'
import { DiscordParentCommandService } from './discord-parent-command.service'
import { DiscordReflectorService } from './discord-reflector.service'
import { DiscordService } from './discord.service'

@Module({
  imports: [DiscoveryModule],
  providers: [
    DiscordService,
    DiscordEventExplorer,
    DiscordCommandService,
    DiscordParentCommandService,
    DiscordReflectorService,
  ],
  exports: [DiscordService, DiscordCommandService, DiscordParentCommandService],
})
export class DiscordModule implements OnModuleInit, OnModuleDestroy {
  public constructor(
    private readonly bot: DiscordService,
    private readonly eventExplorer: DiscordEventExplorer,
    private readonly commandService: DiscordCommandService,
    private readonly parentCommandService: DiscordParentCommandService
  ) {}

  public async onModuleInit() {
    this.commandService.init()
    this.parentCommandService.init()
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
