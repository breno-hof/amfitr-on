import "dotenv/config.js";
import { Client, Collection, Events, GatewayIntentBits, REST } from "discord.js";
import { HandleInteractions } from "./HandleInteractions.js";
import { ISlashCommand } from "./commands/ISlashCommand.js";
import { RegisterCommands } from "./utils/RegisterCommands.js";
import { EnvValidator } from "./utils/EnvValidator.js";

class App {

    public async main() {
        try {
            EnvValidator.validate(["DISCORD_TOKEN", "APP_ID", "PATH_COMMANDS"]);
        } catch (error) {
            console.error("Environment variable validation failed:", error);
            process.exit(1);
        }

        const { DISCORD_TOKEN, APP_ID, PATH_COMMANDS } = process.env;
        const commands = new Collection<string, ISlashCommand>();
        const client = new Client({ intents: [GatewayIntentBits.Guilds] });
        const handleInteractions = new HandleInteractions(commands);

        const registrar = new RegisterCommands(new REST().setToken(DISCORD_TOKEN || ''), APP_ID || '');
        await registrar.loadCommands(PATH_COMMANDS || '');
        await registrar.registerCommands();

        client.on(Events.ClientReady, () => console.log(`Logged as ${client.user?.tag}`));
        client.on(Events.InteractionCreate, async interaction => handleInteractions.handle(interaction));

        client.login(DISCORD_TOKEN);
    }
}

new App().main();
