import { DiscoveryModule } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'

import { DiscordService } from '../discord.service'
import { DiscordReflectorService } from '../reflector/discord-reflector.service'
import { DiscordEventService } from './discord-event.service'

describe('DiscordService', () => {
  let service: DiscordEventService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordEventService, DiscordService, DiscordReflectorService],
      imports: [DiscoveryModule],
    }).compile()

    service = module.get<DiscordEventService>(DiscordEventService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('getProviders', () => {
    const providers = service['getProviders']()

    expect(providers.every(wrapper => wrapper.instance)).toEqual(true)
    expect(
      providers.every(wrapper => wrapper.isDependencyTreeStatic())
    ).toEqual(true)
  })
})
