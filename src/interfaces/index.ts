export interface CommandOptions {
    name: string;
    aliases?: string[];
    description: string;
    usage: string;
    handler: (player: Player, args: Record<string, string>) => void;
}
export interface Player {
    id: number;
    name: string;
    sendMessage(message: string): void;
}

export type EventRegister = (
    eventName: "command",
    callback: (player: Player, input: string) => void
) => void;
