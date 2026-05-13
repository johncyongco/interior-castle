import type { IAgoraRTCClient, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng'
import type { PrayerChannel } from '../pages/ChapelPage'

const appId = import.meta.env.VITE_AGORA_APP_ID as string | undefined
const tokenServerUrl = import.meta.env.VITE_AGORA_TOKEN_SERVER_URL as string | undefined

console.log('Agora config:', { appId: appId?.slice(0, 8) + '...', tokenServerUrl })

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

  console.log('Agora: joining channel...', channelId)
  const { default: AgoraRTC } = await import('agora-rtc-sdk-ng')
  console.log('Agora: SDK loaded')

  const uid = Number(username) || Math.floor(Math.random() * 100000) + 1

  let rtcToken = token
  if (!rtcToken && tokenServerUrl) {
    try {
      const res = await fetch(`${tokenServerUrl}/rtc-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName: channelId, uid }),
      })
      const data = await res.json()
      rtcToken = data.token || data.rtcToken || null
      console.log('Agora: token received:', !!rtcToken)
    } catch (e) { console.error('Agora: token fetch failed', e) }
  }

  client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

  client.on('user-published', async (remoteUser, mediaType) => {
    try {
      await client?.subscribe(remoteUser, mediaType)
      if (mediaType === 'audio' && remoteUser.audioTrack) {
        const audioEl = new Audio()
        audioEl.srcObject = new MediaStream([remoteUser.audioTrack.getMediaStreamTrack()])
        await audioEl.play().catch(() => {})
        console.log('Agora: remote audio playing for', String(remoteUser.uid))
      }
      onUserJoin?.(String(remoteUser.uid))
      console.log('Agora: onUserJoin called, new count triggered')
    } catch (e) {
      console.error('Agora: subscribe/play failed', e)
    }
  })
  client.on('user-unpublished', (remoteUser) => {
    onUserLeave?.(String(remoteUser.uid))
  })
  client.on('user-left', (remoteUser) => {
    onUserLeave?.(String(remoteUser.uid))
  })

  try {
    await client.join(appId, channelId, rtcToken || null, uid)
    console.log('Agora: joined channel')
  } catch (err) {
    console.error('Agora join failed:', err)
    throw err
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      localTrack = await AgoraRTC.createMicrophoneAudioTrack()
      console.log('Agora: mic track created')
      break
    } catch (err) {
      console.error('Mic attempt failed:', err)
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000))
      else throw new Error('Microphone access denied')
    }
  }
  await localTrack!.setMuted(true)
  await client.publish([localTrack!])
  console.log('Agora: published track')

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
  if (!localTrack) { console.warn('startTalking: no localTrack') ; return }
  await localTrack.setMuted(false)
}

export async function stopTalking() {
  if (!localTrack) return
  await localTrack.setMuted(true)
}
