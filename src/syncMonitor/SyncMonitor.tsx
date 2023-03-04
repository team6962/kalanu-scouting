import { doc, writeBatch } from 'firebase/firestore';
import { Dispatch, useState } from 'react';
import { ReportState } from '../report/ReportState';
import { firestore } from './firebase';
import { useIsOnline } from './useIsOnline';

import * as styles from './SyncMonitor.module.scss';

interface SyncMonitorProps {
	reports: ReportState[];
	setReports: Dispatch<ReportState[]>;
}

export const SyncMonitor: React.FC<SyncMonitorProps> = ({ reports, setReports }) => {
	const online = useIsOnline();

	const [syncing, setSyncing] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const handleSync = async () => {
		setSyncing(true);
		try {
			const batch = writeBatch(firestore);
			for (const report of reports) {
				const ref = doc(firestore, 'reports', report.id);
				batch.set(ref, report);
			}
			await batch.commit();
			setReports([]);
			setSyncing(false);
		} catch (e) {
			setError(e as Error);
		}
	};

	return (
		<div className={styles.sync}>
			<p>
				{online ? 'online.' : 'offline.'}
				{reports.length > 0
					? ` ${reports.length} report${reports.length !== 1 ? 's' : ''} can be synced${
							online ? '' : ' after reconnecting'
					  }.`
					: null}
			</p>
			{online && reports.length > 0 ? (
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