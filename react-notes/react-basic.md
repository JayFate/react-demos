# React组件基础

自定义组件的组件名**必须首字母大写**，react内部会根据这个来判断是组件还是普通的HTML标签

1. 函数组件
2. 类组件

```jsx
// 引入React
import React from 'react'

// 类组件
class HelloC extends React.Component {
  render () {
    return <div>这是我的第一个类组件!</div>
  }
}

// 函数组件
function App () {
  return (
    <div className="App">
      {/* 渲染类组件 */}
      <HelloC />
      <HelloC></HelloC>
    </div>
  )
}
export default App
```

**约定说明**

1. 类组件应该继承 React.Component 父类，从而使用父类中提供的方法或属性
2. 类组件必须提供 render 方法 **render 方法必须有返回值，表示该组件的 UI 结构**

## 组件的事件绑定

### 1.函数组件

```jsx
import React from 'react';

const TestComponent = () => {
  const list = [
    {
      id: 1001,
      name: 'react',
    },
    {
      id: 1002,
      name: 'vue',
    },
  ];
  const onDel = (e, id) => {
    console.log(e, id);
  };

  return (
    <ul>
      {list.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={e => onDel(e, item.id)}>x</button>
        </li>
      ))}
    </ul>
  );
};

function App() {
  return (
    <div>
      <TestComponent />
    </div>
  );
}

export default App;
```

### 2.类组件

```js
import React from 'react';
class CComponent extends React.Component {
  // class Fields
  clickHandler = (e, num) => {
    // 这里的this指向的是正确的当前的组件实例对象
    // 可以非常方便的通过this关键词拿到组件实例身上的其他属性或者方法
    console.log(this, e, num);
  };

  clickHandler1() {
    // 这里的this 不指向当前的组件实例对象而指向undefined 存在this丢失问题
    console.log(this);
  }

  render() {
    return (
      <div>
        <button onClick={e => this.clickHandler(e, '123')}>click me</button>
        <button onClick={this.clickHandler1}>click me</button>
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <CComponent />
    </div>
  );
}

export default App;
```

## 表单处理

使用 React 处理表单元素，一般有俩种方式：

1. 受控组件 （推荐使用）
2. 非受控组件 （了解）

### 1. 受控表单组件

什么是受控组件？  `input框自己的状态被React组件状态控制`

React 组件的状态存在 state 中，input 表单元素的状态存在 value 中，React 将 state 与表单元素的 value 绑定到一起，由 state 的值来控制表单元素的值，从而保证单一数据源特性

**实现步骤**

以获取文本框的值为例，受控组件的使用步骤如下：

1. 在组件的 state 中声明一个组件的状态数据
2. 将状态数据设置为 input 标签元素的 value 属性的值
3. 为 input 添加 change 事件，在事件处理程序中，通过事件对象 e 获取到当前文本框的值
4. 调用 setState 方法，将文本框的值作为 state 状态的最新值

```jsx
import React from 'react'

class InputComponent extends React.Component {
  // 声明组件状态
  state = {
    message: 'this is message',
  }
  // 声明事件回调函数
  changeHandler = (e) => {
    this.setState({ message: e.target.value })
  }
  render () {
    return (
      <div>
        {/* 绑定value 绑定事件*/}
        <input value={this.state.message} onChange={this.changeHandler} />
      </div>
    )
  }
}

function App () {
  return (
    <div className="App">
      <InputComponent />
    </div>
  )
}
export default App
```

### 2. 非受控表单组件

非受控组件就是通过手动操作dom的方式获取文本框的值，文本框的状态不受react组件的state中的状态控制，直接通过原生dom获取输入框的值

**实现步骤**

1. 导入`createRef` 函数
2. 调用createRef函数，创建一个ref对象，存储到名为`msgRef`的实例属性中
3. 为input添加ref属性，值为`msgRef`
4. 在按钮的事件处理程序中，通过`msgRef.current`即可拿到input对应的dom元素，而其中`msgRef.current.value`拿到的就是文本框的值

