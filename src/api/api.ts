import { MatchSimple, TeamSimple } from './types';

const apiKey = 'lgJZW2bjprPMQWWptFMqHdDzQZKKHvgEfkHbO7rEpfIDpHCPPcAjSHfsBzEhZ6yA';

export const getEventMatchesSimple = async (eventCode: string): Promise<MatchSimple[]> => {
	const res = await fetch(
		`https://www.thebluealliance.com/api/v3/event/${eventCode}/matches/simple`,
		{
			headers: {
				'X-TBA-Auth-Key': apiKey
			}
		}
	);
	return await res.json();
};

export const getEventTeamsSimple = async (eventCode: string): Promise<TeamSimple[]> => {
	const res = await fetch(
		`https://www.thebluealliance.com/api/v3/event/${eventCode}/teams/simple`,
		{
			headers: {
				'X-TBA-Auth-Key': apiKey
			}
		}
	);
	return await res.json();
};
