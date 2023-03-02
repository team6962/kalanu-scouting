import { useEffect, useState } from 'react';
import { getEventMatchesSimple, getEventTeamsSimple } from './api/api';
import { useAppDispatch } from './state/hooks';
import { loadMatches, loadTeams } from './state/slices/offlineSlice';

// this should probably be somewhere else
const eventCode = '2022casf';

export const useLoader = (): [boolean, Error[]] => {
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState<Error[]>([]);

	const dispatch = useAppDispatch();
	const handleError = (e: Error) => setErrors((errors) => [...errors, e]);

	useEffect(() => {
		const matchPromise = getEventMatchesSimple(eventCode)
			.then((matches) => dispatch(loadMatches(matches!)))
			.catch(handleError);
		const teamPromise = getEventTeamsSimple(eventCode)
			.then((teams) => dispatch(loadTeams(teams!)))
			.catch(handleError);

		Promise.allSettled([matchPromise, teamPromise]).finally(() => setLoading(false));
	}, [loading]);

	return [loading, errors];
};
