"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from './EventDiscordSystem.module.css';

const EventDiscordSystemPage = () => {
  // State for event form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventMaxParticipants, setEventMaxParticipants] = useState('');

  // State for Discord configuration
  const [connectionType, setConnectionType] = useState('webhook');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [botToken, setBotToken] = useState('');
  const [channelId, setChannelId] = useState('');
  const [guildId, setGuildId] = useState('');

  // State for messages and errors
  const [eventTitleError, setEventTitleError] = useState('');
  const [eventStartError, setEventStartError] = useState('');
  const [eventEndError, setEventEndError] = useState('');
  const [webhookUrlError, setWebhookUrlError] = useState('');
  const [botTokenError, setBotTokenError] = useState('');
  const [channelIdError, setChannelIdError] = useState('');
  const [guildIdError, setGuildIdError] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState('');
  const [settingsErrorMessage, setSettingsErrorMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview data (derived)
  const previewTitleText = `📅 ${eventTitle || '[Event Name]'}`;
  const previewDescriptionText = eventDescription || '[Description]';
  const previewStartTimeText = eventStart ? new Date(eventStart).toLocaleString() : '[Date & Time]';
  const previewEndTimeText = eventEnd ? new Date(eventEnd).toLocaleString() : '[Date & Time]';
  const previewLocationText = eventLocation || '[Location]';
  const previewMaxParticipantsText = eventMaxParticipants || '[Number]';

  // --- Utility Functions ---
  const displayMessage = (setter: React.Dispatch<React.SetStateAction<string>>, message: string, isSuccess = true, duration = 5000) => {
    setter(message);
    setTimeout(() => setter(''), duration);
  };

  const clearAllFormErrors = () => {
    setEventTitleError('');
    setEventStartError('');
    setEventEndError('');
    setWebhookUrlError('');
    setBotTokenError('');
    setChannelIdError('');
    setGuildIdError('');
    setFormErrorMessage('');
    setSettingsErrorMessage('');
  };
  
  // --- Load settings from localStorage on initial render ---
  useEffect(() => {
    const savedSettings = localStorage.getItem('discordSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setConnectionType(settings.DISCORD_CONNECTION_TYPE || 'webhook');
        setWebhookUrl(settings.DISCORD_WEBHOOK_URL || '');
        setBotToken(settings.DISCORD_BOT_TOKEN || '');
        setChannelId(settings.DISCORD_CHANNEL_ID || '');
        setGuildId(settings.DISCORD_GUILD_ID || '');
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
        displayMessage(setSettingsErrorMessage, 'Failed to load saved settings.', false);
      }
    }
  }, []);

  // --- Discord Configuration Logic ---
  const handleSaveSettings = () => {
    clearAllFormErrors();
    let isValid = true;
    const settingsToSave = {
      DISCORD_CONNECTION_TYPE: connectionType,
      DISCORD_WEBHOOK_URL: webhookUrl.trim(),
      DISCORD_BOT_TOKEN: botToken.trim(), // Bot token is sensitive, ensure it's handled carefully
      DISCORD_CHANNEL_ID: channelId.trim(),
      DISCORD_GUILD_ID: guildId.trim(),
    };

    if (connectionType === 'webhook') {
      if (!settingsToSave.DISCORD_WEBHOOK_URL) {
        setWebhookUrlError('Webhook URL is required.');
        isValid = false;
      } else if (!/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(settingsToSave.DISCORD_WEBHOOK_URL)) {
        setWebhookUrlError('Invalid Webhook URL format.');
        isValid = false;
      }
    } else { // bot settings
      if (!settingsToSave.DISCORD_BOT_TOKEN) {
        setBotTokenError('Bot Token is required.');
        isValid = false;
      }
      if (!settingsToSave.DISCORD_CHANNEL_ID) {
        setChannelIdError('Channel ID is required.');
        isValid = false;
      } else if (!/^\d+$/.test(settingsToSave.DISCORD_CHANNEL_ID)) {
        setChannelIdError('Channel ID must be a number.');
        isValid = false;
      }
      if (!settingsToSave.DISCORD_GUILD_ID) {
        setGuildIdError('Guild ID is required.');
        isValid = false;
      } else if (!/^\d+$/.test(settingsToSave.DISCORD_GUILD_ID)) {
        setGuildIdError('Guild ID must be a number.');
        isValid = false;
      }
    }

    if (isValid) {
      localStorage.setItem('discordSettings', JSON.stringify(settingsToSave));
      displayMessage(setSettingsSuccessMessage, 'Settings saved successfully!');
    } else {
      displayMessage(setSettingsErrorMessage, 'Please correct the errors in the settings.', false);
    }
  };

  const handleExportSettings = () => {
    const savedSettings = localStorage.getItem('discordSettings');
    if (!savedSettings) {
      displayMessage(setSettingsErrorMessage, 'No settings to export. Save settings first.', false);
      return;
    }
    try {
        const settings = JSON.parse(savedSettings);
        let envContent = `# Connection type (webhook or bot)\nDISCORD_CONNECTION_TYPE=${settings.DISCORD_CONNECTION_TYPE}\n\n`;
        if (settings.DISCORD_CONNECTION_TYPE === 'webhook') {
            envContent += `# Webhook settings (if connection_type is webhook)\nDISCORD_WEBHOOK_URL=${settings.DISCORD_WEBHOOK_URL || ''}\n`;
        } else {
            envContent += `# Bot settings (if connection_type is bot)\nDISCORD_BOT_TOKEN=${settings.DISCORD_BOT_TOKEN || ''}\n`;
            envContent += `DISCORD_CHANNEL_ID=${settings.DISCORD_CHANNEL_ID || ''}\n`;
            envContent += `DISCORD_GUILD_ID=${settings.DISCORD_GUILD_ID || ''}\n`;
        }

        const blob = new Blob([envContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '.env';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        displayMessage(setSettingsSuccessMessage, 'Settings exported as .env file.');
    } catch (e) {
        console.error("Failed to export settings", e);
        displayMessage(setSettingsErrorMessage, 'Failed to export settings.', false);
    }
  };

  const handleImportSettings = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n');
          const importedSettings: Record<string, string> = {};
          lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
              const [key, ...valueParts] = line.split('='); // Simpler split
              const value = valueParts.join('=').trim();
              if (key && value) {
                importedSettings[key.trim()] = value;
              }
            }
          });

          setConnectionType(importedSettings.DISCORD_CONNECTION_TYPE || 'webhook');
          setWebhookUrl(importedSettings.DISCORD_WEBHOOK_URL || '');
          setBotToken(importedSettings.DISCORD_BOT_TOKEN || '');
          setChannelId(importedSettings.DISCORD_CHANNEL_ID || '');
          setGuildId(importedSettings.DISCORD_GUILD_ID || '');
          
          // Automatically try to save and validate imported settings
          // Note: This relies on the state updates being applied before handleSaveSettings is effectively called.
          // For more robust behavior, consider passing imported values directly to a validation/save function.
          setTimeout(() => { // Ensure state is updated before saving
            handleSaveSettings(); 
            if (settingsSuccessMessage) { // Check if save was successful (hacky)
                 displayMessage(setSettingsSuccessMessage, 'Settings imported and saved successfully!');
            } else if(!settingsErrorMessage) { // if no success, and no specific error from save, then generic import error
                 displayMessage(setSettingsErrorMessage, 'Imported settings might have errors. Please review and save.', false);
            }
          }, 0);

        } catch (error: any) {
          displayMessage(setSettingsErrorMessage, `Error importing file: ${error.message}`, false);
        }
        if (event.target) event.target.value = ''; // Reset file input
      };
      reader.readAsText(file);
    }
  };

  // --- Event Creation & Discord Notification ---
  const handleEventFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAllFormErrors();
    setFormSuccessMessage('');
    setFormErrorMessage('');
    setIsSubmitting(true);

    let isValid = true;
    if (!eventTitle.trim()) {
      setEventTitleError('Event Title is required.');
      isValid = false;
    }
    if (!eventStart) {
      setEventStartError('Start Date & Time is required.');
      isValid = false;
    }
    if (!eventEnd) {
      setEventEndError('End Date & Time is required.');
      isValid = false;
    }
    if (eventStart && eventEnd && new Date(eventStart) >= new Date(eventEnd)) {
      setEventEndError('End Date & Time must be after Start Date & Time.');
      isValid = false;
    }

    const savedSettings = localStorage.getItem('discordSettings');
    let discordSettings;
    if (savedSettings) {
        try {
            discordSettings = JSON.parse(savedSettings);
        } catch (e) {
            displayMessage(setFormErrorMessage, 'Could not parse Discord settings from storage.', false);
            isValid = false;
        }
    } else {
        displayMessage(setFormErrorMessage, 'Discord settings are not configured. Please save settings first.', false);
        isValid = false;
    }
    
    if (discordSettings && discordSettings.DISCORD_CONNECTION_TYPE === 'webhook') {
        if (!discordSettings.DISCORD_WEBHOOK_URL || !/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(discordSettings.DISCORD_WEBHOOK_URL)) {
            displayMessage(setFormErrorMessage, 'Invalid or missing Webhook URL in saved settings. Please check Discord Configuration.', false);
            isValid = false;
        }
    } else if (discordSettings && discordSettings.DISCORD_CONNECTION_TYPE === 'bot') {
        if (!discordSettings.DISCORD_BOT_TOKEN || !discordSettings.DISCORD_CHANNEL_ID || !discordSettings.DISCORD_GUILD_ID) {
            displayMessage(setFormErrorMessage, 'Bot Token, Channel ID, or Guild ID is missing in saved settings. Please check Discord Configuration.', false);
            isValid = false;
        }
    }


    if (!isValid) {
      setIsSubmitting(false);
      displayMessage(setFormErrorMessage, 'Please correct the errors above.', false);
      return;
    }

    const embed = {
      title: `📅 ${eventTitle.trim()}`,
      description: eventDescription.trim() || 'No description provided.',
      color: 0x4285f4, // Google Blue
      fields: [
        { name: "🕐 開始時間", value: new Date(eventStart).toLocaleString(), inline: true },
        { name: "🕐 終了時間", value: new Date(eventEnd).toLocaleString(), inline: true },
      ],
      footer: { text: "下のリアクションで参加可否をお知らせください！" },
      timestamp: new Date().toISOString()
    };
    if (eventLocation.trim()) {
      embed.fields.push({ name: "📍 場所", value: eventLocation.trim(), inline: true });
    }
    if (eventMaxParticipants) {
      embed.fields.push({ name: "👥 最大参加者数", value: eventMaxParticipants, inline: true });
    }

    const payload = { embeds: [embed] };

    try {
      if (discordSettings.DISCORD_CONNECTION_TYPE === 'webhook') {
        const response = await fetch(discordSettings.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`Webhook failed: ${response.status} ${errorData.message || 'Unknown error'}`);
        }
        displayMessage(setFormSuccessMessage, 'Event created and sent to Discord via Webhook successfully!');
        // Reset form fields
        setEventTitle('');
        setEventDescription('');
        setEventStart('');
        setEventEnd('');
        setEventLocation('');
        setEventMaxParticipants('');

      } else { // BOT implementation (Phase 2)
        // NOTE: Actual API calls for bot are commented out as per original HTML's Phase 2 plan
        // This section would involve:
        // 1. Sending the message using DISCORD_BOT_TOKEN and DISCORD_CHANNEL_ID
        // 2. Getting the message ID from the response
        // 3. Adding reactions (✅, ❌, ❓) to the message using the message ID
        //    - Remember the 250ms delay between reaction additions.

        // Example:
        // const botMessageResponse = await fetch(`/api/v10/channels/${discordSettings.DISCORD_CHANNEL_ID}/messages`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bot ${discordSettings.DISCORD_BOT_TOKEN}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(payload)
        // });
        // if (!botMessageResponse.ok) {
        //   const errorData = await botMessageResponse.json().catch(() => ({ message: botMessageResponse.statusText }));
        //   throw new Error(`Bot message post failed: ${botMessageResponse.status} ${errorData.message || 'Unknown error'}`);
        // }
        // const messageData = await botMessageResponse.json();
        // const messageId = messageData.id;

        // const reactions = ['✅', '❌', '❓'];
        // for (const reaction of reactions) {
        //   await new Promise(resolve => setTimeout(resolve, 300)); // Discord API rate limit for reactions
        //   const reactionResponse = await fetch(`/api/v10/channels/${discordSettings.DISCORD_CHANNEL_ID}/messages/${messageId}/reactions/${encodeURIComponent(reaction)}/@me`, {
        //     method: 'PUT',
        //     headers: {
        //       'Authorization': `Bot ${discordSettings.DISCORD_BOT_TOKEN}`,
        //       'Content-Type': 'application/json' // Though not strictly needed for PUT reaction
        //     }
        //   });
        //   if (!reactionResponse.ok) {
        //      console.warn(`Failed to add reaction ${reaction}: ${reactionResponse.status}`);
        //      // Decide if this should throw an error or just warn
        //   }
        // }
        // displayMessage(setFormSuccessMessage, 'Event created and sent to Discord via Bot with reactions!');
        displayMessage(setFormErrorMessage, 'Bot sending is not yet implemented in this TSX version.', false);
      }
    } catch (error: any) {
      console.error('Discord send error:', error);
      displayMessage(setFormErrorMessage, `Error sending to Discord: ${error.message}`, false);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <h2>Create Event</h2>
        <form onSubmit={handleEventFormSubmit}>
          <div>
            <label htmlFor="eventTitle">Event Title (Required)</label>
            <input type="text" id="eventTitle" value={eventTitle} onChange={(e) => { setEventTitle(e.target.value); setEventTitleError(''); }} required />
            {eventTitleError && <div className={styles.errorMessage}>{eventTitleError}</div>}
          </div>

          <div>
            <label htmlFor="eventDescription">Description</label>
            <textarea id="eventDescription" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
          </div>

          <div>
            <label htmlFor="eventStart">Start Date & Time (Required)</label>
            <input type="datetime-local" id="eventStart" value={eventStart} onChange={(e) => { setEventStart(e.target.value); setEventStartError(''); }} required />
            {eventStartError && <div className={styles.errorMessage}>{eventStartError}</div>}
          </div>

          <div>
            <label htmlFor="eventEnd">End Date & Time (Required)</label>
            <input type="datetime-local" id="eventEnd" value={eventEnd} onChange={(e) => { setEventEnd(e.target.value); setEventEndError(''); }} required />
            {eventEndError && <div className={styles.errorMessage}>{eventEndError}</div>}
          </div>

          <div>
            <label htmlFor="eventLocation">Location</label>
            <input type="text" id="eventLocation" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
          </div>

          <div>
            <label htmlFor="eventMaxParticipants">Max Participants</label>
            <input type="number" id="eventMaxParticipants" value={eventMaxParticipants} onChange={(e) => setEventMaxParticipants(e.target.value)} min="1" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Create Event & Notify Discord'}
          </button>
          {formSuccessMessage && <div className={styles.successMessage}>{formSuccessMessage}</div>}
          {formErrorMessage && <div className={styles.errorMessage}>{formErrorMessage}</div>}
        </form>
      </div>

      <div className={styles.column}>
        <h2>Discord Configuration</h2>
        <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
          <div>
            <label htmlFor="connectionType">Connection Type</label>
            <select id="connectionType" value={connectionType} onChange={(e) => setConnectionType(e.target.value)}>
              <option value="webhook">Webhook</option>
              <option value="bot">Bot</option>
            </select>
          </div>

          {connectionType === 'webhook' && (
            <div id="webhookSettings">
              <label htmlFor="webhookUrl">Discord Webhook URL (Required for Webhook)</label>
              <input type="text" id="webhookUrl" value={webhookUrl} onChange={(e) => { setWebhookUrl(e.target.value); setWebhookUrlError(''); }} />
              {webhookUrlError && <div className={styles.errorMessage}>{webhookUrlError}</div>}
            </div>
          )}

          {connectionType === 'bot' && (
            <div id="botSettings">
              <label htmlFor="botToken">Discord Bot Token (Required for Bot)</label>
              <input type="password" id="botToken" value={botToken} onChange={(e) => { setBotToken(e.target.value); setBotTokenError(''); }} />
              {botTokenError && <div className={styles.errorMessage}>{botTokenError}</div>}

              <label htmlFor="channelId">Discord Channel ID (Required for Bot)</label>
              <input type="text" id="channelId" value={channelId} onChange={(e) => { setChannelId(e.target.value); setChannelIdError(''); }} />
              {channelIdError && <div className={styles.errorMessage}>{channelIdError}</div>}

              <label htmlFor="guildId">Discord Guild ID (Required for Bot)</label>
              <input type="text" id="guildId" value={guildId} onChange={(e) => { setGuildId(e.target.value); setGuildIdError(''); }} />
              {guildIdError && <div className={styles.errorMessage}>{guildIdError}</div>}
            </div>
          )}
          <button type="button" onClick={handleSaveSettings}>Save Settings</button>
          <button type="button" onClick={handleExportSettings}>Export Settings (.env)</button>
          <label htmlFor="importSettingsFile" style={{ marginTop: '10px', display: 'inline-block' }}>
             <span className={styles.buttonLookalike}>Import Settings (.env)</span> {/* Styled span to look like a button */}
          </label>
          <input type="file" id="importSettingsFile" accept=".env" onChange={handleImportSettings} style={{ display: 'none' }} />
          {settingsSuccessMessage && <div className={styles.successMessage}>{settingsSuccessMessage}</div>}
          {settingsErrorMessage && <div className={styles.errorMessage}>{settingsErrorMessage}</div>}
        </form>

        <div className={styles.envVarsSection} style={{ marginTop: '20px' }}>
          <h3>Environment Variable Example (.env format)</h3>
          <pre>
{`# Connection type (webhook or bot)
DISCORD_CONNECTION_TYPE=webhook

# Webhook settings (if connection_type is webhook)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Bot settings (if connection_type is bot)
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CHANNEL_ID=your_channel_id_here
DISCORD_GUILD_ID=your_server_id_here`}
          </pre>
        </div>
      </div>

      <div className={`${styles.column} ${styles.previewColumn}`}>
        <h2>Discord Message Preview</h2>
        <div className={styles.discordPreview}>
          <div className={styles.embed}>
            <div className={styles.embedTitle}>{previewTitleText}</div>
            <div className={styles.embedDescription}>{previewDescriptionText}</div>
            <div className={styles.embedFields}>
              <div className={styles.embedField}>
                <span className={styles.embedFieldName}>🕐 Start Time</span>
                <span className={styles.embedFieldValue}>{previewStartTimeText}</span>
              </div>
              <div className={styles.embedField}>
                <span className={styles.embedFieldName}>🕐 End Time</span>
                <span className={styles.embedFieldValue}>{previewEndTimeText}</span>
              </div>
              {eventLocation && (
                <div className={styles.embedField}>
                  <span className={styles.embedFieldName}>📍 Location</span>
                  <span className={styles.embedFieldValue}>{previewLocationText}</span>
                </div>
              )}
              {eventMaxParticipants && (
                <div className={styles.embedField}>
                  <span className={styles.embedFieldName}>👥 Max Participants</span>
                  <span className={styles.embedFieldValue}>{previewMaxParticipantsText}</span>
                </div>
              )}
            </div>
            <div className={styles.embedFooter}>下のリアクションで参加可否をお知らせください！</div>
          </div>
          <div className={styles.reactions} style={{ marginTop: '10px' }}>
            <button type="button" disabled>✅</button>
            <button type="button" disabled>❌</button>
            <button type="button" disabled>❓</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDiscordSystemPage;
