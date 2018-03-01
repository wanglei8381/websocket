import EventEmitter from 'events'
import WebSocket from 'ws'
class Client extends EventEmitter {
  constructor (socket, server) {
    super()
    this.id = socket.id
    this.socket = socket
    socket.client = this
    this.server = server

    socket.on('message', data => {
      data = JSON.parse(data)
      this.emit(data.type, data.payload)
    })

    socket.on('error', err => {
      this.emit('error', err)
    })

    socket.on('close', () => {
      this.emit('close')
    })
  }

  send (type, payload) {
    this.socket.send(JSON.stringify({ type, payload }))
  }

  broadcast (type, payload) {
    const sockets = this.server.io.clients
    for (let socket of sockets) {
      if (socket !== this.socket && socket.readyState === WebSocket.OPEN) {
        socket.client.send(type, payload)
      }
    }
  }
}

export default Client
