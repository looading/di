import { Token } from './token'
import { BehaviorEvent } from './event'

export class Container {
  static readonly deps =  new Map<Token<any>, Token<any>['ClassType']>()
  static readonly instances = new Map<Token<any>, InstanceType<Token<any>['ClassType']>>()
  static readonly metadata = new Map<ClassType<any>, Map<string | symbol, Token<any>>>()
  static readonly event$ = new BehaviorEvent()

  static bindDeps<T extends ClassType<any, any>>(token: Token<T>, Target: T) {
    Container.deps.set(token, Target)
    return this
  }

  static getInstance<T extends ClassType<any, any>>(token: Token<T>, cb: (instance: any)=> void) {
    if(Container.instances.has(token)) {
      return Container.instances.get(token)
    }
    if(!Container.deps.has(token)) {
      throw new Error(`未找到该依赖: ${token.key}`)
    }

    const TargetClass = Container.deps.get(token)

    Container.event$.on(TargetClass, (instance) => {
      Container.instances.set(token, instance)
      cb(instance)
    })

    new TargetClass()
  }

}