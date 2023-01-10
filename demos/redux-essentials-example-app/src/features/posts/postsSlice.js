/**
1. 导入 createSlice
2. 定义我们的初始数据 initialState，并将 initialState 传递给 createSlice，
3. 并导出 createSlice 为我们生成的 postsSlice.reducer 函数
4. 将 reducer 函数添加到 redux store 中
 */
import { createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

const initialState = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    user: '0',
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0
    },
    date: sub(new Date(), { minutes: 10 }).toISOString()
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    user: '1',
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0
    },
    date: sub(new Date(), { minutes: 5 }).toISOString()
  },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // 当用户单击交互按钮时，它将处理更新文章的交互计数的 reducer
    // 使用 Immer 时，你可以 "mutate/改变" 现有的状态对象，或者自己返回一个新的状态值，但不能同时进行
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    // state 本 slice 的局部 state，而不是整个 redux 应用的 store
    // createSlice 会为 postAdded reducer 函数生成一个同名的 actionCreator 函数
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
          },
        }
      },
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
/**
// 也可以自己来实现 actionCreator 函数
function postAdded(title, content) {
  const id = nanoid()
  return {
    type: 'posts/postAdded',
    payload: { id, title, content }
  }
}
 */

export default postsSlice.reducer
