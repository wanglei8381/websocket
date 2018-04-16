# websocket

websocket客户端

### Use
```js
var ws = new WebSocketIO("ws://127.0.0.1:3000/socket.io", ['chat', 'superchat'], {
  debug: true
});

ws.write('hello', { id: 1 })

ws.on('hello', function (data) {
  console.log('hello', data)
})
```