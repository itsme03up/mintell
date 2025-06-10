// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

// Custom hook for events with RSVPs
export const useEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('events')
        .select(
          `*, event_rsvps(id, status, discord_reaction, member_id, discord_user_id, responded_at)`
        )
        .order('start_time', { ascending: true })
      if (err) throw err
      setEvents(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData, selectedMembers = []) => {
    try {
      setLoading(true)
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          start_time: new Date(eventData.start_time).toISOString(),
          end_time: eventData.end_time ? new Date(eventData.end_time).toISOString() : null,
          location: eventData.location,
          max_participants: eventData.max_participants ? parseInt(eventData.max_participants) : null,
          party_id: eventData.party_id ? parseInt(eventData.party_id) : null,
        })
        .select()
        .single()
      if (eventError) throw eventError

      if (selectedMembers.length > 0) {
        const rsvpData = selectedMembers.map(member => ({
          event_id: event.id,
          member_id: member.id,
          status: 'invited'
        }))
        const { error: rsvpError } = await supabase.from('event_rsvps').insert(rsvpData)
        if (rsvpError) throw rsvpError
      }

      await sendDiscordNotification(event, selectedMembers)
      await fetchEvents()
      return event
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (eventId) => {
    try {
      setLoading(true)
      const { error: delError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
      if (delError) throw delError
      await fetchEvents()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    const subscription = supabase
      .channel('events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_rsvps' }, fetchEvents)
      .subscribe()
    return () => subscription.unsubscribe()
  }, [])

  return { events, loading, error, createEvent, deleteEvent, refetch: fetchEvents }
}

// Custom hook for members
export const useMembers = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error: err } = await supabase.from('members').select('*').order('full_name')
        if (err) throw err
        setMembers(data || [])
      } catch (err) {
        setError(err.message)
        console.error('Error fetching members:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  return { members, loading, error }
}

// Custom hook for parties
export const useParties = () => {
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const { data, error: err } = await supabase
          .from('parties')
          .select(`*, party_members(member_id, role, members(id, full_name))`)
          .order('name')
        if (err) throw err
        setParties(data || [])
      } catch (err) {
        setError(err.message)
        console.error('Error fetching parties:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchParties()
  }, [])

  return { parties, loading, error }
}

// Helper for Discord notifications
const sendDiscordNotification = async (event, participants = []) => {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL
    if (!webhookUrl) return
    const embed = { /* ... omitted for brevity ... */ }
    const payload = { content: "新しいイベントが作成されました！", embeds: [embed] }
    const res = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error('Discord notification failed')
    const result = await res.json()
    if (result.id) {
      await supabase.from('events').update({ discord_message_id: result.id }).eq('id', event.id)
    }
    return result
  } catch (err) {
    console.error('Error sending Discord notification:', err)
  }
}
