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

**actionCreator** 是一个创建并返回一个 action 对象的函数, 用于避免每次都手动编写 action 对象.

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

// 我们通常调用 actionCreator 来创建 action
const increment = () => {
  return { type: 'counter/increment' }
}
store.dispatch(increment())

console.log(store.getState())
// {value: 1}
```

#### selector

**selector** 函数可以从 store 状态树中提取指定的片段。随着应用变得越来越大，会遇到应用程序的不同部分需要读取相同的数据，selector 可以避免重复这样的读取逻辑：

```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```

组件不能直接与 redux store 对话，因为组件中不能引入 store。`useSelector` 负责为我们在幕后与 redux store 对话。 如果我们传入一个 selector 函数，`useSelector`  会为我们调用 `someSelector(store.getState())`，并返回结果。

```js
// useSelector 接受的是 selector 函数
const countPlusTwo = useSelector(state => state.counter.value + 2)
```

每次 dispatch action 并更新 redux store 时，`useSelector` 将重新执行 selector 函数。如果 selector 函数返回的值与上次不同，`useSelector` 将确保组件使用新值重新渲染。

 `useSelector` 或 `useDispatch` 的使用的 state 来源于 `<Provider>` 中的 store。

#### useSelector

用于从 redux store 读取数据

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

#### redux slice

“slice” 是应用中**单个功能**的 redux reducer 逻辑和 action 的集合, 通常一起定义在一个文件中。该名称来自于将根 redux 状态对象拆分为多个状态 “slice”。

比如，在一个博客应用中，store 的配置大致长这样：

```js
import { configureStore } from '@reduxjs/toolkit'
import usersReducer from '../features/users/usersSlice'
import postsReducer from '../features/posts/postsSlice'
import commentsReducer from '../features/comments/commentsSlice'

export default configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer
  }
})
```

例子中，`state.users`，`state.posts`，和 `state.comments` 均是 redux state 的一个 独立的 “slice”。由于 `usersReducer` 负责更新 `state.users` slice，我们将其称为 “slice reducer” 函数。

### 使用 thunk 编写异步逻辑

"thunk" 这个词是一个编程术语，意思是 ["一段做延迟工作的代码"](https://en.wikipedia.org/wiki/Thunk). 

`features/counter/counterSlice.js`

```js
// 下面这个函数就是一个 thunk ，它使我们可以执行异步逻辑
// 你可以 dispatch 异步 action `dispatch(incrementAsync(10))` 就像一个常规的 action
// 调用 thunk 时接受 `dispatch` 函数作为第一个参数
// 当异步代码执行完毕时，可以 dispatch actions

// 外部的 thunk creator 工厂函数
export const incrementAsync1 = (amount) => {
  // 内部的 thunk 函数
  return (dispatch) => {
    // thunk 内可以发起异步数据请求
    setTimeout(() => {
      // incrementByAmount 是一个同步的 actionCreator
      dispatch(incrementByAmount(amount));
    }, 1000);
  };
};
```

我们可以像使用普通 redux actionCreator 一样使用它们：

```js
store.dispatch(incrementAsync1(5))
```

调用 `dispatch()` 可以传入普通 action 对象, 函数或 Promise。

#### useDispatch

使用 `useDispatch` hooks 可以在同步或异步代码中 dispatch action。

```js
const dispatch = useDispatch()
```

`features/counter/Counter.js`

```jsx
<button onClick={() => dispatch(increment())}> + </button>
```
