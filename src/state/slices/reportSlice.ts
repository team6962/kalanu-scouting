import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Report, ReportEvent } from '../Report';
import type { RootState } from '../store';

// Define a type for the slice state
interface ReportState {
	data?: Report;
	period: 'pregame' | 'game' | 'postgame';
}

// Define the initial state using that type
const initialState: ReportState = {
	period: 'pregame'
};

export const reportSlice = createSlice({
	name: 'report',
	initialState,
	reducers: {
		startPregame: (state) => {
			state.period = 'pregame';
		},
		startGame: (state, action: PayloadAction<{ matchId: string; teamId: string }>) => {
			state.data = {
				id: nanoid(),

				matchId: action.payload.matchId,
				teamId: action.payload.teamId,
				events: [],

				notes: '',
				fouled: false,
				parked: false
			};
			state.period = 'game';
		},
		addEvent: (state, action: PayloadAction<ReportEvent>) => {
			state.data?.events.unshift(action.payload);
		},
		undoEvent: (state) => {
			state.data?.events.shift();
		},
		finishGame: (state) => {
			state.period = 'postgame';
		},
		setPostgameInfo: (
			state,
			action: PayloadAction<{ notes: string; fouled: boolean; parked: boolean }>
		) => {
			state.data!.notes = action.payload.notes;
			state.data!.fouled = action.payload.fouled;
			state.data!.parked = action.payload.parked;
		}
	}
});

export const { startPregame, startGame, addEvent, undoEvent, finishGame, setPostgameInfo } =
	reportSlice.actions;

export const selectPeriod = (state: RootState) => state.report.period;
export const selectReport = (state: RootState) => state.report.data!;
export const selectEvents = (state: RootState) => state.report.data?.events!;

export default reportSlice.reducer;
