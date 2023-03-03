import { MatchSimple, TeamSimple } from '../../api/types';
import { ComboBox } from './ComboBox';

const matchLevels: Record<string, string> = {
	qm: 'Quals',
	ef: 'Match',
	qf: 'Quarters',
	sf: 'Semis',
	f: 'Finals'
};

interface MatchComboProps {
	items: MatchSimple[];
	value: MatchSimple | null;
	onChange: (item: MatchSimple | null) => void;
	team?: TeamSimple | null;
}

export const MatchCombo: React.FC<MatchComboProps> = ({ items, value, onChange, team = null }) => {
	const matchToString = (match: MatchSimple | null, suffix = true) => {
		if (match === null) return '';

		const level = matchLevels[match.comp_level];
		const setSuffix = match.comp_level !== 'qm' ? ` Match ${match.set_number}` : '';
		return `${level} ${match.match_number}${suffix ? setSuffix : ''}`;
	};

	return (
		<ComboBox
			items={items}
			//
			value={value}
			onChange={(item) => onChange(item === undefined ? null : item)}
			//
			itemToString={matchToString}
			itemToKey={(match) => match.key}
			//
			itemMatchesSearch={(item, input) => {
				const searchMatch = matchToString(item, false)
					.toLowerCase()
					.includes(input.toLowerCase());
				const allianceMatch =
					team !== null &&
					item.alliances !== undefined &&
					(item.alliances.blue!.team_keys.includes(team.key) ||
						item.alliances.red!.team_keys.includes(team.key));
				return team ? allianceMatch && searchMatch : searchMatch;
			}}
			//
			sortItems={(a, b) =>
				(a.actual_time || a.predicted_time || a.time || 0) -
				(b.actual_time || b.predicted_time || b.time || 0)
			}
			//
			placeholder="match"
			label="match: "
		/>
	);
};
