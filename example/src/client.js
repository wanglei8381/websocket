import EventEmitter from 'events'
class Client extends EventEmitter {
  constructor (socket, server) {
    super()
    this.id = socket.id
    this.socket = socket
    this.server = server

    socket.on('message', data => {
      data = JSON.parse(data)
      this.emit(data.type, data.payload)
    })

    socket.on('error', err => {
      this.emit('error', err)
    })

    socket.on('close', () => {
      this.server.clients.delete(this)
      this.emit('close')
    })
  }

  send (type, payload) {
    this.socket.send(JSON.stringify({ type, payload }))
  }

  broadcast (type, payload) {
    const clients = this.server.clients
    for (let client of clients) {
      if (client !== this) {
        client.send(type, payload)
      }
    }
  }
}

export default Client
