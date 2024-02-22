import { format } from 'date-fns';
import { doc, writeBatch } from 'firebase/firestore';
import { useId, useState } from 'react';
import { version } from '../../package.json';
import { Model2023 } from '../Model2023';
import { ReportState } from '../report/ReportState';
import { firestore } from './firebase';
import { useIsOnline } from './useIsOnline';

import * as styles from './Status.module.scss';

interface SyncMonitorProps {
	reports: ReportState[];
	setReports: (reports: ReportState[]) => void;
}

export const Status: React.FC<SyncMonitorProps> = ({ reports, setReports }) => {
	const online = useIsOnline();

	const [popup, setPopup] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async () => {
		setSubmitting(true);
		try {
			const batch = writeBatch(firestore);
			for (const report of reports) {
				const ref = doc(firestore, 'reports', report.id);
				batch.set(ref, report);
			}
			await batch.commit();
			setReports([]);
		} catch (e) {
			setError(e as Error);
		}
		setSubmitting(false);
		setPopup(false);
	};

	const popupId = useId();

	return (
		<>
			<div className={styles.sync}>
				<div>
					<p>{`kalanu 2024, model v${Model2023.version}.`}</p>
					<p>{online ? 'online.' : 'offline.'}</p>
					<p>
						{reports.length > 0
							? ` ${reports.length} report${
									reports.length !== 1 ? 's' : ''
							  } can be synced${online ? '' : ' after reconnecting'}.`
							: null}
					</p>
					{online && reports.length > 0 ? (
						<>
							{error !== null ? <p>{error.message}</p> : null}
							<input
								type="button"
								onClick={() => setPopup(true)}
								value={popup ? 'syncing...' : 'sync'}
								disabled={popup}
							/>
						</>
					) : null}
				</div>
			</div>
			<div
				className={`${styles.syncPopup} ${popup ? styles.active : ''}`}
				onClick={() => setPopup(false)}
				id={popupId}
			>
				{popup ? (
					<div onClick={(event) => event.stopPropagation()}>
						<ul>
							{reports.map((e, i) => {
								const date = new Date(e.start);
								const handleClick = () => {
									const newReports = reports.slice();
									newReports.splice(i, 1);
									setReports(newReports);
									if (newReports.length === 0) setPopup(false);
								};

								return (
									<li>
										- {e.flowId} report on {format(date, 'MMM d').toLowerCase()}{' '}
										at {format(date, 'kk:mm')}
										<input type="button" value="delete" onClick={handleClick} />
									</li>
								);
							})}
						</ul>

						<input
							type="button"
							value={submitting ? 'submitting...' : 'submit'}
							onClick={handleSubmit}
							disabled={submitting}
						/>
					</div>
				) : null}
			</div>
		</>
	);
};
