/**
1. 导入 createSlice
2. 定义我们的初始数据 initialState，并将 initialState 传递给 createSlice，
3. 并导出 createSlice 为我们生成的 postsSlice.reducer 函数
4. 将 reducer 函数添加到 redux store 中
 */
import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' }
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}
})

export default postsSlice.reducer