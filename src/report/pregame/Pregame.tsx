import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { startGame } from '../../state/slices/reportSlice';
import { selectMatches, selectTeams } from '../../state/slices/offlineSlice';
import { MatchSimple, TeamSimple } from '../../api/types';
import { MatchCombo } from './MatchCombo';

import * as styles from './Pregame.module.scss';
import { TeamCombo } from './TeamCombo';

export const Pregame: React.FC = () => {
	const [team, setTeam] = useState<TeamSimple | null>(null);
	const [match, setMatch] = useState<MatchSimple | null>(null);

	const matches = useAppSelector(selectMatches);
	const teams = useAppSelector(selectTeams);

	const dispatch = useAppDispatch();
	const startHandler = () => {
		dispatch(
			startGame({
				matchId: match?.key!,
				teamId: team?.key!
			})
		);
	};

	return (
		<div className={styles.pregame}>
			<div>
				<MatchCombo items={matches} value={match} onChange={setMatch} team={team} />
				<TeamCombo items={teams} value={team} onChange={setTeam} match={match} />
			</div>
			<input
				type="button"
				onClick={startHandler}
				value="start match"
				disabled={team === null || match === null}
			/>
		</div>
	);
};
