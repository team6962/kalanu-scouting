import { useState, useEffect } from 'react';

/**
 * creates a stopwatch that periodically updates a time value
 * @param interval the delay between updates, in milliseconds
 * @param initialStart the starting timestamp. if not provided, will default to `Date.now()`
 * @returns seconds since start
 */
export const useStopwatch = (interval = 1000, initialStart?: number) => {
	const [start] = useState(initialStart || Date.now());
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => setTime(() => (Date.now() - start) / 1000), interval);
		return () => clearInterval(timer);
	}, [time]);

	return time;
};
