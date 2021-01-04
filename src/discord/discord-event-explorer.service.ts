import { Injectable, Type } from '@nestjs/common'
import { DiscoveryService, MetadataScanner } from '@nestjs/core'

import { DISCORD_EVENT } from './discord.decorator'
import { DiscordEvent, DiscordEventMetadata } from './discord.interface'

@Injectable()
export class DiscordEventExplorer {
  public constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner
  ) {}

  public explore(): DiscordEvent[] {
    return this.getProviders()
      .map(wrapper => this.scanDiscordEvent(wrapper.instance))
      .flat()
  }

  private scanDiscordEvent(instance: any): DiscordEvent[] {
    const events: DiscordEvent[] = []

    this.metadataScanner.scanFromPrototype(
      instance,
      Object.getPrototypeOf(instance),
      methodName => {
        const metadata = this.reflectDiscordEventMetadata(instance, methodName)

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

  private reflectDiscordEventMetadata(
    instance: any,
    methodName: string
  ): DiscordEventMetadata | undefined {
    return Reflect.getMetadata(DISCORD_EVENT, instance[methodName], methodName)
  }
}
