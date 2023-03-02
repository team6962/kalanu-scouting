// https://redux.js.org/tutorials/typescript-quick-start
import { configureStore } from '@reduxjs/toolkit';
import offlineSlice from './slices/offlineSlice';
import reportSlice from './slices/reportSlice';

export const store = configureStore({
	reducer: {
		report: reportSlice,
		offline: offlineSlice
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
