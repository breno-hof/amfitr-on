import { SlashCommandBuilder, Interaction } from "discord.js";
import { ISlashCommand } from "./ISlashCommand.js";
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { PersonaManager } from "../managers/PersonaManager.js";

export class CreatePersonaCommand implements ISlashCommand {
    readonly name: string = metadata.name;

    constructor(
        readonly personaManager: PersonaManager
    ) {}

    data(): RESTPostAPIChatInputApplicationCommandsJSONBody {
        return metadata.data();
    }

    async execute(interaction: Interaction) {
        if (!('options' in interaction)) throw new Error(`Options undefined in interaction object of CreatePersonaCommand.execute()`);
        
        const name = interaction.options.data[0].value as string;
        const description = interaction.options.data[1].value as string;
        const voiceStyle = interaction.options.data[2].value as string;

        this.personaManager.createPersona(interaction.guildId || "global", { name, description, voiceStyle });

        return `Persona '${name}' has been created with description '${description}' and voice style '${voiceStyle}'.`;
    }
};

const metadata = {
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
    }
}

export default metadata;