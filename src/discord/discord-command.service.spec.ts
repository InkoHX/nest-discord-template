import { DiscoveryModule } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'

import { DiscordCommandService } from './discord-command.service'
import { DiscordReflectorService } from './discord-reflector.service'

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
})
