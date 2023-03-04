import { Dispatch } from 'react';
import { useEventTeamsSimple } from '../api/api';
import { EventSimple, MatchSimple, TeamSimple } from '../api/types';
import { ComboBox, ComboPlaceholder } from './ComboBox';

import * as styles from './ComboBox.module.scss';

interface TeamComboProps {
	event: EventSimple;
	value: TeamSimple | null;
	onChange: Dispatch<TeamSimple | null>;
	match?: MatchSimple | null;
	disabled?: boolean;
}

export const TeamCombo: React.FC<TeamComboProps> = ({
	event,
	value,
	onChange,
	match = null,
	disabled
}) => {
	// fetch matches from api
	const [teams, teamsLoading, teamsError] = useEventTeamsSimple(event.key);

	// if event changes to one this team isn't in, unset it
	if (
		value !== null &&
		teams !== undefined &&
		teams.find((team) => team.key === value.key) === undefined
	)
		onChange(null);

	// prep handler
	const teamToString = (team: TeamSimple | null) => {
		if (team === null) return '';
		return `${team.team_number}: ${team.nickname}`;
	};

	// if events aren't ready to display
	return teams === undefined || teamsLoading || teamsError !== undefined ? (
		// show dummy element
		<ComboPlaceholder placeholder="team" />
	) : (
		// otherwise show picker
		<ComboBox
			items={teams}
			//
			value={value}
			onChange={onChange}
			//
			itemToString={teamToString}
			itemToNode={(team) => {
				const string = teamToString(team);
				if (match === null || match.alliances === undefined) return string;
				if (match.alliances.red?.team_keys.includes(team.key))
					return <span className={styles.red}>{string}</span>;
				if (match.alliances.blue?.team_keys.includes(team.key))
					return <span className={styles.blue}>{string}</span>;
				return string;
			}}
			itemToKey={(team) => team.key}
			//
			itemMatchesSearch={(item, input) => {
				const searchMatch = teamToString(item).toLowerCase().includes(input.toLowerCase());
				const allianceMatch =
					match !== null &&
					match.alliances !== undefined &&
					(match.alliances.blue!.team_keys.includes(item.key) ||
						match.alliances.red!.team_keys.includes(item.key));
				return match ? allianceMatch && searchMatch : searchMatch;
			}}
			//
			sortItems={(a, b) => a.team_number - b.team_number}
			//
			placeholder="team"
			label="team: "
			disabled={disabled}
		/>
	);
};
