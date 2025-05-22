import { EventRegister, Player } from '../interfaces';
import { Command } from './index';
import { commands as commandConfigs } from './actions/config';

export class CommandHandler {
    private readonly commands: Command<any>[];

    private readonly commandMap: Map<string, Command<any>>;

    constructor() {
        const configs = Object.values(commandConfigs);

        this.commands = configs.map((cfg) => new Command(cfg));
        this.commandMap = new Map();

        for (const cmd of this.commands) {
            this.commandMap.set(cmd.name, cmd);
            for (const alias of cmd.aliases) {
                this.commandMap.set(alias, cmd);
            }
        }
    }

    getAllCommands(): Command<any>[] {
        return this.commands;
    }

    register(registerEvent: EventRegister): void {
        registerEvent('command', (player: Player, input: string) => {
            this.handle(player, input);
        });
    }

    private handle(player: Player, raw: string): void {
        if (!raw.startsWith('/')) {
            return;
        }

        const [name, ...args] = raw.slice(1).trim().split(/\s+/);
        const cmd = this.commandMap.get(name.toLowerCase());

        if (!cmd) {
            player.sendMessage(`Неизвестная команда: /${name}`);
            return;
        }

        if (cmd.permission && !player.hasPermission?.(cmd.permission)) {
            player.sendMessage('У вас нет прав для этой команды');
            return;
        }

        try {
            cmd.execute(player, args);
        } catch (e: unknown) {
            const error = e as Error;
            player.sendMessage(`Ошибка: ${error.message}`);
            const usage = [
                `/${name}`,
                ...cmd.params.map((p) => (p.required ? `<${p.name}>` : `[${p.name}=${p.default}]`)),
            ].join(' ');
            player.sendMessage(`Использование: ${usage}`);
        }
    }
}
