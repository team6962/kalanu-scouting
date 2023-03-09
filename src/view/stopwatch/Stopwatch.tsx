import * as styles from './Stopwatch.module.scss';

interface StopwatchProps {
	time: number;
	totalTime: number;
	strokeColor: string;
}

import { Line } from 'rc-progress';

export const Stopwatch: React.FC<StopwatchProps> = ({ time, totalTime, strokeColor }) => (
	<div className={styles.stopwatch}>
		<p>
			{Math.floor(time / 60)}m {(time % 60).toFixed(1)}s
		</p>
		<Line
			percent={(time / totalTime) * 100}
			strokeWidth={8}
			trailWidth={8}
			strokeLinecap="square"
			strokeColor={strokeColor}
			trailColor={'#d8dada'}
		/>
	</div>
);
