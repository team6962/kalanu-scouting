import { GameReport } from './GameReport';
import { PostgameReport } from './PostgameReport';
import { Pregame, PregameInfo } from './pregame/Pregame';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectPeriod, startGame } from '../state/slices/reportSlice';

import * as styles from './Report.module.scss';

const initialEvent = {
	city: 'San Francisco',
	country: 'USA',
	end_date: '2022-03-20',
	event_code: 'casf',
	event_type: 0,
	key: '2022casf',
	name: 'San Francisco Regional',
	start_date: '2022-03-17',
	state_prov: 'CA',
	year: 2022
};

export const Report: React.FC = () => {
	const state = useAppSelector(selectPeriod);
	const dispatch = useAppDispatch();

	const onStart = ({ year, event, match, team }: PregameInfo) => {
		console.log(event);
		dispatch(startGame({ matchId: match.key, teamId: team.key }));
	};

	return (
		<div className={styles.report}>
			{state === 'pregame' ? (
				<Pregame initialYear={2022} initialEvent={initialEvent} onStart={onStart} />
			) : null}
			{state === 'game' ? <GameReport /> : null}
			{state === 'postgame' ? <PostgameReport /> : null}
		</div>
	);
};
