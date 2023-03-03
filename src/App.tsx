import { Report } from './report/Report';
import { useLoader } from './useLoader';
import { useSync } from './useSync';

import * as styles from './App.module.scss';
import { SyncMonitor } from './SyncMonitor';

export const App: React.FC = () => {
	const [loading, errors] = useLoader();
	useSync();

	return (
		<div className={styles.app}>
			{loading ? (
				<div>
					<p>preparing for offline...</p>
				</div>
			) : errors.length > 0 ? (
				<div>
					{errors.map((e, i) => (
						<p key={i}>{e.message}</p>
					))}
				</div>
			) : (
				<>
					<SyncMonitor />
					<Report />
				</>
			)}
		</div>
	);
};
