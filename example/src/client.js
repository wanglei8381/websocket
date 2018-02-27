class Client {
  constructor (socket) {
    this.id = socket.id
    this.socket = socket

    socket.on('message', data => {
      console.log(data)
      data = JSON.parse(data)
      data.payload.ok = true
      socket.send(JSON.stringify(data))
    })

    socket.on('error', () => {
      console.log('error')
    })

    socket.on('close', () => {
      console.log('close')
    })
  }

  connect () {
    this.on('hello', data => {
      console.log(data)
      this.emit('hello')
    })
  }

  on (msg, callback) {
    callback = this.bind(callback)
    this.socket.on(msg, (...args) => {
      callback(...args)
    })
  }

  emit (msg, ...data) {
    this.socket.emit(msg, ...data)
  }

  broadcast (msg, ...data) {}
}

export default Client
