import { CommandOptions, Player } from '../../interfaces';
import { handler } from '../../../index';

export const commands: Record<string, CommandOptions<any>> = {
    teleport: {
        name: 'teleport',
        aliases: ['tp'],
        description: 'Телепортирует игрока',
        permission: 0,
        params: [
            { name: 'x', type: 'number', required: true },
            { name: 'y', type: 'number', required: true },
            { name: 'z', type: 'number', required: false, default: 0 },
        ],
        handler: (player: Player, { x, y, z }: { x: number; y: number; z: number }) => {
            player.sendMessage(`Телепортировано на (${x}, ${y}, ${z})`);
        },
    },

    giveHp: {
        name: 'givehp',
        aliases: ['hp', 'heal'],
        description: 'Выдаёт HP игроку',
        permission: 1,
        params: [
            { name: 'playerId', type: 'number', required: true },
            { name: 'amount', type: 'number', required: false, default: 100 },
        ],
        handler: (player: Player, { playerId, amount }: { playerId: number; amount: number }) => {
            player.sendMessage(`Выдано ${amount} HP игроку с ID ${playerId}`);
        },
    },

    pm: {
        name: 'pm',
        aliases: ['msg', 'tell'],
        description: 'Приватное сообщение',
        permission: 0,
        params: [
            { name: 'playerId', type: 'number', required: true },
            { name: 'message', type: 'string', required: false, default: 'Hello', rest: true },
        ],
        handler: (player: Player, { playerId, message }: { playerId: number; message: string }) => {
            player.sendMessage(`(to ${playerId}): ${message}`);
        },
    },

    help: {
        name: 'help',
        aliases: ['h'],
        description: 'Список всех команд',
        permission: 0,
        params: [],
        handler: (player: Player) => {
            const commandsList = handler.getAllCommands();
            commandsList.forEach((cmd) => player.sendMessage(`/${cmd.name} — ${cmd.description}`));
        },
    },
};
