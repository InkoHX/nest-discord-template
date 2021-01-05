import { Injectable, Type } from '@nestjs/common'
import { DiscoveryService, MetadataScanner } from '@nestjs/core'

import { DiscordReflectorService } from './discord-reflector.service'
import { DiscordEvent } from './discord.interface'

@Injectable()
export class DiscordEventExplorer {
  public constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: DiscordReflectorService
  ) {}

  public explore(): DiscordEvent[] {
    return this.getProviders()
      .map(wrapper => this.scan(wrapper.instance))
      .flat()
  }

  private scan(instance: any): DiscordEvent[] {
    const events: DiscordEvent[] = []

    this.metadataScanner.scanFromPrototype(
      instance,
      Object.getPrototypeOf(instance),
      methodName => {
        const metadata = this.reflector.getEventMetadata(instance[methodName])

        if (!metadata) return

        const { eventName, once } = metadata

        events.push({
          callback: (instance[methodName] as Type<any>).bind(instance),
          eventName,
          once,
        })
      }
    )

    return events
  }

  private getProviders() {
    return this.discovery
      .getProviders()
      .filter(wrapper => wrapper.isDependencyTreeStatic())
      .filter(wrapper => wrapper.instance)
  }
}