```jsx
import React, { createRef } from 'react'

class InputComponent extends React.Component {
  // 使用createRef产生一个存放dom的对象容器
  msgRef = createRef()

  changeHandler = () => {
    console.log(this.msgRef.current.value)
  }

  render() {
    return (
      <div>
        {/* ref绑定 获取真实dom */}
        <input ref={this.msgRef} />
        <button onClick={this.changeHandler}>click</button>
      </div>
    )
  }
}

function App () {
  return (
    <div className="App">
      <InputComponent />
    </div>
  )
}
export default App
```

# React组件通信

1. 父子关系 -  **最重要的**
2. 兄弟关系 -  自定义事件模式产生技术方法 eventBus  /  通过共同的父组件通信
3. 其它关系 -  **mobx / redux / zustand**

## 1.父传子

**步骤**

1. 父组件提供要传递的数据  -  `state` 
2. 给子组件标签`添加属性`，值为 state 中的数据 
3. 子组件中通过 `props` 接收父组件中传过来的数据，props 是只读对象
   - 类组件使用 this.props 获取 props 对象
   - 函数组件直接通过参数获取 props 对象

```jsx
import React from 'react'

// 函数组件
function FSon(props) {
  console.log(props)
  return (
    <div>
      子组件1
      {props.msg}
    </div>
  )
}

// 类组件
class CSon extends React.Component {
  render() {
    return (
      <div>
        子组件2
        {this.props.msg}
      </div>
    )
  }
}
// 父组件
class App extends React.Component {
  state = {
    message: 'this is message'
  }
  render() {
    return (
      <div>
        <div>父组件</div>
        <FSon msg={this.state.message} />
        <CSon msg={this.state.message} />
      </div>
    )
  }
}

export default App
```

## 2.子传父

父组件传给子组件的回调函数 cb，子组件调用 cb 来给父组件传递数据

**步骤**

1. 父组件提供一个回调函数 cb  - 用于接收数据
2. 将函数作为属性的值传给子组件
3. 子组件通过 props 调用回调函数 cb
4. 将子组件中的数据作为参数传递给回调函数 cb

```jsx
import React from 'react'

// 子组件
function Son(props) {
  function handleClick() {
    // 调用父组件传递过来的回调函数 并注入参数
    props.changeMsg('this is newMessage')
  }
  return (
    <div>
      {props.msg}
      <button onClick={handleClick}>change</button>
    </div>
  )
}


class App extends React.Component {
  state = {
    message: 'this is message'
  }
  // 提供回调函数
  changeMessage = (newMsg) => {
    console.log('子组件传过来的数据:',newMsg)
    this.setState({
      message: newMsg
    })
  }
  render() {
    return (
      <div>
        <div>父组件</div>
        <Son
          msg={this.state.message}
          // 传递给子组件
          changeMsg={this.changeMessage}
        />
      </div>
    )
  }
}

export default App
```

## 3.兄弟组件通信

利用共同的父组件实现兄弟通信

