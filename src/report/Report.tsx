import { GameReport } from './GameReport';
import { PostgameReport } from './PostgameReport';
import { Pregame } from './pregame/Pregame';
import { useAppSelector } from '../state/hooks';
import { selectPeriod } from '../state/slices/reportSlice';

import * as styles from './Report.module.scss';

export const Report: React.FC = () => {
	const state = useAppSelector(selectPeriod);
	return (
		<div className={styles.report}>
			{state === 'pregame' ? <Pregame /> : null}
			{state === 'game' ? <GameReport /> : null}
			{state === 'postgame' ? <PostgameReport /> : null}
		</div>
	);
};
