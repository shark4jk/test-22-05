import { CommandOptions, Player } from "../../interfaces";
import { getAllCommands } from "../handler";

export const commands: CommandOptions[] = [
    {
        name: "teleport",
        aliases: ["tp"],
        description: "Телепортирует игрока, z по умолчанию 0",
        usage: "/teleport <x> <y> [z=0]",
        handler: (player: Player, args) => {
            const x = parseFloat(args.x);
            const y = parseFloat(args.y);
            const z = parseFloat(args.z);

            if (isNaN(x) || isNaN(y)) {
                return player.sendMessage(`Использование: ${"/teleport <x> <y> [z=0]"}`);
            }
            player.sendMessage(`Телепортировано на (${x}, ${y}, ${z})`);
        },
    },
    {
        name: "givehp",
        aliases: ["hp", "heal"],
        description: "Выдаёт HP, если amount не указан — по умолчанию 100",
        usage: "/givehp <playerId> [amount=100]",
        handler: (player: Player, args) => {
            const id = parseInt(args.playerId, 10);
            const amount = parseInt(args.amount, 10);

            if (isNaN(id) || isNaN(amount)) {
                return player.sendMessage(`Использование: ${"/givehp <playerId> [amount=100]"}`);
            }
            player.sendMessage(`Выдано ${amount} HP игроку с ID ${id}`);
        },
    },
    {
        name: "pm",
        aliases: ["msg", "tell"],
        description: 'Приватное сообщение, если message не указано — по умолчанию "Hello"',
        usage: '/pm <playerId> [message="Hello"]',
        handler: (player: Player, args) => {
            const id = parseInt(args.playerId, 10);
            const message = args.message;

            if (isNaN(id) || message.trim() === "") {
                return player.sendMessage(`Использование: ${'/pm <playerId> [message="Hello"]'}`);
            }
            player.sendMessage(`(to ${id}): ${message}`);
        },
    },
    {
        name: "help",
        aliases: ["h"],
        description: "Список всех команд.",
        usage: "/help",
        handler: (player: Player) => {
            const commands = getAllCommands();
            commands.forEach((cmd) =>
                player.sendMessage(`${cmd["usage"]} — ${cmd["description"]}`)
            );
        },
    },
];
