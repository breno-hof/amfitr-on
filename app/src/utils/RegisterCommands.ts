import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';

export class RegisterCommands {
    private commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    constructor(private readonly rest: REST, private readonly appId: string) {}

    public async loadCommands(commandsPath: string): Promise<void> {
        const resolvedPath = path.resolve(commandsPath);
        const commandFiles = readdirSync(resolvedPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = await import(path.join(commandsPath, file));
            if (command.default?.data) {
                this.commands.push(command.default.data);
            }
        }
    }

    public async registerCommands(): Promise<void> {
        if (!this.appId || this.appId.trim() === "") {
            throw new Error("APP_ID is not defined or empty.");
        }
        
        try {
            console.log(`Registering ${this.commands.length} commands...`);

            await this.rest.put(Routes.applicationCommands(this.appId), { body: this.commands });

            console.log('Commands successfully registered!');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    }
}
