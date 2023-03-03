import { MatchSimple, TeamSimple } from '../../api/types';
import { ComboBox } from './ComboBox';

import * as styles from './ComboBox.module.scss';

interface TeamComboProps {
	items: TeamSimple[];
	value: TeamSimple | null;
	onChange: (item: TeamSimple | null) => void;
	match?: MatchSimple | null;
}

export const TeamCombo: React.FC<TeamComboProps> = ({ items, value, onChange, match = null }) => {
	const teamToString = (team: TeamSimple | null) => {
		if (team === null) return '';
		return `${team.team_number}: ${team.nickname}`;
	};

	return (
		<ComboBox
			items={items}
			//
			value={value}
			onChange={(item) => onChange(item === undefined ? null : item)}
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
		/>
	);
};
