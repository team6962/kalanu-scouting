import { useState } from 'react';
import { EventSimple, MatchSimple, TeamSimple } from '../../api/types';
import { YearPicker } from './YearPicker';
import { EventCombo } from './EventCombo';
import { MatchCombo } from './MatchCombo';
import { TeamCombo } from './TeamCombo';
import { ComboPlaceholder } from './ComboBox';

import * as styles from './Setup.module.scss';

export interface SetupInfo {
	year: number;
	event: EventSimple;
	match: MatchSimple;
	team: TeamSimple;
}

interface SetupProps {
	initialYear?: number;
	initialEvent?: EventSimple;
	initialMatch?: MatchSimple;
	initialTeam?: TeamSimple;

	onSubmit: (info: SetupInfo) => void;
}

export const Setup: React.FC<SetupProps> = ({
	initialYear,
	initialEvent,
	initialMatch,
	initialTeam,
	onSubmit
}) => {
	const [year, setYear] = useState(initialYear || new Date().getFullYear());
	const [event, setEvent] = useState<EventSimple | null>(initialEvent || null);
	const [match, setMatch] = useState<MatchSimple | null>(initialMatch || null);
	const [team, setTeam] = useState<TeamSimple | null>(initialTeam || null);

	return (
		<div className={styles.pregame}>
			<div className={styles.yearAndEvent}>
				<YearPicker year={year} setYear={setYear} />
				{year !== null ? (
					<EventCombo year={year} value={event} onChange={setEvent} />
				) : (
					<ComboPlaceholder placeholder="event" />
				)}
			</div>
			{event !== null ? (
				<>
					<MatchCombo event={event} value={match} onChange={setMatch} team={team} />
					<TeamCombo event={event} value={team} onChange={setTeam} match={match} />
				</>
			) : (
				<>
					<ComboPlaceholder placeholder="match" />
					<ComboPlaceholder placeholder="team" />
				</>
			)}
			<input
				type="button"
				value="start match"
				disabled={year === null || event === null || team === null || match === null}
				onClick={() => onSubmit({ year, event, match, team } as SetupInfo)}
			/>
		</div>
	);
};
