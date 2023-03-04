import { useEffect, useState } from 'react';

export const useStopwatch = (interval = 1000) => {
	const [start] = useState(Date.now());
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => setTime((t) => Date.now() - start), interval);
		return () => clearInterval(timer);
	}, [time]);

	return time;
};

interface StopwatchProps {
	time: number;
	totalTime: number;
	strokeColor: string;
}

import { Line } from 'rc-progress';

export const Stopwatch: React.FC<StopwatchProps> = ({ time, totalTime, strokeColor }) => (
	<>
		<p>
			{Math.floor(time / (1000 * 60))}m {((time / 1000) % 60).toFixed(1)}s
		</p>
		<Line
			percent={(time / totalTime) * 100}
			strokeWidth={8}
			trailWidth={8}
			strokeLinecap="square"
			strokeColor={strokeColor}
			trailColor={'#d8dada'}
		/>
	</>
);
