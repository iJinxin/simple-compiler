/**
 * 
 */
class Token{
    constructor(type, value) {
        this.type = type
        this.value = value
    }
}

class Lexer {
    constructor(text) {
        this.pos = 0
        this.text = text
        this.current_char = text.charAt(0)
    }
    error() {
        throw new Error('character error!')
    }
    advance() {
        this.pos += 1
        if (this.pos > this.text.length - 1) {
            this.current_char = null
        } else {
            this.current_char = this.text.charAt(this.pos)
        }
    }
    integer() {
        let result = ""
        while (this.current_char !== null && this.isNumber(this.current_char)) {
            result += this.current_char
            this.advance()
        }
        return Number(result)
    }

    get_next_token() {
        while (this.current_char !== null) {
            if (this.isNumber(this.current_char)) {
                return new Token(INTEGER, this.integer())
            } else if (this.current_char === " ") {
                this.advance()
            } else if (this.current_char === '+') {
                this.advance()
                return new Token(PLUS, '+')
            } else if (this.current_char === '-') {
                this.advance()
                return new Token(MINUS, '-')
            } else if (this.current_char === '*') {
                this.advance()
                return new Token(MULTIPLY, '*')
            } else if (this.current_char === '/') {
                this.advance()
                return new Token(DIVIDE, '/')
            } else if (this.current_char === '(') {
                this.advance()
                return new Token(L_PAREN, '(')
            } else if (this.current_char === ')') {
                this.advance()
                return new Token(R_PAREN, ')')
            } else {
                this.error()
            }
        }
        return new Token(EOF, null)
    }
    isNumber(char) {
        let reg = /\d/g
        return reg.test(char)
    }
}

class AST {

}

class BinOp {
    // 非叶子结点
    constructor(left, op, right) {
        this.left = left
        this.token = op
        this.right = right
    }
}

class Num {
    // 叶子结点 INTEGER
    constructor(token) {
        this.token = token
        this.value = token.value
    }
}

class Parser {
    constructor(lexer) {
        this.lexer = lexer
        this.current_token = lexer.get_next_token()
    }
    error() {
        throw new Error("parse error!")
    }
    eat(token_type) {
        if (this.current_char.type === token_type) {
            this.current_token = this.lexer.get_next_token()
        } else {
            this.error()
        }
    }
    factor() {
        let token = this.current_token
        if (token.type === INTEGER) {
            this.eat(INTEGER)
            return new Num(token)
        } else if (token.type === L_PAREN) {
            this.eat(L_PAREN)
            let node = this.expr()
            this.eat(R_PAREN)

            return node
        }
    }
    term() {
        let node = this.factor()
        while ([MULTIPLY, DIVIDE].includes(this.current_token.type)) {
            let token = this.current_token
            this.eat(token.type)

            node = new BinOp(node, token, this.factor())
        }
        return node
    }
    expr() {
        let node = this.term()

        while ([PLUS, MINUS].includes(this.current_token.type)) {
            let token = this.current_token
            this.eat(token.type)

            node = new BinOp(node, token, this.term())
        }
        return node
    }
}

class NodeVisitor{
    
}

class Interpreter {

}