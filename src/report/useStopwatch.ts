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
