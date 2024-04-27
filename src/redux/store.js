import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root-reducer';

// Configure the Redux store
const store = configureStore({
  reducer: rootReducer, // Set the root reducer
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false // Disable serializable check for non-serializable values
  }),
});

export default store;