export interface DiscordEventMetadata {
  eventName: string
  once: boolean
}

export interface DiscordEvent extends DiscordEventMetadata {
  callback: (...args: any[]) => void
}
