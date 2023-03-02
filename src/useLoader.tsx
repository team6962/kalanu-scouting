import { useEffect, useState } from 'react';
import { MatchApi, MatchSimple, TeamApi, TeamSimple } from 'tba-api-client-typescript';
import { config } from './api/config';
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
		const matchApi = new MatchApi(config, 'https://www.thebluealliance.com/api/v3', fetch);
		const teamApi = new TeamApi(config, 'https://www.thebluealliance.com/api/v3', fetch);

		const matchPromise = matchApi
			.getEventMatchesSimple(eventCode)
			.catch(handleError)
			.then((matches) => dispatch(loadMatches(matches as MatchSimple[])));
		const teamPromise = teamApi
			.getEventTeamsSimple(eventCode)
			.catch(handleError)
			.then((teams) => dispatch(loadTeams(teams as TeamSimple[])));

		Promise.allSettled([matchPromise, teamPromise]).finally(() => setLoading(false));
	}, [loading]);

	return [loading, errors];
};
