import { Module } from '@nestjs/common'

import { PingCommandService } from './ping-command/ping-command.service'

@Module({
  providers: [PingCommandService],
})
export class DiscordCommandModule {}
