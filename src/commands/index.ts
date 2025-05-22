import { CommandOptions, Player } from "../interfaces";

export class Command {

    public readonly name: string;

    public readonly aliases: string[];

    public readonly description: string;

    public readonly usage: string;

    readonly params: Array<{ name: string; required: boolean; default?: string }>;

    private readonly handlerFn: (player: Player, args: Record<string, string>) => void;

    constructor(opts: CommandOptions) {
        this.name = opts.name;
        this.aliases = opts.aliases ?? [];
        this.description = opts.description;
        this.usage = opts.usage;
        this.handlerFn = opts.handler;

        const tokens = Array.from(
            this.usage.matchAll(/<([^>]+)>|\[([^\]=]+)(?:=([^\]]+))?\]/g)
        );

        this.params = tokens.map(([, req, opt, def]) =>
            req
                ? { name: req, required: true }
                : { name: opt!, required: false, default: def }
        );
    }

    public matches(input: string): boolean {
        const cmd = input.toLowerCase();
        return cmd === this.name || this.aliases.includes(cmd);
    }

    public call(player: Player, rawArgs: string[]): void {
        const argsByName: Record<string, string> = {};

        this.params.forEach(({ name, required, default: def }, idx) => {
            if (idx === this.params.length - 1) {
                const rest = rawArgs.slice(idx).join(" ");
                if (rest !== "") {
                    argsByName[name] = rest;
                } else if (!required && def !== undefined) {
                    argsByName[name] = def;
                } else {
                    argsByName[name] = "";
                }
            } else {
                const val = rawArgs[idx];
                if (val !== undefined) {
                    argsByName[name] = val;
                } else if (!required && def !== undefined) {
                    argsByName[name] = def;
                } else {
                    argsByName[name] = "";
                }
            }
        });

        this.handlerFn(player, argsByName);
    }
}