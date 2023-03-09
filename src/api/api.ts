import { useEffect, useState } from 'react';
import { EventSimple, MatchSimple, TeamSimple } from './types';

const apiKey = 'lgJZW2bjprPMQWWptFMqHdDzQZKKHvgEfkHbO7rEpfIDpHCPPcAjSHfsBzEhZ6yA';

export const prepRequest = (url: string) =>
	new Request(url, {
		headers: {
			'X-TBA-Auth-Key': apiKey
		}
	});

export const useFetch = <T extends unknown>(req: Request): [T | undefined, boolean, Error?] => {
	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		setLoading(true);
		fetch(req)
			.catch(setError)
			.then((res) =>
				res!
					.json()
					.then(setData)
					.finally(() => setLoading(false))
			);
	}, [req.url]);

	return [data, loading, error];
};

export const resolveFetch = async <T extends unknown>(req: Request): Promise<T> => {
	const res = await fetch(req);
	return res.json();
};

export const getEventMatchesSimple = (eventCode: string): Promise<MatchSimple[]> =>
	resolveFetch(
		prepRequest(`https://www.thebluealliance.com/api/v3/event/${eventCode}/matches/simple`)
	);
export const useEventMatchesSimple = (eventCode: string) =>
	useFetch<MatchSimple[]>(
		prepRequest(`https://www.thebluealliance.com/api/v3/event/${eventCode}/matches/simple`)
	);

export const getEventTeamsSimple = (eventCode: string): Promise<TeamSimple[]> =>
	resolveFetch(
		prepRequest(`https://www.thebluealliance.com/api/v3/event/${eventCode}/teams/simple`)
	);
export const useEventTeamsSimple = (eventCode: string) =>
	useFetch<TeamSimple[]>(
		prepRequest(`https://www.thebluealliance.com/api/v3/event/${eventCode}/teams/simple`)
	);

export const getEventsByYearSimple = (year: number): Promise<EventSimple[]> =>
	resolveFetch(prepRequest(`https://www.thebluealliance.com/api/v3/events/${year}/simple`));
export const useEventsByYearSimple = (year: number) =>
	useFetch<EventSimple[]>(
		prepRequest(`https://www.thebluealliance.com/api/v3/events/${year}/simple`)
	);
