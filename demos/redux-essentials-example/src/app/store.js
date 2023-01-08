import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    // 我们的应用可能由许多不同的特性组成，每个特性都可能有自己的 reducer 函数
    // 表示 counterReducer 方法负责处理如何更新 state.counter 部分
    // counter 相当于 namespace
    counter: counterReducer,
  },
});
