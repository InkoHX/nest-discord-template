import { DiscoveryModule } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'

import { DiscordParentCommandService } from './discord-parent-command.service'
import { DiscordReflectorService } from './discord-reflector.service'

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
})
