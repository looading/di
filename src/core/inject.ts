import { Container } from "./container"
import { Token } from "./token"


function isPropertyDecorator(arg: any[]): arg is Parameters<PropertyDecorator> {
  if(arg.length === 3) {
    return arg[2] === undefined
  }

  return arg.length === 2
}


/**
 * 表示需要注入依赖, 写入元信息
 * PropertyDecorator
 */
export const inject = <T extends ClassType<any>>(token: Token<T>): PropertyDecorator => {
  return (...arg: any[]) => {
    console.log(2)
    if(isPropertyDecorator(arg)) {

      const [ target, propertykey ] = arg
      
      if(!Container.metadata.has(target as ClassType<any>)) {
        Container.metadata.set(target as ClassType<any>, new Map())

        // throw new Error(`inject should be used within class which is decorated by injectable ClassDecorator.`)
      }

      const classMetadata = Container.metadata.get(target as ClassType<any>)

      if(classMetadata.has(propertykey)) {
        console.warn(`[inject] ${(target as ClassType<any>).name}.${propertykey.toString()} will be injected again.`)
      }

      classMetadata.set(propertykey, token)
    }
  }
}

/**
 * ClassDecorator 表示被修饰的 class 是一个被 di 管理
 */
export const injectable = () => {
  return (target: ClassType<any>): ClassType<any> => {
    console.log('1')
    class WrapperClass extends target {
      constructor(...arg) {
        super(...arg)
        
        if(!Container.metadata.has(target as ClassType<any>)) {
          Container.metadata.set(target as ClassType<any>, new Map())
        }

        const classMetadata = Container.metadata.get((target as ClassType<any>).prototype)

        /**
         * 通知依赖实例化完成，优先执行，解决循环依赖问题
         */
        Container.event$.emit(WrapperClass, this)

        /**
         * 注入依赖
         */
        classMetadata.forEach((token, proptertyKey) => {
          Container.getInstance(token, instance => {
            this[proptertyKey as any] = instance
          })
        })
      }
    }

    return WrapperClass

  }
}