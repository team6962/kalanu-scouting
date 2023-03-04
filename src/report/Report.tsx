import { Game } from './game/Game';
import { PostgameReport } from './PostgameReport';
import { Setup, SetupInfo } from './setup/Setup';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectPeriod, startGame } from '../state/slices/reportSlice';

import * as styles from './Report.module.scss';
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { EventSimple } from '../api/types';

export const Report: React.FC = () => {
	// const state = useAppSelector(selectPeriod);
	const [state, setState] = useState<'setup' | 'game'>('setup');
	const dispatch = useAppDispatch();

	// persist chosen year and event in localstorage so they don't need to be picked repeatedly
	const [initialYear, setInitialYear] = useLocalStorage('initialYear', 2022);
	const [initialEvent, setInitialEvent] = useLocalStorage<EventSimple>('initialEvent', {
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
	});

	const onPregameSubmit = ({ year, event, match, team }: SetupInfo) => {
		setState('game');

		setInitialYear(year);
		setInitialEvent(event);

		dispatch(startGame({ matchId: match.key, teamId: team.key }));
	};

	return (
		<div className={styles.report}>
			{state === 'setup' ? (
				<Setup
					initialYear={initialYear}
					initialEvent={initialEvent}
					onSubmit={onPregameSubmit}
				/>
			) : null}
			{state === 'game' ? <Game /> : null}
			{/* {state === 'postgame' ? <PostgameReport /> : null} */}
		</div>
	);
};
