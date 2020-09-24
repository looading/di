
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

const main = new Main()

main.run()