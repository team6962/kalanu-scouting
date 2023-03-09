import { nanoid } from 'nanoid';
import { useState } from 'react';
import { EventSimple } from '../api/types';
import { Flow, FlowState } from '../flow/Flow';
import { FlowSchema } from '../flow/FlowSchema';
import { Model2023 } from '../Model2023';
import { Setup, SetupInfo } from '../setup/Setup';
import { Status } from '../status/Status';
import { useLocalStorage } from './useLocalStorage';
import { ReportState } from './ReportState';

import * as styles from './Report.module.scss';

export const Report: React.FC = () => {
	const [state, setState] = useState<'setup' | 'active'>('setup');
	const [flow, setFlow] = useState<FlowSchema>();

	const [setupInfo, setSetupInfo] = useState<Partial<SetupInfo>>();

	// persist chosen year and event in localstorage so they don't need to be picked repeatedly
	const [initialYear, setInitialYear] = useLocalStorage('initialYear', 2022);
	const [initialEvent, setInitialEvent] = useLocalStorage<EventSimple>('initialEvent', {
		city: 'San Francisco',
		country: 'USA',
		end_date: '2022-03-20',
		event_code: 'casf',
		event_type: 0,
		key: '2022casf',
		name: 'San Francisco Regional',
		start_date: '2022-03-17',
		state_prov: 'CA',
		year: 2022
	});

	const [reports, setReports] = useLocalStorage<ReportState[]>('reports', []);

	const onSetupSubmit = ({ year, event, match, team, flow }: SetupInfo) => {
		setFlow(flow);
		setState('active');

		setInitialYear(year);
		setInitialEvent(event);
		setSetupInfo({ year, event, match, team });
	};

	const onFlowSubmit = (state: FlowState) => {
		const report: Partial<ReportState> = structuredClone(state);
		setState('setup');

		report.id = nanoid();
		report.modelId = Model2023.id;
		report.flowId = flow?.id;

		report.year = setupInfo?.year;
		report.eventId = setupInfo?.event?.key;
		report.matchId = setupInfo?.match?.key;
		report.teamId = setupInfo?.team?.key;

		setReports([...reports, report as ReportState]);
	};

	return (
		<div className={styles.report}>
			<div>
				<Status reports={reports} setReports={setReports} />
				{state === 'setup' ? (
					<Setup
						initialYear={initialYear}
						initialEvent={initialEvent}
						onSubmit={onSetupSubmit}
						model={Model2023}
					/>
				) : null}
				{state === 'active' ? <Flow flow={flow!} onSubmit={onFlowSubmit} /> : null}
			</div>
		</div>
	);
};
