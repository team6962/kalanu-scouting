import { Dispatch, useState } from 'react';
import { JsonSerializable } from 'renegade';
import { Component } from '../component/Component';
import { FlowState } from '../flow/Flow';
import { Stopwatch } from './stopwatch/Stopwatch';
import { useStopwatch } from './stopwatch/useStopwatch';
import { TimerPhase, ViewSchema } from './ViewSchema';

import * as styles from './View.module.scss';

interface ViewProps {
	view: ViewSchema;

	state: FlowState;
	setState: Dispatch<FlowState>;

	onExit?: () => void;
}

export type ViewEvent = {
	id: string;
	phase: string | null;
	time: number | null;
	payload: JsonSerializable | null;
};

const resolveTimerPhase = (time: number, view: ViewSchema): TimerPhase | null => {
	if (view.options === undefined) return null;
	if (view.options.timerPhases === undefined) return null;

	let currentTime = 0;
	for (const phase of view.options.timerPhases) {
		if (currentTime + phase.length > time) return phase;
		else currentTime += phase.length;
	}
	return null;
};

export const View: React.FC<ViewProps> = ({ view, state, setState, onExit }) => {
	const time = useStopwatch(100, state.start);
	const phase = resolveTimerPhase(time, view);

	const [exited, setExited] = useState(false);
	const handleExit = () => {
		setExited(true);
		if (onExit) onExit();
	};

	const handleUndo = () => {
		setState({
			...state,
			events: state.events.slice(1)
		});
	};

	const undoDisabled = () => {
		if (exited) return true;
		if (state.events.length === 0) return true;
		if (view.options && view.options.undoAcrossPhases !== true) {
			if (state.events[0].phase === null) return false;
			if (phase === null) return false;
			return state.events[0].phase !== phase.id;
		} else {
			return false;
		}
	};

	const showTimer =
		view.options === undefined ||
		view.options.showTimer === undefined ||
		view.options.showTimer === true;
	const showUndo =
		view.options === undefined ||
		view.options.showUndo === undefined ||
		view.options.showUndo === true;

	return (
		<div className={styles.view}>
			{showTimer || showUndo ? (
				<div className={styles.timerAndUndo}>
					{showTimer ? (
						<Stopwatch
							time={time}
							totalTime={view.options ? view.options.timerLength || 150 : 150}
							strokeColor={phase ? phase.color || '#4979db' : '#4979db'}
						/>
					) : null}

					{showUndo ? (
						<input
							type="button"
							value={'undo'}
							onClick={handleUndo}
							disabled={undoDisabled()}
						/>
					) : null}
				</div>
			) : null}

			{view.layout.map((row, i) => (
				<div key={i}>
					{row.map((key: string) => (
						<Component
							key={key}
							component={view.components.find((comp) => comp.id === key)!}
							disabled={exited}
							phase={phase}
							state={state}
							setState={setState}
						/>
					))}
				</div>
			))}

			<input
				type="button"
				value={`${exited ? 'ending' : 'end'} ${view.name || view.id}`}
				onClick={handleExit}
				disabled={exited}
			/>
		</div>
	);
};
