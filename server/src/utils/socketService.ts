import { Server as SocketIOServer } from 'socket.io'

let ioInstance: SocketIOServer | null = null

export const setSocketIO = (io: SocketIOServer) => {
  ioInstance = io
}

export const getSocketIO = (): SocketIOServer | null => {
  return ioInstance
}

/**
 * Emit event to all connected clients
 */
export const emitToAll = (event: string, data: any) => {
  if (ioInstance) {
    ioInstance.emit(event, data)
  }
}

/**
 * Emit event to a specific user
 */
export const emitToUser = (userId: string, event: string, data: any) => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, data)
  }
}

/**
 * Emit event to all admins
 */
export const emitToAdmins = (event: string, data: any) => {
  if (ioInstance) {
    ioInstance.to('admin').emit(event, data)
  }
}

/**
 * Emit event to a specific room
 */
export const emitToRoom = (room: string, event: string, data: any) => {
  if (ioInstance) {
    ioInstance.to(room).emit(event, data)
  }
}

