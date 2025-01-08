import { VoiceChannelManager } from "../managers/VoiceChannelManager";
import { PersonaManager } from "../managers/PersonaManager";
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { SlashCommandBuilder, Interaction } from "discord.js";
import { ISlashCommand } from "./ISlashCommand.js";

export class ConnectPersonaCommand implements ISlashCommand {
    readonly name: string = metadata.name

    constructor(
        readonly personaManager: PersonaManager,
        readonly voiceChannelManager: VoiceChannelManager,
    ) {}

    data(): RESTPostAPIChatInputApplicationCommandsJSONBody {
        return metadata.data();
    }

    async execute(interaction: Interaction) {
        if (!('options' in interaction)) throw new Error(`Options undefined in interaction object of CreatePersonaCommand.execute()`);
        
        const name = interaction.options.data[0].value as string;
        const guildId = interaction.guildId || "global";
        const persona = this.personaManager.getPersona(guildId, name);

        if (!persona) {
            return "No persona found for this server. Create one first using /create-persona.";
        }

        return await this.voiceChannelManager.join(interaction);
    }
};

const metadata = {
    name: "connect-persona",
    data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription("Connect a persona to the voice channel.")
            .addStringOption(option =>
                option.setName("name")
                    .setDescription("Name of the persona")
                    .setRequired(true)
            )
            .toJSON();
    }
}

export default metadata;