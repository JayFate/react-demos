## redux

#### action

**action** 是一个具有 `type` 字段的普通 JavaScript 对象, 用于描述应用程序中发生了什么的事件.

```js
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}
```

#### actionCreator

**actionCreator** 是一个创建并返回一个 action 对象的函数, 用于每次都手动编写 action 对象.

```js
const addTodo = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  }
}
```

#### reducer

**reducer** 是一个函数，函数签名是：`(state, action) => newState`. 接收当前的 `state` 和一个 `action` 对象，根据接收到的 action（事件）类型更新状态，并返回新状态。

"reducer" 函数的名字来源是因为它和 [`Array.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) 函数使用的回调函数很类似。

reducer 必需符合以下规则：

- 仅使用 `state` 和 `action` 参数计算新的状态值
- 禁止直接修改 `state`。必须通过复制现有的 `state` 并对复制的值进行更改的方式来做 *不可变更新*。
- 禁止任何异步逻辑、依赖随机值或导致其他“副作用”的代码

reducer 函数内部的逻辑通常遵循以下步骤：

- 检查 reducer 是否处理这个 action
- 如果是，则复制 state，使用新值更新 state 副本，然后返回新 state
- 否则，返回原来的 state 不变

下面是 reducer 的小例子，展示了每个 reducer 应该遵循的步骤：

```js
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  // 检查 reducer 是否处理这个 action
  if (action.type === 'counter/increment') {
    // 如果是，复制 `state`
    return {
      ...state,
      // 使用新值更新 state 副本
      value: state.value + 1
    }
  }
  // 返回原来的 state 不变
  return state
}
```

#### store

redux 应用的 state 存在于一个名为 **store** 的对象中。

store 是通过传入一个 reducer 来创建的，并且有 `getState` 方法和 `dispatch` 方法。

- `getState` 它返回当前 state
- `dispatch` 更新 state 的唯一方法是调用 `store.dispatch()` 并传入一个 action 对象,  执行 reducer 函数并计算出更新后的 state

```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}

store.dispatch({ type: 'counter/increment' })

console.log(store.getState())
// {value: 1}
```

我们通常调用 actionCreator 来创建 action：

```js
const increment = () => {
  return {
    type: 'counter/increment'
  }
}

store.dispatch(increment())

console.log(store.getState())
// {value: 2}
```

#### selector

**selector** 函数可以从 store 状态树中提取指定的片段。随着应用变得越来越大，会遇到应用程序的不同部分需要读取相同的数据，selector 可以避免重复这样的读取逻辑：

```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```

### redux 数据流

早些时候，我们谈到了“单向数据流”，它描述了更新应用程序的以下步骤序列：

- state 描述了应用程序在特定时间点的状况
- 基于 state 来渲染视图
- 当发生某些事情时（例如用户单击按钮），state 会根据发生的事情进行更新
- 基于新的 state 重新渲染视图

具体来说，对于 Redux，我们可以将这些步骤分解为更详细的内容：

- 初始启动：
  - 使用最顶层的 root reducer 函数创建 Redux store
  - store 调用一次 root reducer，并将返回值保存为它的初始 `state`
  - 当视图 首次渲染时，视图组件访问 Redux store 的当前 state，并使用该数据来决定要呈现的内容。同时监听 store 的更新，以便他们可以知道 state 是否已更改。
- 更新环节：
  - 应用程序中发生了某些事情，例如用户单击按钮
  - dispatch 一个 action 到 Redux store，例如 `dispatch({type: 'counter/increment'})`
  - store 用之前的 `state` 和当前的 `action` 再次运行 reducer 函数，并将返回值保存为新的 `state`
  - store 通知所有订阅过的视图，通知它们 store 发生更新
  - 每个订阅过 store 数据的视图 组件都会检查它们需要的 state 部分是否被更新。
  - 发现数据被更新的每个组件都强制使用新数据重新渲染，紧接着更新网页
