import { EventRegister, Player } from "../interfaces";
import { Command } from "./index";
import { commands as commandConfigs } from "./actions/config";

let commandList: Command[] = [];

export function initHandler(registerEvent: EventRegister) {
    commandList = commandConfigs.map(cfg => new Command(cfg));

    registerEvent("command", (player: Player, input: string) => {
        handleCommand(player, input);
    });
}

export function getAllCommands(): Command[] {
    return commandList;
}

function handleCommand(player: Player, raw: string) {
    if (!raw.startsWith("/")) return;

    const [name, ...args] = raw.slice(1).trim().split(/\s+/);
    const command = commandList.find(cmd => cmd.matches(name.toLowerCase()));

    if (!command) {
        player.sendMessage(`Неизвестная команда: /${name}`);
        return;
    }

    try {
        command.call(player, args);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        player.sendMessage(`Ошибка: ${msg}`);
    }
}
