import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './state/hooks';
import { loadReports, selectReports } from './state/slices/offlineSlice';

export const useSync = () => {
	const reports = useAppSelector(selectReports);

	// load reports once at app launch
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(loadReports(JSON.parse(localStorage.getItem('reports') ?? '{}')));
	}, []);

	// sync reports with localstorage when changed
	useEffect(() => localStorage.setItem('reports', JSON.stringify(reports)), [reports]);
};
