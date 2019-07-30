const test = require('ava')
const {expand} = require('./index')

test('simple OR', t => {
  const input = {
    operator: 'OR',
    children: [{ value: 1 }, { value: 2 }]
  }
  const res = expand(input)
  const expected = [[1], [2]]
  t.deepEqual(res, expected)
})

test('simple nester OR', t => {
  const input = {
    operator: 'OR',
    children: [{
      operator: 'OR',
      children: [{ value: 1 }, { value: 2 }]
    }]
  }
  const res = expand(input)
  const expected = [[1], [2]]
  t.deepEqual(res, expected)
})

test('nested OR', t => {
  const input = {
    operator: 'OR',
    children: [{
      operator: 'OR',
      children: [{ value: 1 }, { value: 2 }]
    }, {
      operator: 'OR',
      children: [{ value: 3 }, { value: 4 }]
    }]
  }
  const res = expand(input)
  const expected = [[1], [2], [3], [4]]
  t.deepEqual(res, expected)
})

test('simple AND', t => {
  const input = {
    operator: 'AND',
    children: [{ value: 1 }, { value: 2 }]
  }
  const res = expand(input)
  const expected = [[1, 2]]
  t.deepEqual(res, expected)
})

test('nested AND', t => {
  const input = {
    operator: 'AND',
    children: [{
      operator: 'AND',
      children: [{ value: 1 }, { value: 2 }]
    }, {
      operator: 'AND',
      children: [{ value: 3 }, { value: 4 }]
    }]
  }
  const res = expand(input)
  t.deepEqual(res, [[1, 2, 3, 4]])
})

test('nested AND/OR', t => {
  const input = {
    operator: 'AND',
    children: [{
      operator: 'OR',
      children: [{ value: 1 }, { value: 2 }]
    }, {
      operator: 'OR',
      children: [{ value: 3 }, { value: 4 }]
    }]
  }
  const res = expand(input)
  t.deepEqual(res, [[1, 3], [1, 4], [2, 3], [2, 4]])
})

test('nested OR/AND', t => {
  const input = {
    operator: 'OR',
    children: [{
      operator: 'AND',
      children: [{ value: 1 }, { value: 2 }]
    }, {
      operator: 'AND',
      children: [{ value: 3 }, { value: 4 }]
    }]
  }
  const res = expand(input)
  t.deepEqual(res, [[1, 2], [3, 4]])
})

test('complex OR/AND', t => {
  const input = {
    operator: 'OR',
    children: [{
      operator: 'AND',
      children: [{ value: 1 }, { value: 2 }]
    }, {
      operator: 'AND',
      children: [{ value: 3 }, { value: 4 }]
    }, {
      operator: 'OR',
      children: [{
        operator: 'AND',
        children: [{ value: 5 }, { value: 6 }]
      }, {
        operator: 'OR',
        children: [{ value: 7 }, { value: 8 }]
      }]
    }]
  }
  const res = expand(input)
  const expected = [[1, 2], [3, 4], [5, 6], [7], [8]]
  t.deepEqual(res, expected)
})

test('complex AND/OR', t => {
  const input = {
    operator: 'AND',
    children: [{
      operator: 'OR',
      children: [{ value: 1 }, { value: 2 }]
    }, {
      operator: 'OR',
      children: [{ value: 3 }, { value: 4 }]
    }, {
      operator: 'AND',
      children: [{
        operator: 'OR',
        children: [{ value: 5 }, { value: 6 }]
      }, {
        operator: 'AND',
        children: [{ value: 7 }, { value: 8 }]
      }]
    }]
  }

  const res = expand(input)
  t.deepEqual(res, [
    [1, 3, 5, 7, 8],
    [1, 3, 6, 7, 8],
    [1, 4, 5, 7, 8],
    [1, 4, 6, 7, 8],
    [2, 3, 5, 7, 8],
    [2, 3, 6, 7, 8],
    [2, 4, 5, 7, 8],
    [2, 4, 6, 7, 8]
  ])
})

test('w/ custom keys', t => {
  const input = {
    op: 'AND',
    nodes: [{
      op: 'OR',
      matches: [{
        vulnerable: true,
        cpe23Uri: 'cpe:2.3:a:google:chrome:0.1.38.1:*:*:*:*:*:*:*'
      }, {
        vulnerable: true,
        cpe23Uri: 'cpe:2.3:a:google:chrome:0.1.38.2:*:*:*:*:*:*:*'
      }, {
        vulnerable: true,
        cpe23Uri: 'cpe:2.3:a:google:chrome:0.1.38.4:*:*:*:*:*:*:*'
      }, {
        vulnerable: true,
        cpe23Uri: 'cpe:2.3:a:google:chrome:0.1.40.1:*:*:*:*:*:*:*'
      }]
    }]
  }
  const options = {
    getChildren: node => node.nodes || node.matches,
    getOperator: node => node.op,
    getValue: node => node.cpe23Uri
  }
  const res = expand(input, options)
  t.deepEqual(res, [
    ['cpe:2.3:a:google:chrome:0.1.38.1:*:*:*:*:*:*:*'],
    ['cpe:2.3:a:google:chrome:0.1.38.2:*:*:*:*:*:*:*'],
    ['cpe:2.3:a:google:chrome:0.1.38.4:*:*:*:*:*:*:*'],
    ['cpe:2.3:a:google:chrome:0.1.40.1:*:*:*:*:*:*:*']
  ])
})
