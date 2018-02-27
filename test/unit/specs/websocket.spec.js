import WebSocketIO from '../../../src'
describe('WebSocketIO', () => {
  it('new WebSocketIO', function () {
    const event = new WebSocketIO(
      'ws://127.0.0.1:3000/socket.io',
      ['chat', 'superchat'],
      {
        debug: false
      }
    )
    expect(event._events).toEqual({})
    expect(event._cxt).toBeUndefined()
  })
})
