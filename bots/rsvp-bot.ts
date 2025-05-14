import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once('ready', () => {
  console.log(`RSVP Bot ready as ${client.user?.tag}`);
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  const emoji = reaction.emoji.name;
  const eventId = extractEventIdFromMessage(reaction.message.content);
  const memberId = await getMemberIdFromDiscord(user.id);

  if (!eventId || !memberId) return;

  let status: 'going' | 'maybe' | 'declined' | null = null;
  if (emoji === '✅') status = 'going';
  else if (emoji === '❓') status = 'maybe';
  else if (emoji === '❌') status = 'declined';

  if (!status) return;

  await supabase.from('event_rsvps').upsert({
    event_id: eventId,
    member_id: memberId,
    status,
  });

  console.log(`${user.username} set RSVP to ${status} for event ${eventId}`);
});

function extractEventIdFromMessage(content: string): string | null {
  const match = content.match(/event_id:([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

async function getMemberIdFromDiscord(discordId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('members')
    .select('id')
    .eq('discord_id', discordId)
    .single();

  if (error || !data) return null;
  return data.id;
}

client.login(DISCORD_TOKEN);
