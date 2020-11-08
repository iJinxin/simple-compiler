const { readLine, close } = require('../utils/readline')

class Token {
    // 初始化 type， value
    constructor(type, value) {
        this.type = type
        this.value = value
    }
    __str__() {
        // String representation of the class instance
        return `Token(${this.type}, ${this.value})`
    }
    __repr__() {
        // return str
        return this.__str__()
    }
}

class Interpreter {
    constructor(text) {
        // pos, text, currentToken
        this.pos = 0
        this.text = text
        this.current_token = {}
        // this.token = new Token()
    }
    errors() {
        throw new Error("parsing error")
    }
    get_next_token() {
        // This method is responsible for breaking a sentence apart into tokens. One token at a time.
        const text = this.text

        if (this.pos > text.length - 1) {
            return new Token('EOF', null) // EOF ?
        }

        // 获取字符串的的单个字符
        let current_char = text.charAt(this.pos)

        // if the character is a digit then convert it to
        // integer, create an INTEGER token, increment self.pos
        // index to point to the next character after the digit,
        // and return the INTEGER token

        if (this.isNumber(current_char)) {
            let token = new Token('INTEGER', Number(current_char))
            this.pos++
            return token
        } else if (current_char == '+') {
            let token = new Token('PLUS', current_char)
            this.pos++
            return token
        } else {
            this.errors()
        }
    }
    eat(token_type) {
        // compare the current token type with the passed token
        // type and if they match then "eat" the current token
        // and assign the next token to the self.current_token,
        // otherwise raise an exception.
        if (this.current_token.type == token_type) {
            this.current_token = this.get_next_token()
        } else {
            this.errors()
        }
    }
    expr() {
        // set current token to the first token taken from the input
        this.current_token = this.get_next_token()

        let left = this.current_token
        this.eat('INTEGER')

        let op = this.current_token
        this.eat('PLUS')

        let right = this.current_token
        this.eat('INTEGER')

        return left.value + right.value
    }
    isNumber(char) {
        let reg = /\d/g
        return reg.test(char)
    }
}

async function main() {
    while (true) {
        let text;
        try {
            let text = await readLine()
            let interpreter = new Interpreter(text)
            let result = interpreter.expr()

            console.log(`${text} = ${result}`)
        } catch (e) {
            console.error(e)
            close()
            break
        }
    }
}

main()