import { joinVoiceChannel, VoiceConnectionStatus, entersState } from "@discordjs/voice";
import { ChannelType, Interaction, GuildMember } from "discord.js";

export class VoiceChannelManager {
    public static async join(interaction: Interaction): Promise<string> {
        if (!interaction.isChatInputCommand()) {
            return "This interaction is not a valid chat command.";
        }

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
            return `Successfully joined the voice channel: ${channel.name}`;
        } catch (error) {
            console.error("Error joining voice channel:", error);
            return "Failed to join the voice channel.";
        }
    }
}
