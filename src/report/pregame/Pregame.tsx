import { useState } from 'react';
import { EventSimple, MatchSimple, TeamSimple } from '../../api/types';
import { YearPicker } from './YearPicker';
import { EventCombo } from './EventCombo';
import { MatchCombo } from './MatchCombo';
import { TeamCombo } from './TeamCombo';
import { ComboPlaceholder } from './ComboBox';

import * as styles from './Pregame.module.scss';

export interface PregameInfo {
	year: number;
	event: EventSimple;
	match: MatchSimple;
	team: TeamSimple;
}

interface PregameProps {
	initialYear?: number;
	initialEvent?: EventSimple;
	initialMatch?: MatchSimple;
	initialTeam?: TeamSimple;

	onStart: (info: PregameInfo) => void;
}

export const Pregame: React.FC<PregameProps> = ({
	initialYear,
	initialEvent,
	initialMatch,
	initialTeam,
	onStart
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
				onClick={() => onStart({ year, event, match, team } as PregameInfo)}
			/>
		</div>
	);
};
