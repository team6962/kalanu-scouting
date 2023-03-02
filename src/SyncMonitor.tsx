import { useAppDispatch, useAppSelector } from './state/hooks';
import { popReports, selectNumReports, selectReports } from './state/slices/offlineSlice';
import { useIsOnline } from './useIsOnline';

import * as styles from './SyncMonitor.module.scss';
import { useState } from 'react';

import { writeBatch, doc } from 'firebase/firestore';
import { firestore } from './firebase';
import { store } from './state/store';

export const SyncMonitor: React.FC = () => {
	const online = useIsOnline();
	const numReports = useAppSelector(selectNumReports);
	const dispatch = useAppDispatch();

	const [syncing, setSyncing] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const handleSync = async () => {
		setSyncing(true);
		try {
			const reports = selectReports(store.getState());
			const batch = writeBatch(firestore);
			for (const id in reports) {
				const ref = doc(firestore, 'reports', id);
				batch.set(ref, reports[id]);
			}
			await batch.commit();
			dispatch(popReports());
			setSyncing(false);
		} catch (e) {
			setError(e as Error);
		}
	};

	return (
		<div className={styles.sync}>
			<p>
				{online ? 'online.' : 'offline.'}
				{numReports > 0
					? ` ${numReports} report${numReports !== 1 ? 's' : ''} can be synced${
							online ? '' : ' after reconnecting'
					  }.`
					: null}
			</p>
			{online && numReports > 0 ? (
				<>
					{error !== null ? <p>{error.message}</p> : null}
					<input
						type="button"
						onClick={handleSync}
						value={syncing ? 'syncing...' : 'sync now'}
						disabled={syncing}
					/>
				</>
			) : null}
		</div>
	);
};
