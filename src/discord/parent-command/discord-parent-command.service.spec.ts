import { DiscoveryModule } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'

import { DiscordReflectorService } from '../reflector/discord-reflector.service'
import { DiscordParentCommandService } from './discord-parent-command.service'

describe('DiscordService', () => {
  let service: DiscordParentCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordReflectorService, DiscordParentCommandService],
      imports: [DiscoveryModule],
    }).compile()

    service = module.get<DiscordParentCommandService>(
      DiscordParentCommandService
    )
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
