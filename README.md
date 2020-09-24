# 极简 DI 实现

不需要 reflect-metadata 、Proxy
没有 Scope singleton 等功能概念

## usage

1. injectable ClassDecorator 表示被修饰的 class 是一个被 di 管理

```typescript
@injectable()
class Test {

  main: Main

  log = () => {
    console.log('this is test', this.main.name)
  }
}
```

2. inject 表示需要注入依赖, 写入元信息

```typescript
@injectable()
class Test {

  @inject(MainToken) main: Main

  log = () => {
    console.log('this is test', this.main.name)
  }
}
```

3. Token 每一个依赖都拥有各自的 Token

```typescript
@injectable()
class Test {

  @inject(MainToken) main: Main

  log = () => {
    console.log('this is test', this.main.name)
  }
}

const TestToken = new Token<ClassType<Test, any>>('test')

```

4. Container 容器

```typescript
// 绑定依赖
Container
  .bindCrate(TestToken, Test)
```

## demo

```typescript
// 循环依赖注入示例

import { Container } from './core/container'
import { inject, injectable, Token } from './core/di'

const MainToken = new Token<ClassType<Main, any>>('main')

@injectable()
class Test {

  @inject(MainToken) main: Main

  log = () => {
    console.log('this is test', this.main.name)
  }
}

const TestToken = new Token<ClassType<Test, any>>('test')

@injectable()
class Main {
  @inject(TestToken) test: Test

  name = 'looading'

  run() {
    const { log } = this.test
    log()
  }
}

Container
  .bindCrate(TestToken, Test)
  .bindCrate(MainToken, Main)

const main = new Main()

main.run()
```