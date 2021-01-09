import { Injectable, Type } from '@nestjs/common'
import { DiscoveryService, MetadataScanner } from '@nestjs/core'

import { DiscordChildCommand, DiscordParentCommand } from '../discord.interface'
import { DiscordReflectorService } from '../reflector/discord-reflector.service'

@Injectable()
export class DiscordParentCommandService extends Set<DiscordParentCommand> {
  public constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: DiscordReflectorService
  ) {
    super()
  }

  public init() {
    this.getProviders()
      .map(wrapper => this.scan(wrapper.instance, wrapper.metatype) ?? [])
      .flat()
      .forEach(parentCommand => this.add(parentCommand))
  }

  private scan(
    instance: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    metaType: Function | Type<any>
  ): DiscordParentCommand | null {
    const commandName = this.reflector.getParentCommandMetadata(instance)
    const children: DiscordChildCommand[] = []

    if (!commandName) return null

    this.metadataScanner.scanFromPrototype(
      instance,
      Object.getPrototypeOf(instance),
      name => {
        const childMetadata = this.reflector.getChildCommandMetadata(instance)
        const params = this.reflector.getCommandParamMetadata(metaType, name)

        if (!childMetadata) return

        children.push({
          callback: (instance[name] as Type<any>).bind(instance),
          commandArgs: childMetadata.commandArgs,
          params,
        })
      }
    )

    return {
      commandName,
      children,
    }
  }

  private getProviders() {
    return this.discovery
      .getProviders()
      .filter(wrapper => wrapper.isDependencyTreeStatic())
      .filter(wrapper => wrapper.instance)
      .filter(wrapper => wrapper.metatype)
  }
}
