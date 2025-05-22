import { Player, EventRegister } from './src/interfaces';
import { CommandHandler } from './src/commands/handler';

const callbacks: Array<(p: Player, msg: string) => void> = [];

const onEvent: EventRegister = (eventName, callback) => {
    if (eventName === 'command') callbacks.push(callback);
};

export const handler = new CommandHandler();
handler.register(onEvent);

class TestPlayer implements Player {
    constructor(
        public id: number,
        public name: string,
        public permission: number,
    ) {}

    sendMessage(msg: string): void {
        console.log(`[${this.name}] ${msg}`);
    }

    hasPermission(perm: number): boolean {
        return this.permission === perm;
    }
}

const player = new TestPlayer(1, 'Максим Тестер', 1);

[
    '/help',
    '/teleport 10 20',
    '/teleport 10 20 30',
    '/givehp 2',
    '/givehp 3 150',
    '/pm 2',
    '/pm 2 Привет',
    '/pm 2 Hey there!',
    '/unknown',
    '/teleport 10 20 gfd',
    '/hp kek',
].forEach((cmd) => {
    console.log(`\n> ${cmd}`);
    callbacks.forEach((callback) => {
        callback(player, cmd);
    });
});