![img](https://cdn.nlark.com/yuque/0/2022/png/274425/1654490527043-7acbe144-a306-40af-a878-3a7f4ba3a599.png)

**步骤**

1. 将共享状态提升到最近的公共父组件中，由公共父组件管理这个状态
   
   - 提供共享状态
   - 提供操作共享状态的方法

2. 要**接收数据**状态的子组件通过 props 接收数据

3. 要**传递数据**状态的子组件通过 props 接收方法，调用方法传递数据

```jsx
import React from 'react'

// 子组件A
function SonA(props) {
  return (
    <div>
      SonA
      {props.msg}
    </div>
  )
}
// 子组件B
function SonB(props) {
  return (
    <div>
      SonB
      <button onClick={() => props.changeMsg('new message')}>changeMsg</button>
    </div>
  )
}

// 父组件
class App extends React.Component {
  // 父组件提供状态数据
  state = {
    message: 'this is message'
  }
  // 父组件提供修改数据的方法
  changeMsg = (newMsg) => {
    this.setState({
      message: newMsg
    })
  }

  render() {
    return (
      <>
        {/* 接收数据的组件 */}
        <SonA msg={this.state.message} />
        {/* 修改数据的组件 */}
        <SonB changeMsg={this.changeMsg} />
      </>
    )
  }
}

export default App
```

## 4.跨组件通信Context

![img](https://cdn.nlark.com/yuque/0/2022/png/274425/1654490557423-1b93cabb-8bb8-4d6d-91f5-77c5cbddf105.png)

Context 提供了一个**无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法**

**步骤**

1. 创建 Context 对象, 导出 Provider 和 Consumer 对象

2. 使用 Provider 包裹上层组件提供数据 

3. 需要用到数据的组件使用 Consumer 包裹获取数据 

```jsx
import React, { createContext }  from 'react'

// 1. 创建Context对象 
const { Provider, Consumer } = createContext()

// 3. 消费数据
function ComC() {
  return (
    <Consumer >
      {value => <div>{value}</div>}
    </Consumer>
  )
}

function ComA() {
  return (
    <ComC/>
  )
}

// 2. 提供数据
class App extends React.Component {
  state = {
    message: 'this is message'
  }
  render() {
    return (
      <Provider value={this.state.message}>
        <div className="app">
          <ComA />
        </div>
      </Provider>
    )
  }
}

export default App
```

# React组件进阶

## props校验

**使用**

1. 安装并导入`prop-types` 包
2. 使用 `组件名.propTypes = {}` 给组件添加校验规则

```jsx
import PropTypes from 'prop-types'

const List = props => {
  const arr = props.colors
  const lis = arr.map((item, index) => <li key={index}>{item.name}</li>)
  return <ul>{lis}</ul>
}

List.propTypes = {
  colors: PropTypes.array
}
```

### 校验规则

**四种常见结构**

1. 常见类型：array、bool、func、number、object、string
2. React元素类型：element
3. 必填项：isRequired
4. 特定的结构对象：shape({})

```javascript
// 常见类型
optionalFunc: PropTypes.func,
// 必填 只需要在类型后面串联一个isRequired
requiredFunc: PropTypes.func.isRequired,
// 特定结构的对象
optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
})
```

官网文档：https://reactjs.org/docs/typechecking-with-proptypes.html

### props校验-默认值

#### 1. 函数组件

直接使用函数参数默认值

```jsx
function List({pageSize = 10}) {
  return (
    <div>
      此处展示props的默认值：{ pageSize }
    </div>
  )
}

// 不传入pageSize属性
<List />
```

#### 2. 类组件

使用类静态属性声明 `defaultProps` 可以给组件的 props 设置默认值

```jsx
class List extends Component {
  static defaultProps = {
    pageSize: 10
  }
  render() {
    return (
      <div>
        此处展示props的默认值：{this.props.pageSize}
      </div>
    )
  }
}
<List />
```

## 生命周期 - 概述

组件的生命周期是指组件从被创建到挂载到页面中运行起来，再到组件不用时卸载的过程，注意，只有类组件才有生命周期（类组件 实例化  函数组件 不需要实例化）

![img](https://cdn.nlark.com/yuque/0/2022/png/274425/1654490712545-6bd28fa7-290b-48fb-8d51-bbf5578dad3f.png)

http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

### 挂载阶段

在组件挂载阶段执行的钩子函数和执行顺序

```txt
constructor -> render -> componentDidMount
```

| 钩子 函数             | 触发时机                        | 作用                                              |
| ----------------- | --------------------------- | ----------------------------------------------- |
| constructor       | 创建组件时，最先执行，初始化的时候只执行一次      | 1. 初始化state  2. 创建 Ref 3. 使用 bind 解决 this 指向问题等 |
| render            | 每次组件渲染都会触发                  | 渲染UI（**注意： 不能在里面调用setState()** ）                |
| componentDidMount | 组件挂载（完成DOM渲染）后执行，初始化的时候执行一次 | 1. 发送网络请求  2.DOM操作                              |

### 更新阶段

组件在更新阶段的钩子函数以及执行顺序

```txt
render -> componentDidUpdate
```

| 钩子函数               | 触发时机           | 作用                                      |
| ------------------ | -------------- | --------------------------------------- |
| render             | 每次组件渲染都会触发     | 渲染UI（与 挂载阶段 是同一个render）                 |
| componentDidUpdate | 组件更新后（DOM渲染完毕） | DOM操作，可以获取到更新后的DOM内容，**不要直接调用setState** |

### 卸载阶段

组件在销毁阶段执行的钩子函数以及执行顺序

| 钩子函数                 | 触发时机         | 作用                |
| -------------------- | ------------ | ----------------- |
| componentWillUnmount | 组件卸载（从页面中消失） | 执行清理工作（比如：清理定时器等） |

# Hooks基础

## Hooks概念理解

### 1. 什么是hooks

Hooks的本质：**一套能够使函数组件更强大，更灵活的“钩子”**

让函数组件拥有自己的状态

### 2. Hooks解决了什么问题

- 让函数组件拥有自己的状态
- class组件自身的问题(this指向问题等)

## useState

useState为函数组件提供状态（state）

```jsx
import { useState } from 'react'

function App() {
  // 参数：状态初始值比如,传入 0 表示该状态的初始值为 0
  // 返回值：数组,包含两个值：1 状态值（state） 2 修改该状态的函数（setState）
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => { setCount(count + 1) }}>{count}</button>
  )
}
export default App
```

**`useState` 注意事项 **

1. 只能出现在函数组件或者其他hook函数中

2. 不能嵌套在if/for/其它函数中（react按照hooks的调用顺序识别每一个hook） 

```javascript
let num = 1
function List(){
  num++
  if(num / 2 === 0){
     const [name, setName] = useState('cp') 
  }
  const [list,setList] = useState([])
}
// 俩个hook的顺序不是固定的，这是不可以的！！！
```

## useEffect

副作用是相对于主作用来说的，一个函数除了主作用，其他的作用就是副作用。对于 React 组件来说，**主作用就是根据数据（state/props）渲染 UI**，除此之外都是副作用（比如，手动修改 DOM）

**常见的副作用**

1. 数据请求 ajax发送
2. 手动修改dom
3. localstorage操作

```jsx
import { useEffect, useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  useEffect(()=>{
    // dom操作
    document.title = `当前已点击了${count}次`
  })
  return (
    <button onClick={() => { setCount(count + 1) }}>{count}</button>
  )
}

export default App
```

### 1. 执行时机

- **不添加依赖项**

组件首次渲染执行一次，以及不管是哪个状态更改引起组件更新时都会重新执行

```jsx
useEffect(()=>{
    console.log('副作用执行了')
})
```

- **添加空数组**

组件只在首次渲染时执行一次

```jsx
useEffect(()=>{
     console.log('副作用执行了')
},[])
```

- **添加特定依赖项**

副作用函数在首次渲染时执行，在依赖项发生变化时重新执行

```jsx
function App() {  
    const [count, setCount] = useState(0)  
    const [name, setName] = useState('zs') 

    useEffect(() => {    
        console.log('副作用执行了')  
    }, [count])  

    return (    
        <>      
         <button onClick={() => { setCount(count + 1) }}>{count}</button>      
         <button onClick={() => { setName('cp') }}>{name}</button>    
        </>  
    )
}
```

useEffect 回调函数中用到的数据（比如，count）就是依赖数据，就应该出现在依赖项数组中，如果不添加依赖项就会有bug出现

### 4. 清理副作用

如果想要清理副作用 可以在副作用函数中的末尾return一个新的函数，在新的函数中编写清理副作用的逻辑

注意执行时机为：

1. 组件卸载时自动执行
2. 组件更新时，下一个useEffect副作用函数执行之前自动执行

```jsx
import { useEffect, useState } from "react"


const App = () => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timerId = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => {
      // 用来清理副作用的事情
      clearInterval(timerId)
    }
  }, [count])
  return (
    <div>
      {count}
    </div>
  )
}

export default App
```

# Hooks进阶

## useState - 回调函数的参数

useState 的参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 state 需要通过计算才能获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用

```jsx
const [name, setName] = useState(()=>{   
  // 编写计算逻辑    return '计算之后的初始值'
})
```

**语法规则**

1. 回调函数 return 出去的值将作为 `name` 的初始值
2. 回调函数中的逻辑只会在组件初始化的时候执行一次

**语法选择**

1. 如果就是初始化一个普通的数据 直接使用 `useState(普通数据)` 即可
2. 如果要初始化的数据无法直接得到需要通过计算才能获取到，使用`useState(()=>{})`

```jsx
import { useState } from 'react'

function Counter(props) {
  const [count, setCount] = useState(() => {
    return props.count
  })
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}

function App() {
  return (
    <>
      <Counter count={10} />
      <Counter count={20} />
    </>
  )
}

export default App
```

## useEffect - 发送网络请求

在useEffect中发送网络请求，并且封装同步 async await操作

不可以直接在useEffect的回调函数外层直接包裹 await ，因为**异步会导致清理函数无法立即返回**

```javascript
useEffect(async ()=>{    
    const res = await axios.get('http://geek.itheima.net/v1_0/channels')   
    console.log(res)
},[])
```

**正确写法**

在内部单独定义一个函数，然后把这个函数包装成同步

```jsx
useEffect(()=>{   
    async function fetchData(){      
       const res = await axios.get('http://geek.itheima.net/v1_0/channels')                            console.log(res)   
    }
    fetchData()
},[])
```

## useRef

使用useRef获取真实dom或组件实例

**获取dom**

```jsx
import { useEffect, useRef } from 'react'
function App() {  
    const h1Ref = useRef(null)  
    useEffect(() => {    
        console.log(h1Ref)  
    },[])  
    return (    
        <div>      
            <h1 ref={ h1Ref }>this is h1</h1>    
        </div>  
    )
}
export default App
```

**获取组件实例**

函数组件由于没有实例，不能使用ref获取，如果想获取组件实例，必须是类组件

```jsx
class Foo extends React.Component {  
    sayHi = () => {    
        console.log('say hi')  
    }  
    render(){    
        return <div>Foo</div>  
    }
}

export default Foo
```

```jsx
import { useEffect, useRef } from 'react'
import Foo from './Foo'
function App() {  
    const h1Foo = useRef(null)  
    useEffect(() => {    
        console.log(h1Foo)  
    }, [])  
    return (    
        <div> <Foo ref={ h1Foo } /></div>  
    )
}
export default App
```

## useContext

```jsx
import { createContext, useContext } from 'react'
// 1.创建 Context 对象
const Context = createContext()

function Foo() {  
    return <div>Foo <Bar/></div>
}

function Bar() {  
    // 3. 底层组件通过useContext函数获取数据  
    const name = useContext(Context)  
    return <div>Bar {name}</div>
}

function App() {  
    return (    
        // 2. 顶层组件通过Provider 提供数据    
        <Context.Provider value={'this is name'}>     
            <div><Foo/></div>    
        </Context.Provider>  
    )
}

export default App
```

# 参考链接

React基础讲义: https://www.yuque.com/fechaichai/qeamqf/xbai87 

React和Mobx讲义: https://www.yuque.com/fechaichai/qeamqf/apomum 

ReactPc项目讲义: https://www.yuque.com/fechaichai/tzzlh1