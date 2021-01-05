/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, Type } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import {
  DISCORD_CHILD_COMMAND,
  DISCORD_COMMAND,
  DISCORD_COMMAND_PARAM,
  DISCORD_PARENT_COMMAND,
} from './discord.decorator'
import {
  DiscordChildCommandMetadata,
  DiscordCommandMetadata,
  DiscordCommandParamMetadata,
} from './discord.interface'

@Injectable()
export class DiscordReflectorService {
  public constructor(private readonly reflector: Reflector) {}

  public getCommandMetadata(
    target: Function | Type<any>
  ): DiscordCommandMetadata | undefined {
    return this.reflector.get(DISCORD_COMMAND, target)
  }

  public getParentCommandMetadata(
    target: Function | Type<any>
  ): string | undefined {
    return this.reflector.get(DISCORD_PARENT_COMMAND, target)
  }

  public getChildCommandMetadata(
    target: Function | Type<any>
  ): DiscordChildCommandMetadata | undefined {
    return this.reflector.get(DISCORD_CHILD_COMMAND, target)
  }

  public getCommandParamMetadata(
    target: Function | Type<any>,
    methodName: string
  ): DiscordCommandParamMetadata[] {
    return (
      Reflect.getMetadata(
        DISCORD_COMMAND_PARAM,
        target.constructor,
        methodName
      ) ?? []
    )
  }
}
