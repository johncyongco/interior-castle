import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng'

const appId = import.meta.env.VITE_AGORA_APP_ID as string | undefined

let client: IAgoraRTCClient | null = null
let localTrack: IMicrophoneAudioTrack | null = null
let joinedChannel = ''

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

export async function joinChannel(
  channel: string,
  token: string | null,
  username: string,
  onUserJoin?: (uid: string) => void,
  onUserLeave?: (uid: string) => void,
) {
  if (!appId) throw new Error('Agora App ID not configured')
  if (client) await leaveChannel()

  client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })
  client.setClientRole('audience')

  client.on('user-joined', (user) => onUserJoin?.(String(user.uid)))
  client.on('user-left', (user) => onUserLeave?.(String(user.uid)))

  await client.join(appId, channel, token || null, username)

  localTrack = await AgoraRTC.createMicrophoneAudioTrack()
  await client.setClientRole('host')
  await client.publish(localTrack)

  joinedChannel = channel
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
}

export function getJoinedChannel() {
  return joinedChannel
}
