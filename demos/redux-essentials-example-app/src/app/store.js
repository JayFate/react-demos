import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postsSlice'

export default configureStore({
  // reducer: () => ({}),
  reducer: {
    // 将 reducer 函数添加到 redux store 中
    // 表示 state.posts 的所有数据都将在 dispatch action 时由 postsReducer 函数更新
    posts: postsReducer,
  },
})
