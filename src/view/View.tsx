import {
	assertArray,
	assertString,
	JsonSerializable,
	Operator,
	resolveOperator
} from 'renegade-js';
import { Component } from '../component/Component';
import { FlowState } from '../flow/Flow';
import { Stopwatch } from './stopwatch/Stopwatch';
import { useStopwatch } from './stopwatch/useStopwatch';
import { TimerPhase, ViewSchema } from './ViewSchema';

import * as styles from './View.module.scss';

interface ViewProps {
	view: ViewSchema;

	state: FlowState;
	setState: (state: FlowState) => void;
}

export type ViewEvent = {
	id: string;
	phase: string | null;
	time: number | null;
	payload: Record<string, JsonSerializable> | null;
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

export const View: React.FC<ViewProps> = ({ view, state, setState }) => {
	const time = useStopwatch(100, state.start);
	const phase = resolveTimerPhase(time, view);

	const resolve = (operator: Operator) =>
		resolveOperator(operator, state, { phase: phase ? phase.id : null });

	const rows = resolve(view.layout);
	assertArray(rows);
	const layout = rows.map((row) => {
		assertArray(row);
		return row.map((item) => {
			if (item === null) return null;
			assertString(item);
			return item;
		});
	});

	const handleUndo = () => {
		setState({
			...state,
			events: state.events.slice(1)
		});
	};

	const undoDisabled = () => {
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

			{layout.map((row, i) => (
				<div key={i}>
					{row.map((key) =>
						key ? (
							<Component
								key={key}
								component={view.components.find((comp) => comp.id === key)!}
								phase={phase}
								state={state}
								setState={setState}
							/>
						) : null
					)}
				</div>
			))}
		</div>
	);
};
