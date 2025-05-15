import 'dotenv/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

// Add some logging to debug environment variables
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent, // メッセージの中身を取得するIntent (重要！)
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once('ready', () => {
  console.log(`RSVP Bot ready as ${client.user?.tag}`);
});

// ✅ !ping コマンド用 (動作確認用)
client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Bot無視
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

// ✅ リアクションでRSVP
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  const emoji = reaction.emoji.name;
  if (!reaction.message.content) return;

  const eventId = extractEventIdFromMessage(reaction.message.content);
  const memberId = await getMemberIdFromDiscord(user.id);

  if (!eventId || !memberId) return;

  let status: 'going' | 'maybe' | 'declined' | null = null;
  if (emoji === '✅') status = 'going';
  else if (emoji === '❓') status = 'maybe';
  else if (emoji === '❌') status = 'declined';

  if (!status) return;

  const { error } = await supabase.from('event_rsvps').upsert({
    event_id: eventId,
    member_id: memberId,
    status,
  });

  if (error) {
    console.error('Error updating RSVP:', error);
  } else {
    console.log(`${user.username} set RSVP to ${status} for event ${eventId}`);
  }
});

// 🔍 イベントIDをメッセージ本文から拾う関数
function extractEventIdFromMessage(content: string): string | null {
  const match = content.match(/event_id:([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

// 🔍 DiscordID → members.id をSupabaseから取得
async function getMemberIdFromDiscord(discordId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('members')
    .select('id')
    .eq('discord_id', discordId)
    .single();

  if (error || !data) {
    console.error('Failed to get memberId for Discord ID:', discordId, error);
    return null;
  }
  return data.id;
}

// ✅ Botログイン
client.login(DISCORD_TOKEN);
