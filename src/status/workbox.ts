import { Workbox } from 'workbox-window';

export const useWorkbox = () => {
	const wb = new Workbox('/service-worker.js');
	return wb;
};
