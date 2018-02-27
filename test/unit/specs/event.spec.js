import Event from '../../../src/event'
describe('event', () => {
  it('new Event', function () {
    const context = {}
    const event = new Event(context)
    expect(event._events).toEqual({})
    expect(event._ctx).toBe(context)
  })

  it('event.on', function () {
    const event = new Event()
    const noop = jest.fn()
    event.on('name', noop)
    event.on('name', noop)
    expect(event._events.name.length).toBe(2)
    event.emit('name')
    event.emit('name')
    expect(noop).toHaveBeenCalledTimes(4)

    event.on('msg', function (val) {
      expect(val).toBe(1)
    })
    event.emit('msg', 1)

    const ctx = { a: 2 }
    event.on(
      'msg1',
      function (val) {
        expect(val).toBe(1)
        expect(this.a).toBe(2)
      },
      ctx
    )
    event.emit('msg1', 1)

    expect(event.on()).toBe(event)
    expect(event.on({})).toBe(event)
    expect(event.on('name', [])).toBe(event)
  })

  it('event.once', function () {
    const event = new Event()
    const noop = jest.fn()
    event.once('name', noop)
    event.once('name', noop)
    expect(event._events.name.length).toBe(2)
    event.emit('name')
    event.emit('name')
    expect(noop).toHaveBeenCalledTimes(2)

    event.once('msg', function (val) {
      expect(val).toBe(1)
    })
    event.emit('msg', 1)
    event.emit('msg', 2)

    const ctx = { a: 2 }
    event.once(
      'msg1',
      function (val) {
        expect(val).toBe(1)
        expect(this.a).toBe(2)
      },
      ctx
    )
    event.emit('msg1', 1)
    event.emit('msg1', 2)
  })

  it('event.off', function () {
    const event = new Event()
    const noop = jest.fn()
    event.on('msg1', noop)
    event.on('msg2', noop)
    event.emit('msg1 msg2')
    expect(noop).toHaveBeenCalledTimes(2)
    event.off('msg1')
    event.emit('msg1 msg2')
    expect(noop).toHaveBeenCalledTimes(3)

    const fn = jest.fn()
    const fn2 = jest.fn()
    const ctx = {}
    event.on('msg3', fn)
    event.on('msg3', fn2)
    event.on('msg3', fn, ctx)
    event.emit('msg3')
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn2).toHaveBeenCalledTimes(1)
    event.off('msg3', fn2)
    event.emit('msg3')
    expect(fn).toHaveBeenCalledTimes(4)
    expect(fn2).toHaveBeenCalledTimes(1)
    event.off('msg3', fn, ctx)
    event.emit('msg3')
    expect(fn).toHaveBeenCalledTimes(5)
    expect(fn2).toHaveBeenCalledTimes(1)
    event.off('msg3')
    event.emit('msg3')
    expect(fn).toHaveBeenCalledTimes(5)
    expect(fn2).toHaveBeenCalledTimes(1)
    expect(event._events.msg3.length).toBe(0)

    event.on('msg5', noop)
    event.on('msg6', noop)
    event.on('msg7', noop)
    expect(event._events.msg5.length).toBe(1)
    expect(event._events.msg6.length).toBe(1)
    expect(event._events.msg7.length).toBe(1)
    event.off()
    expect(event._events.msg5.length).toBe(0)
    expect(event._events.msg6.length).toBe(0)
    expect(event._events.msg7.length).toBe(0)

    // 卸载其他的互相不影响
    event.on('msg8', noop)
    event.off('msg9')
    expect(event._events.msg8.length).toBe(1)
  })

  it('event.pause', function () {
    const event = new Event()
    const noop = jest.fn()
    const fn = jest.fn()
    const ctx = {}
    event.on('msg1', noop)
    event.on('msg1', noop, ctx)
    event.on('msg1', fn)
    event.emit('msg1')
    expect(noop).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledTimes(1)
    event.pause('msg1')
    event.emit('msg1')
    expect(noop).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledTimes(1)

    event.resume('msg1')
    event.emit('msg1')
    expect(noop).toHaveBeenCalledTimes(4)
    expect(fn).toHaveBeenCalledTimes(2)

    event.pause('msg1', noop)
    event.emit('msg1')
    expect(noop).toHaveBeenCalledTimes(4)
    expect(fn).toHaveBeenCalledTimes(3)

    event.resume('msg1')
    event.pause('msg1', noop, ctx)
    event.emit('msg1')
    expect(noop).toHaveBeenCalledTimes(5)
    expect(fn).toHaveBeenCalledTimes(4)
  })

  it('event.resume', function () {
    const event = new Event()
    const noop = jest.fn()
    const fn = jest.fn()
    const foo = jest.fn()
    const ctx = {}
    event.on('msg1', noop)
    event.on('msg2', fn)
    event.on('msg3', foo, ctx)
    event.pause()
    event.emit('msg1 msg2 msg3')
    expect(noop).toHaveBeenCalledTimes(0)
    expect(fn).toHaveBeenCalledTimes(0)
    expect(foo).toHaveBeenCalledTimes(0)

    event.resume('msg1 msg2', noop)
    event.emit('msg1 msg2 msg3')
    expect(noop).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledTimes(0)
    expect(foo).toHaveBeenCalledTimes(0)

    event.resume('msg2 msg3', foo, ctx)
    event.emit('msg1 msg2 msg3')
    expect(noop).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledTimes(0)
    expect(foo).toHaveBeenCalledTimes(1)

    event.resume('msg2')
    event.emit('msg1 msg2 msg3')
    expect(noop).toHaveBeenCalledTimes(3)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(foo).toHaveBeenCalledTimes(2)

    event.pause()
    event.emit('msg1 msg2 msg3')
    event.resume()
    event.emit('msg1 msg2 msg3')
    expect(noop).toHaveBeenCalledTimes(4)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(foo).toHaveBeenCalledTimes(3)
  })

  it('event.emit', function () {
    const ctx = { a: 1 }
    const ctx2 = { a: 2 }
    const event = new Event(ctx)
    event.on('msg', function (val) {
      expect(val).toBe(3)
      expect(this.a).toBe(1)
    })

    event.on(
      'msg',
      function (val) {
        expect(val).toBe(3)
        expect(this.a).toBe(2)
      },
      ctx2
    )
    event.on('msg', 3)
    // 触发空时什么都不发生
    expect(event.emit()).toBe(event)
  })
})
