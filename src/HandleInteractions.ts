import { Collection, Interaction } from "discord.js";
import { ISlashCommand } from "./commands/ISlashCommand.js";

export class HandleInteractions {
    constructor(readonly commands: Collection<string, ISlashCommand>) {}

    async handle(interaction: Interaction, ephemeral: boolean = true) {
        try {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);

            if (command) {
                await interaction.reply({ content: await command.execute(interaction), ephemeral });
            } else {
                await interaction.reply({ content: "Command not found.", ephemeral });
            }
        } catch (error) {
            console.error("Error handling interaction:", error);
            if (interaction.isRepliable()) {
                await interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true });
            }
        }
    }
}