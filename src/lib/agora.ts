import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng'
import type { PrayerChannel } from '../pages/ChapelPage'

const appId = import.meta.env.VITE_AGORA_APP_ID as string | undefined
const tokenServerUrl = import.meta.env.VITE_AGORA_TOKEN_SERVER_URL as string | undefined

let client: IAgoraRTCClient | null = null
let localTrack: IMicrophoneAudioTrack | null = null
let joinedChannel = ''
let joinedChannelInfo: PrayerChannel | null = null
let listeners: Array<() => void> = []

export type ChannelInfo = {
  channel: string
  name: string
  mode: string
  type: 'public' | 'private'
  password?: string
  userCount: number
}

export function isAgoraAvailable() {
  return !!appId
}

export function subscribeToJoinState(fn: () => void) {
  listeners.push(fn)
  return () => { listeners = listeners.filter(l => l !== fn) }
}

function notify() {
  listeners.forEach(fn => fn())
}

export function getActivePrayerRoom(): PrayerChannel | null {
  return joinedChannelInfo
}

export async function joinChannel(
  channelId: string,
  token: string | null,
  username: string,
  channelInfo: PrayerChannel,
  onUserJoin?: (uid: string) => void,
  onUserLeave?: (uid: string) => void,
) {
  if (client) await leaveChannel()
  joinedChannelInfo = channelInfo
  notify()

  if (!appId) return

  let rtcToken = token
  if (!rtcToken && tokenServerUrl) {
    try {
      const res = await fetch(`${tokenServerUrl}/rtc-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName: channelId, uid: username }),
      })
      const data = await res.json()
      rtcToken = data.token || data.rtcToken || null
    } catch {}
  }

  client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

  client.on('user-published', async (remoteUser, mediaType) => {
    await client?.subscribe(remoteUser, mediaType)
    if (mediaType === 'audio') remoteUser.audioTrack?.play()
    onUserJoin?.(String(remoteUser.uid))
  })
  client.on('user-unpublished', (remoteUser) => {
    onUserLeave?.(String(remoteUser.uid))
  })
  client.on('user-left', (remoteUser) => {
    onUserLeave?.(String(remoteUser.uid))
  })

  await client.join(appId, channelId, rtcToken || null, username)

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      localTrack = await AgoraRTC.createMicrophoneAudioTrack()
      break
    } catch {
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000))
      else throw new Error('Microphone access denied')
    }
  }
  await localTrack!.setMuted(true)
  await client.publish([localTrack!])

  joinedChannel = channelId
}

export async function leaveChannel() {
  if (localTrack) {
    localTrack.stop()
    localTrack.close()
    localTrack = null
  }
  if (client) {
    client.removeAllListeners()
    await client.leave()
    client = null
  }
  joinedChannel = ''
  joinedChannelInfo = null
  notify()
}

export function getJoinedChannel() {
  return joinedChannel
}

export async function startTalking() {
  if (!localTrack) return
  await localTrack.setEnabled(true)
}

export async function stopTalking() {
  if (!localTrack) return
  await localTrack.setEnabled(false)
}
