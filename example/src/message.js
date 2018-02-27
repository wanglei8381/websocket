export default function messageReceiver (client) {
  client.on('hello', data => {
    client.send('hello', { ok: true })
  })

  client.on('chat', data => {
    client.broadcast('chat', data)
  })
}