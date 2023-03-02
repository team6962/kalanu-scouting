import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MatchSimple, TeamSimple } from 'tba-api-client-typescript';
import { Report } from '../Report';
import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

interface OfflineState {
	reports: Record<string, Report>;
	matches: MatchSimple[];
	teams: TeamSimple[];
}

const initialState: OfflineState = {
	reports: {},
	matches: [],
	teams: []
};

export const offlineSlice = createSlice({
	name: 'offline',
	initialState,
	reducers: {
		loadMatches: (state, action: PayloadAction<MatchSimple[]>) => {
			state.matches = action.payload;
		},
		loadTeams: (state, action: PayloadAction<TeamSimple[]>) => {
			state.teams = action.payload;
		},
		loadReports: (state, action: PayloadAction<Record<string, Report>>) => {
			for (const id in action.payload) {
				state.reports[id] = action.payload[id];
			}
		},
		addReport: (state, action: PayloadAction<Report>) => {
			state.reports[action.payload.id] = action.payload;
		},
		popReports: (state) => {
			state.reports = {};
		}
	}
});

export const { loadMatches, loadTeams, loadReports, addReport, popReports } = offlineSlice.actions;

export const selectMatches = (state: RootState) => state.offline.matches;
export const selectTeams = (state: RootState) => state.offline.teams;
export const selectReports = (state: RootState) => state.offline.reports;
export const selectNumReports = createSelector(
	selectReports,
	(reports) => Object.keys(reports).length
);

export default offlineSlice.reducer;
