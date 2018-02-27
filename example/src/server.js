import WebSocket from 'ws'
import http from 'http'
import Client from './client'

class WebSocketServer {
  constructor (messageReceiver, callback) {
    this.port = process.env.PORT || '3000'
    this.clients = new Set()
    this.http = http.createServer(callback)
    this.io = new WebSocket.Server({ server: this.http })
    this.io.on('connection', (socket, req) => {
      console.log('connection')
      const client = new Client(socket, this)
      // 接受client的消息
      messageReceiver(client)
      this.clients.add(client)
    })
  }

  start (cb) {
    return this.http.listen(this.port, cb)
  }
}

export default WebSocketServer
