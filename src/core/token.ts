const DISymbol = Symbol('di')

export class Token<T extends ClassType<any, any>> {
    symbol = DISymbol

    ClassType: T
    constructor(
        public readonly key: string
    ) {}
}