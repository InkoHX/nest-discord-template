export interface DiscordEventMetadata {
  eventName: string
  once: boolean
}

export interface DiscordEvent extends DiscordEventMetadata {
  callback: (...args: any[]) => void
}

export type DiscordCommandParamType = 'ARGUMENT' | 'MESSAGE'

export type DiscordCommandMessageMetadata = {
  paramType: 'MESSAGE'
  parameterIndex: number
}

export type DiscordCommandArgumentMetadata = {
  paramType: 'ARGUMENT'
  parameterIndex: number
  argumentName: string
}

export type DiscordCommandParamMetadata = DiscordCommandMessageMetadata &
  DiscordCommandArgumentMetadata
