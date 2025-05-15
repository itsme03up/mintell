import os
import discord
from discord.ext import commands
from supabase import create_client, Client
from dotenv import load_dotenv

# .env から読み込み
load_dotenv()
DISCORD_TOKEN = os.getenv('DISCORD_BOT_TOKEN')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')

# Supabase クライアント
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Discord クライアント
intents = discord.Intents.default()
intents.messages = True
intents.message_content = True
intents.reactions = True
intents.guilds = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Bot is ready as {bot.user}')

@bot.command()
async def ping(ctx):
    await ctx.send('Pong!')

@bot.event
async def on_reaction_add(reaction, user):
    if user.bot:
        return

    # 例: "Event RSVP event_id:12345"
    content = reaction.message.content
    event_id = extract_event_id(content)
    if not event_id:
        return

    # メンバーID（Supabaseのmembersテーブルと照合する用）
    discord_id = str(user.id)
    member_id = get_member_id(discord_id)
    if not member_id:
        print(f'Member not found for Discord ID: {discord_id}')
        return

    # リアクションによるステータス
    emoji = reaction.emoji
    status = None
    if emoji == '✅':
        status = 'going'
    elif emoji == '❓':
        status = 'maybe'
    elif emoji == '❌':
        status = 'declined'

    if status:
        # Supabaseにアップサート
        data = {
            'event_id': event_id,
            'member_id': member_id,
            'status': status
        }
        supabase.table('event_rsvps').upsert(data).execute()
        print(f'{user.name} set RSVP to {status} for event {event_id}')

def extract_event_id(content: str):
    import re
    match = re.search(r'event_id:(\d+)', content)
    return match.group(1) if match else None

def get_member_id(discord_id: str):
    response = supabase.table('members').select('id').eq('discord_id', discord_id).execute()
    if response.data:
        return response.data[0]['id']
    return None

# Bot起動
bot.run(DISCORD_TOKEN)
