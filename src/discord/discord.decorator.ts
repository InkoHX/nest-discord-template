import { SetMetadata } from '@nestjs/common'
import { ClientEvents } from 'discord.js'

export const DISCORD_EVENT = Symbol('DISCORD_EVENT')

export const DiscordEvent = (
  eventName: keyof ClientEvents,
  once = false
): MethodDecorator => SetMetadata(DISCORD_EVENT, { eventName, once })
