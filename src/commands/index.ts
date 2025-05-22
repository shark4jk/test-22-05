import { Player, CommandParam, CommandOptions } from '../interfaces';

export class Command<Args extends Record<string, unknown>> {
    readonly name: string;

    readonly aliases: string[];

    readonly description: string;

    readonly permission?: number;

    readonly params: CommandParam<any>[];

    private readonly handlerFn: (player: Player, args: Args) => void;

    constructor(opts: CommandOptions<Args>) {
        this.name = opts.name;
        this.aliases = opts.aliases ?? [];
        this.description = opts.description;
        this.permission = opts.permission;
        this.params = opts.params;
        this.handlerFn = opts.handler;
    }

    execute(player: Player, rawArgs: string[]): void {
        const args = this.parseArgs<Args>(rawArgs);
        this.handlerFn(player, args);
    }

    private parseArgs<T>(rawArgs: string[]): T {
        const result: Record<string, unknown> = {};
        let idx = 0;

        for (const p of this.params) {
            if (p.rest) {
                const rest = rawArgs.slice(idx).join(' ');
                result[p.name] = rest !== '' ? rest : p.default ?? '';
                break;
            }

            const raw = rawArgs[idx++];
            if (raw === undefined) {
                if (p.required) {
                    throw new Error(`Отсутствует обязательный параметр ${p.name}`);
                }
                result[p.name] = p.default;
                continue;
            }

            switch (p.type) {
                case 'number': {
                    const num = Number(raw);
                    if (Number.isNaN(num)) {
                        throw new Error(`Параметр ${p.name} должен быть числом`);
                    }
                    result[p.name] = num;
                    break;
                }
                case 'boolean': {
                    if (raw !== 'true' && raw !== 'false') {
                        throw new Error(`Параметр ${p.name} должен быть true|false`);
                    }
                    result[p.name] = raw === 'true';
                    break;
                }
                default:
                    result[p.name] = raw;
            }
        }

        return result as T;
    }
}
