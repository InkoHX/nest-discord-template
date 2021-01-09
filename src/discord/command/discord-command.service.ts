import { Injectable, Type } from '@nestjs/common'
import { DiscoveryService, MetadataScanner } from '@nestjs/core'

import { DiscordCommand } from '../discord.interface'
import { DiscordReflectorService } from '../reflector/discord-reflector.service'

@Injectable()
export class DiscordCommandService extends Set<DiscordCommand> {
  public constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: DiscordReflectorService
  ) {
    super()
  }

  public init() {
    this.getProviders()
      .map(wrapper => this.scan(wrapper.instance, wrapper.metatype))
      .flat()
      .forEach(command => this.add(command))
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private scan(instance: any, metaType: Function | Type<any>) {
    const commands: DiscordCommand[] = []

    this.metadataScanner.scanFromPrototype(
      instance,
      Object.getPrototypeOf(instance),
      name => {
        const metadata = this.reflector.getCommandMetadata(instance[name])

        if (!metadata) return

        const { commandName, commandArgs } = metadata
        const params = this.reflector.getCommandParamMetadata(metaType, name)

        commands.push({
          callback: (instance[name] as Type<any>).bind(instance),
          params,
          commandName,
          commandArgs,
        })
      }
    )

    return commands
  }

  private getProviders() {
    return this.discovery
      .getProviders()
      .filter(wrapper => wrapper.isDependencyTreeStatic())
      .filter(wrapper => wrapper.instance)
      .filter(wrapper => wrapper.metatype)
  }
}
