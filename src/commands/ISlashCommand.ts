import {
    Interaction,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js'

/**
 * Represents a Discord slash command.
 */
export interface ISlashCommand {
    /**
     * The unique name of the slash command.
     */
    readonly name: string;

    /**
     * Returns the command data for registration with Discord.
     */
    data(): RESTPostAPIChatInputApplicationCommandsJSONBody;

    /**
     * Executes the command logic when invoked.
     * @param interaction The interaction that triggered the command.
     * @returns A promise resolving to the command output.
     */
    execute(interaction: Interaction): Promise<string>;
}