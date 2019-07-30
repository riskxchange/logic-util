# @riskxchange/logic

Expand nested logical constructs to an array of conditional statements

## Usage

```
const {expand} = require('@riskxchange/logic-util')

const res = expand({
  operator: 'OR',
  children: [{
    operator: 'AND',
    children: [{
      operator: 'OR',
      children: [
        { value: 'apple' },
        { value: 'cherry' }
      ]
    }, {
      value: 'pie'
    }]
  }]
})

console.log(res)
/*
[
  ['apple', 'pie'],
  ['cherry', 'pie']
]
```

### Node Structure

```
type ValueNode = {
  value: any
}

type OperatorNode = {
  operator: "AND" | "OR",
  children: Node[]
}

type Node = ValueNode | OperatorNode
```
