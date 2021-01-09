/* eslint-disable @typescript-eslint/no-empty-function */
import { DiscoveryModule } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'

import { DiscordReflectorService } from '../reflector/discord-reflector.service'
import { DiscordCommandService } from './discord-command.service'

describe('DiscordService', () => {
  let service: DiscordCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordReflectorService, DiscordCommandService],
      imports: [DiscoveryModule],
    }).compile()

    service = module.get<DiscordCommandService>(DiscordCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('getProviders', () => {
    const providers = service['getProviders']()

    expect(
      providers.every(wrapper => wrapper.isDependencyTreeStatic())
    ).toBeTruthy()
    expect(providers.every(wrapper => wrapper.instance)).toBeTruthy()
    expect(providers.every(wrapper => wrapper.metatype)).toBeTruthy()
  })
})
