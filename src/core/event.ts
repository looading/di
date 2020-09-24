export class BehaviorEvent {
  private readonly listenerMap = new Map<any, Function[]>()
  private prePayload = new Map<any, any>()
  on(name: any, cb: (...arg) => void) {
    const listeners = this.listenerMap.get(name) ?? (this.listenerMap.set(name, []), this.listenerMap.get(name))
    if(!~listeners.indexOf(cb)) {
      listeners.push(cb)
    }

    if(this.prePayload.has(name)) {
      const payload = this.prePayload.get(name)
      cb(payload)
    }
  }

  emit(name: any, payload: any) {
    const listeners = this.listenerMap.get(name) ?? []
    this.prePayload.set(name, payload)
    listeners.forEach(cb => {
      cb(payload)
    })
  }

  off(name: any, cb?: (...arg) => void) {
    if(cb) {
      const listeners = this.listenerMap.get(name) ?? []
      listeners.splice(listeners.indexOf(cb), !~listeners.indexOf(cb) ? 0 : 1)
    }

    this.listenerMap.delete(name)
  }

}