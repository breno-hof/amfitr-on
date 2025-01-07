import { SlashCommandBuilder, Interaction } from "discord.js";
import { ISlashCommand } from "./ISlashCommand.js";

interface Persona {
    name: string;
    description: string;
    voiceStyle: string;
}

const personas: Map<string, Persona> = new Map();

const CreatePersonaCommand: ISlashCommand = {
    name: "create-persona",
    data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription("Create a new persona for the bot.")
            .addStringOption(option =>
                option.setName("name")
                    .setDescription("Name of the persona")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName("description")
                    .setDescription("A brief description of the persona")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName("voice")
                    .setDescription("Style of the persona's voice (e.g., calm, energetic)")
                    .setRequired(true)
            )
            .toJSON();
    },

    async execute(interaction: Interaction) {
        if (!('options' in interaction)) throw new Error(`Options undefined in interaction object of CreatePersonaCommand.execute()`);
        
        const name = interaction.options.data[0].value as string;
        const description = interaction.options.data[1].value as string;
        const voiceStyle = interaction.options.data[2].value as string;

        personas.set(interaction.guildId || "global", { name, description, voiceStyle });

        return `Persona '${name}' has been created with description '${description}' and voice style '${voiceStyle}'.`;
    }
};

export default CreatePersonaCommand;
