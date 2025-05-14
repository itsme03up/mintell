import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID!;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

let isReady = false;

client.once('ready', () => {
  console.log(`Discord client logged in as ${client.user?.tag}`);
  isReady = true;
});

client.login(DISCORD_TOKEN);

export async function sendEventMessage(content: string): Promise<string | null> {
  if (!isReady) await new Promise((res) => client.once('ready', res));

  const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
  if (!channel?.isTextBased()) {
    console.error('Invalid DISCORD_CHANNEL_ID or channel is not text-based');
    return null;
  }

  const message = await (channel as TextChannel).send(content);
  return message.id;
}
