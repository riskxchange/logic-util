const CHILDREN_KEY = 'children'
const OPERATOR_KEY = 'operator'
const VALUE_KEY = 'value'

function expand (node, options = {}) {
  const children = getChildren(node, options)
  if (children) {
    const conditionList = children.map(c => expand(c, options))
    const operator = getOperator(node, options)
    if (operator === 'OR') return or(conditionList)
    if (operator === 'AND') return and(conditionList)
  }
  const value = getValue(node, options)
  return [[value]]
}

function getOperator (node, options) {
  return options.getOperator ? options.getOperator(node) : node[OPERATOR_KEY]
}

function getValue (node, options) {
  return options.getValue ? options.getValue(node) : node[VALUE_KEY]
}

function getChildren (node, options) {
  return options.getChildren ? options.getChildren(node) : node[CHILDREN_KEY]
}

function or (conditions) {
  return conditions.reduce((acc, c) => [...acc, ...c], [])
}

function and (conditions) {
  if (conditions.length === 1) return conditions[0]
  const [row1, row2, ...rest] = conditions
  if (!rest.length) {
    const row1 = conditions[0]
    const row2 = conditions[1]
    const output = []
    row1.forEach(r1 => {
      row2.forEach(r2 => {
        output.push([].concat(r1).concat(r2))
      })
    })
    return output
  }
  return and([and([row1, row2]), ...rest])
}

module.exports = { expand }
