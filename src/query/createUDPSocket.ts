import type { Socket } from 'node:dgram'
import { createSocket } from 'node:dgram'
import { Buffer } from 'node:buffer'
import handleUDPSocketError from './handleUDPSocketError'

export type RemoteDestination = {
  address: string
  port: number
}

export type RemoteInfo = RemoteDestination & {
  family: string
  size: number
}

export function createUDPSocket({
  duration,
  resolve,
  reject,
}: {
  duration: () => number
  resolve: (x: any) => unknown
  reject: (error: Error) => void
}): Socket {
  const socket: Socket = createSocket('udp4')

  socket
    .once(
      'error',
      handleUDPSocketError({
        reject,
        socket,
      })
    )
    .once('message', (message: Buffer, remoteInfo: RemoteInfo): void => {
      socket.close()
      resolve({
        message,
        latency: duration(),
        ...remoteInfo,
      })
    })

  return socket
}
