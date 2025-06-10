import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';

interface PreviewData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: string;
}

const EventDiscordSystem: React.FC = () => {
  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventMaxParticipants, setEventMaxParticipants] = useState<number | ''>('');

  // Config state
  const [connectionType, setConnectionType] = useState<'webhook' | 'bot'>('webhook');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [botToken, setBotToken] = useState('');
  const [channelId, setChannelId] = useState('');
  const [guildId, setGuildId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview
  const [preview, setPreview] = useState<PreviewData>({
    title: '📅 [Event Name]',
    description: '[Description]',
    startTime: '[Date & Time]',
    endTime: '[Date & Time]',
    location: '[Location]',
    maxParticipants: '[Number]',
  });

  // Handlers
  const handleEventChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'eventTitle': setEventTitle(value); break;
      case 'eventDescription': setEventDescription(value); break;
      case 'eventStart': setEventStart(value); break;
      case 'eventEnd': setEventEnd(value); break;
      case 'eventLocation': setEventLocation(value); break;
      case 'eventMaxParticipants': setEventMaxParticipants(value === '' ? '' : Number(value)); break;
    }
  };

  const handleConfigChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'connectionType': setConnectionType(value as any); break;
      case 'webhookUrl': setWebhookUrl(value); break;
      case 'botToken': setBotToken(value); break;
      case 'channelId': setChannelId(value); break;
      case 'guildId': setGuildId(value); break;
    }
  };

  const handleEventSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: submit event and notify Discord
  };
  const handleSaveSettings = () => {
    // TODO: save config settings
  };
  const handleExportSettings = () => {
    // TODO: generate .env export
  };
  const handleImportSettings = () => {
    fileInputRef.current?.click();
  };
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // TODO: import .env contents
  };

  // Update preview when inputs change
  useEffect(() => {
    setPreview({
      title: `📅 ${eventTitle || '[Event Name]'}`,
      description: eventDescription || '[Description]',
      startTime: eventStart || '[Date & Time]',
      endTime: eventEnd || '[Date & Time]',
      location: eventLocation || '[Location]',
      maxParticipants: eventMaxParticipants ? String(eventMaxParticipants) : '[Number]',
    });
  }, [eventTitle, eventDescription, eventStart, eventEnd, eventLocation, eventMaxParticipants]);

  return (
    <div className="container">
      <div className="column">
        <h2>Create Event</h2>
        <form onSubmit={handleEventSubmit}>
          <label htmlFor="eventTitle">Event Title (Required)</label>
          <input id="eventTitle" name="eventTitle" type="text" value={eventTitle} onChange={handleEventChange} required />

          <label htmlFor="eventDescription">Description</label>
          <textarea id="eventDescription" name="eventDescription" value={eventDescription} onChange={handleEventChange} />

          <label htmlFor="eventStart">Start Date & Time (Required)</label>
          <input id="eventStart" name="eventStart" type="datetime-local" value={eventStart} onChange={handleEventChange} required />

          <label htmlFor="eventEnd">End Date & Time (Required)</label>
          <input id="eventEnd" name="eventEnd" type="datetime-local" value={eventEnd} onChange={handleEventChange} required />

          <label htmlFor="eventLocation">Location</label>
          <input id="eventLocation" name="eventLocation" type="text" value={eventLocation} onChange={handleEventChange} />

          <label htmlFor="eventMaxParticipants">Max Participants</label>
          <input id="eventMaxParticipants" name="eventMaxParticipants" type="number" value={eventMaxParticipants} onChange={handleEventChange} min={1} />

          <button type="submit">Create Event & Notify Discord</button>
        </form>
      </div>

      <div className="column">
        <h2>Discord Configuration</h2>
        <div>
          <label htmlFor="connectionType">Connection Type</label>
          <select id="connectionType" name="connectionType" value={connectionType} onChange={handleConfigChange}>
            <option value="webhook">Webhook</option>
            <option value="bot">Bot</option>
          </select>
        </div>
        {connectionType === 'webhook' && (
          <div>
            <label htmlFor="webhookUrl">Discord Webhook URL</label>
            <input id="webhookUrl" name="webhookUrl" type="text" value={webhookUrl} onChange={handleConfigChange} />
          </div>
        )}
        {connectionType === 'bot' && (
          <>
            <div>
              <label htmlFor="botToken">Bot Token</label>
              <input id="botToken" name="botToken" type="password" value={botToken} onChange={handleConfigChange} />
            </div>
            <div>
              <label htmlFor="channelId">Channel ID</label>
              <input id="channelId" name="channelId" type="text" value={channelId} onChange={handleConfigChange} />
            </div>
            <div>
              <label htmlFor="guildId">Guild ID</label>
              <input id="guildId" name="guildId" type="text" value={guildId} onChange={handleConfigChange} />
            </div>
          </>
        )}
        <button type="button" onClick={handleSaveSettings}>Save Settings</button>
        <button type="button" onClick={handleExportSettings}>Export Settings (.env)</button>
        <button type="button" onClick={handleImportSettings}>Import Settings (.env)</button>
        <input type="file" accept=".env" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileChange} />
      </div>

      <div className="column preview-column">
        <h2>Discord Message Preview</h2>
        <div className="discord-preview">
          <div className="embed">
            <div className="embed-title">{preview.title}</div>
            <div className="embed-description">{preview.description}</div>
            <div className="embed-field">
              <span className="embed-field-name">🕐 Start Time</span>
              <span className="embed-field-value">{preview.startTime}</span>
            </div>
            <div className="embed-field">
              <span className="embed-field-name">🕐 End Time</span>
              <span className="embed-field-value">{preview.endTime}</span>
            </div>
            <div className="embed-field">
              <span className="embed-field-name">📍 Location</span>
              <span className="embed-field-value">{preview.location}</span>
            </div>
            <div className="embed-field">
              <span className="embed-field-name">👥 Max Participants</span>
              <span className="embed-field-value">{preview.maxParticipants}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container { display: flex; flex-wrap: wrap; gap: 20px; width: 90%; max-width: 1200px; margin: auto; }
        .column { flex: 1; min-width: 300px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .preview-column .discord-preview { background: #36393f; color: #dcddde; border-radius: 5px; padding: 15px; }
        .embed { background: #2f3136; border-left: 4px solid #4285f4; padding: 10px; border-radius: 4px; }
        .embed-title { color: #fff; font-weight: bold; font-size: 1.1em; }
        label { display: block; margin-top: 10px; font-weight: bold; color: #555; }
        input, textarea, select, button { margin-top: 5px; width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: linear-gradient(to right,#4285f4,#34a853); color: #fff; cursor: pointer; }
        @media(max-width:768px){ .container{flex-direction:column;} }
      `}</style>
    </div>
  );
};

export default EventDiscordSystem;
