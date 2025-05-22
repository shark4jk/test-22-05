import { Player, EventRegister } from "./src/interfaces";
import { initHandler } from "./src/commands/handler";

const callbacks: Array<(p: Player, msg: string) => void> = [];

const onEvent: EventRegister = (eventName, callback) => {
    if (eventName === "command") {
        callbacks.push(callback);
    }
};

initHandler(onEvent);

// заглушка
class TestPlayer implements Player {
    constructor(public id: number, public name: string) {}
    sendMessage(msg: string) {
        console.log(`[${this.name}] ${msg}`);
    }
}

const player = new TestPlayer(1, "Максим Тест");

// для тестов
[
    "/help",
    "/teleport 10 20",
    "/teleport 10 20 30",
    "/givehp 2",
    "/givehp 3 150",
    "/pm 2",
    "/pm 2 Hey there!",
    "/unknown",
].forEach((cmd) => {
    console.log(`\n> ${cmd}`);
    callbacks.forEach((cb) => cb(player, cmd));
});

