const {
    PROGRAM,
    BEGIN,
    END,
    DOT,
    VAR,
    COLON,
    COMMA,
    INTEGER,
    REAL,
    INTEGER_CONST,
    REAL_CONST,
    INTEGER_DIV,
    FLOAT_DIV,
    EOF,
    PLUS,
    MINUS,
    MUL,
    DIV,
    L_PAREN,
    R_PAREN,
    ID,
    SEMI,
    ASSIGN
} = require('./var')

class NodeVisitor {
    visit_BinOp(node) { }
    visit_Num(node) { }
    visit(node) {
        let proto
        try {
            proto = Object.getPrototypeOf(node)
        } catch (e) {
            console.log(node)
            console.log(e)
        }

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
        } else if (className === 'Program') {
            return this.visit_Program(node)
        } else if (className === 'Block') {
            return this.visit_Block(node)
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
    visit_Program(node) {
        this.visit_Block(node.block)
    }
    visit_Block(node) {
        for (let declaration of node.declarations) {
            this.visit(declaration)
        }
        this.visit(node.compound_statement)
    }
    visit_VarDecl() {

    }
    visit_Type() {

    }
    visit_BinOp(node) {
        if (node.op.type === PLUS) {
            return (this.visit(node.left) + (this.visit(node.right)))
        } else if (node.op.type === MINUS) {
            return this.visit(node.left) - this.visit(node.right)
        } else if (node.op.type === MUL) {
            return this.visit(node.left) * this.visit(node.right)
        } else if (node.op.type === INTEGER_DIV) {
            return Math.round(this.visit(node.left) / this.visit(node.right))
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
        console.log('============ \n')
        console.log(root)
        console.log(root.block.declarations)
        console.log(root.block.compound_statement)
        return this.visit(root)
    }
}

// export default Interpreter
module.exports = Interpreter
