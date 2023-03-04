import { Report } from './report/Report';
import { useSync } from './useSync';

import * as styles from './App.module.scss';
import { SyncMonitor } from './SyncMonitor';

export const App: React.FC = () => {
	useSync();

	return (
		<div className={styles.app}>
			<SyncMonitor />
			<Report />
		</div>
	);
};
