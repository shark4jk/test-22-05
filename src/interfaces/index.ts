export interface Player {
    id: number;
    name: string;
    permission: number;
    sendMessage(message: string): void;
    hasPermission?(perm: number): boolean;
}

export interface CommandParam<T> {
    name: string;
    type: 'string' | 'number' | 'boolean';
    required?: boolean;
    default?: T;
    rest?: boolean;
}

export interface CommandOptions<Args extends Record<string, unknown>> {
    name: string;
    aliases?: string[];
    description: string;
    permission?: number;
    params: CommandParam<any>[];
    handler: (player: Player, args: Args) => void;
}

export type EventRegister = (
    eventName: 'command',
    callback: (player: Player, input: string) => void,
) => void;
