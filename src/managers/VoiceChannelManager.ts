import { joinVoiceChannel, VoiceConnectionStatus, entersState } from "@discordjs/voice";
import { ChannelType, Interaction, GuildMember } from "discord.js";

export class VoiceChannelManager {
    async join(interaction: Interaction): Promise<string> {
        if (!interaction.isChatInputCommand()) {
            return "This interaction is not a valid chat command.";
        }

        if (!('options' in interaction)) throw new Error(`Options undefined in interaction object of CreatePersonaCommand.execute()`);
        
        const name = interaction.options.data[0].value as string;
        const member = interaction.member as GuildMember;
        const channel = member.voice.channel;
        
        if (!channel || channel.type !== ChannelType.GuildVoice) {
            return "You need to be in a voice channel to use this command.";
        }

        try {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            await entersState(connection, VoiceConnectionStatus.Ready, 5_000);
            return `Successfully joined the voice channel: ${channel.name}` +
            `\nPersona '${name}' is now active in the voice channel.`;
        } catch (error) {
            console.error("Error joining voice channel:", error);
            return "Failed to join the voice channel.";
        }
    }
}
