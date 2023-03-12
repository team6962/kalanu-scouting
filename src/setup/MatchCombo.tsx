import { useEventMatchesSimple } from '../api/api';
import { EventSimple, MatchSimple, TeamSimple } from '../api/types';
import { ComboBox, ComboPlaceholder } from '../comboBox/ComboBox';

const matchLevels: Record<string, string> = {
	qm: 'Quals',
	ef: 'Match',
	qf: 'Quarters',
	sf: 'Semis',
	f: 'Finals'
};

interface MatchComboProps {
	event: EventSimple;
	value: MatchSimple | null;
	onChange: (match: MatchSimple | null) => void;
	team?: TeamSimple | null;
	disabled?: boolean;
}

export const MatchCombo: React.FC<MatchComboProps> = ({
	event,
	value,
	onChange,
	team = null,
	disabled
}) => {
	// fetch matches from api
	const [matches, matchesLoading, matchesError] = useEventMatchesSimple(event.key);

	// if event changes to one other than this match, unset it
	if (value !== null && value.event_key !== event.key) onChange(null);

	// prep handler
	const matchToString = (match: MatchSimple | null, suffix = true) => {
		if (match === null) return '';

		const level = matchLevels[match.comp_level];
		const setSuffix = match.comp_level !== 'qm' ? ` Match ${match.set_number}` : '';
		return `${level} ${match.match_number}${suffix ? setSuffix : ''}`;
	};

	// if events aren't ready to display
	return matches === undefined || matchesLoading || matchesError !== undefined ? (
		// show dummy element
		<ComboPlaceholder placeholder="match" />
	) : (
		// otherwise show picker
		<ComboBox
			items={matches}
			//
			value={value}
			onChange={onChange}
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
			disabled={disabled}
		/>
	);
};
