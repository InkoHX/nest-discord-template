import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'

import { DiscordCommandService } from './discord-command.service'
import { DiscordEventService } from './discord-event.service'
import { DiscordParentCommandService } from './discord-parent-command.service'
import { DiscordReflectorService } from './discord-reflector.service'
import { DiscordService } from './discord.service'

@Module({
  imports: [DiscoveryModule],
  providers: [
    DiscordService,
    DiscordEventService,
    DiscordCommandService,
    DiscordParentCommandService,
    DiscordReflectorService,
  ],
  exports: [DiscordService, DiscordCommandService, DiscordParentCommandService],
})
export class DiscordModule implements OnModuleInit, OnModuleDestroy {
  public constructor(
    private readonly bot: DiscordService,
    private readonly eventService: DiscordEventService,
    private readonly commandService: DiscordCommandService,
    private readonly parentCommandService: DiscordParentCommandService
  ) {}

  public async onModuleInit() {
    this.commandService.init()
    this.parentCommandService.init()
    this.eventService.init()

    await this.bot.login()
  }

  public onModuleDestroy() {
    this.bot.destroy()
  }
}
