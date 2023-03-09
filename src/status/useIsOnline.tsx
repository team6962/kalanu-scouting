import { useEffect, useState } from 'react';
import { useWorkbox } from './workbox';

export const useIsOnline = () => {
	const [isOnline, setIsOnline] = useState(window.navigator.onLine);

	const wb = useWorkbox();
	Object.assign(window, { wb });

	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	return isOnline;
};