import { useState, useEffect } from 'react';

export const useStopwatch = (interval = 1000, initialStart?: number) => {
	const [start] = useState(initialStart || Date.now());
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => setTime(() => (Date.now() - start) / 1000), interval);
		return () => clearInterval(timer);
	}, [time]);

	return time;
};
