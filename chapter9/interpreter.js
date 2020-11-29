// import { RESERVED_KEYWORDS } from './lexer'
const [INTEGER, EOF, PLUS, MINUS, MULTIPLY, DIVIDE, L_PAREN, R_PAREN, ASSIGN, DOT, BEGIN, END, SEMI, ID] = [
    "INTEGER",
    "EOF",
    "PLUS",
    "MINUS",
    "MULTIPLY",
    "DIVIDE",
    "L_PAREN",
    "R_PAREN",
    "ASSIGN",
    "DOT",
    "BEGIN",
    "END",
    "SEMI",
    "ID"
];
class NodeVisitor {
    visit_BinOp(node) { }
    visit_Num(node) { }
    visit(node) {
        let proto = Object.getPrototypeOf(node)

        let className = proto.constructor.name
        if (className === 'Num') {
            return this.visit_Num(node)
        } else if (className === 'UnaryOp') {
            let re = this.visit_UnaryOp(node)
            return re
        } else if (className === 'BinOp') {
            return this.visit_BinOp(node)
        } else if (className === 'Compound') {
            return this.visit_Compound(node)
        } else if (className === 'Assign') {
            return this.visit_Assign(node)
        } else if (className === 'Var') {
            return this.visit_Var(node)
        }
        // if (node.token.type === INTEGER) {
        //     return this.visit_Num(node)
        // } else {
        //     return this.visit_BinOp(node)
        // }
    }
}

class Interpreter extends NodeVisitor {
    GLOBAL_SCOPE = new Map()
    constructor(parser) {
        super()
        this.parser = parser
    }
    visit_BinOp(node) {
        if (node.op.type === PLUS) {
            return (this.visit(node.left) + (this.visit(node.right)))
        } else if (node.op.type === MINUS) {
            return this.visit(node.left) - this.visit(node.right)
        } else if (node.op.type === MULTIPLY) {
            return this.visit(node.left) * this.visit(node.right)
        } else {
            return this.visit(node.left) / this.visit(node.right)
        }
    }
    visit_UnaryOp(node) {
        let type = node.op.type
        if (type === PLUS) {
            return +(this.visit(node.expr))
        } else {
            return -(this.visit(node.expr))
        }
    }
    visit_Num(node) {
        return node.value
    }
    visit_Compound(node) {
        for (let item of node.children) {
            this.visit(item)
        }
    }
    visit_Assign(node) {
        let _key = node.left.value
        this.GLOBAL_SCOPE.set(_key, this.visit(node.right))
    }
    visit_Var(node) {
        let _key = node.value
        if (this.GLOBAL_SCOPE.has(_key)) {
            return this.GLOBAL_SCOPE.get(_key)
        } else {
            throw new Error('number error')
        }
    }
    interpreter() {
        let root = this.parser.init()
        return this.visit(root)
    }
}

// export default Interpreter
module.exports = Interpreter
