import { Injectable } from '@nestjs/common'
import { Message } from 'discord.js'
import { match } from 'path-to-regexp'
import { DiscordCommandService } from 'src/discord/discord-command.service'
import { DiscordParentCommandService } from 'src/discord/discord-parent-command.service'
import { DiscordEvent } from 'src/discord/discord.decorator'
import { DiscordService } from 'src/discord/discord.service'
import util from 'util'

const { isPromise } = util.types

@Injectable()
export class MessageService {
  public constructor(
    private readonly command: DiscordCommandService,
    private readonly parentCommand: DiscordParentCommandService,
    private readonly bot: DiscordService
  ) {}

  @DiscordEvent('message')
  public onMessage(message: Message) {
    Promise.all([this.runCommand(message), this.runParentCommand(message)])
  }

  private async runCommand(message: Message) {
    for (const { commandName, commandArgs, params, callback } of this.command) {
      const pattern =
        this.bot.commandPrefix + commandName + commandArgs
          ? ` ${commandArgs}`
          : ''
      const matchResult = match(pattern)(message.content)

      if (!matchResult) continue

      const args = params
        .sort((a, b) => a.parameterIndex - b.parameterIndex)
        .map(param =>
          param.paramType === 'MESSAGE'
            ? message
            : (matchResult.params as Record<string, string>)[param.argumentName]
        )

      return isPromise(callback) ? await callback(...args) : callback(...args)
    }
  }

  private async runParentCommand(message: Message) {
    for (const { commandName, children } of this.parentCommand) {
      if (!message.content.startsWith(this.bot.commandPrefix + commandName))
        continue

      for (const { commandArgs, params, callback } of children) {
        const pattern =
          this.bot.commandPrefix + commandName + commandArgs
            ? ` ${commandArgs}`
            : ''
        const matchResult = match(pattern)(message.content)

        if (!matchResult) continue

        const args = params
          .sort((a, b) => a.parameterIndex - b.parameterIndex)
          .map(param =>
            param.paramType === 'MESSAGE'
              ? message
              : (matchResult.params as Record<string, string>)[
                  param.argumentName
                ]
          )

        return isPromise(callback) ? await callback(...args) : callback(...args)
      }
    }
  }
}
