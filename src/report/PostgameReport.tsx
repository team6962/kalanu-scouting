import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectReport, setPostgameInfo, startPregame } from '../state/slices/reportSlice';
import { addReport } from '../state/slices/offlineSlice';
import { store } from '../state/store';

import * as styles from './PostgameReport.module.scss';

export const PostgameReport: React.FC = () => {
	const dispatch = useAppDispatch();

	const report = useAppSelector(selectReport);
	const [fouled, setFouled] = useState(report.fouled);
	const [parked, setParked] = useState(report.parked);
	const [notes, setNotes] = useState(report.notes);

	const [submitted, setSubmitted] = useState(false);

	const submitHandler = () => {
		dispatch(
			setPostgameInfo({
				notes,
				fouled,
				parked
			})
		);

		const report = selectReport(store.getState());
		dispatch(addReport(report));

		setSubmitted(true);

		setTimeout(() => dispatch(startPregame()), 5000);
	};

	return (
		<div className={styles.postgame}>
			<div>
				<label>
					<input
						type="checkbox"
						checked={fouled}
						onChange={(e) => setFouled(e.target.checked)}
					/>
					<span>Fouled?</span>
				</label>
				<label>
					<input
						type="checkbox"
						checked={parked}
						onChange={(e) => setParked(e.target.checked)}
					/>
					<span>Parked?</span>
				</label>
			</div>
			<textarea
				placeholder="notes"
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
			></textarea>
			<input
				type="button"
				onClick={submitHandler}
				disabled={submitted}
				value={submitted ? 'report submitted' : 'submit report'}
			/>
		</div>
	);
};
