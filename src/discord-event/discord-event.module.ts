import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/discord/discord.module'

import { MessageService } from './message/message.service'

@Module({
  providers: [MessageService],
  imports: [DiscordModule],
})
export class DiscordEventModule {}
