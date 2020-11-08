// Stack
class Stack {
    constructor() {
        this.top = 0
        this.stack = []
    }
    push(char) {
        this.stack.push(char)
        this.top++
        return this.stack
    }
    pop() {
        if (this.top == 0) {
            throw new Error("empty stack can not pop!")
        }
        let topValue = this.stack.splice(this.top, 1)
        this.top--;

        return topValue
    }
    getTop() {
        if (this.top == 0) return null
        return this.stack[this.top-1]
    }
    getHeight() {
        return this.top
    }
    emptyStack() {
        this.top = 0
        this.stack = []
    }
}

class NumberStack extends Stack {
    constructor() {
        super()
    }
    caculate() {
        if (this.top == 0) return 0

        let height = this.getHeight()
        let sum = 0
        while(this.top != 0) {
            let power = 10**(height - this.top) // 幂
            let topValue = this.getTop()
            sum += topValue * power

            this.top--
        }
        this.emptyStack()
        return sum
    }
}

module.exports = {
    Stack,
    NumberStack
}