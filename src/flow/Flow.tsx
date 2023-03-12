import { useState } from 'react';
import { ComponentSchemaType } from '../component/ComponentSchema';
import { View, ViewEvent } from '../view/View';
import { ViewSchema } from '../view/ViewSchema';
import { FlowSchema } from './FlowSchema';

import * as styles from './Flow.module.scss';

interface FlowProps {
	flow: FlowSchema;
	initialState?: FlowState;
	onSubmit?: (state: FlowState) => void;
	onExit?: () => void;
}

export type FlowState = {
	start: number;
	events: ViewEvent[];
	data: Record<string, string | boolean>;
};

const reduceViewToInitialData = (view: ViewSchema): FlowState['data'] => {
	const data: FlowState['data'] = {};
	for (const comp of view.components) {
		if (comp.type === ComponentSchemaType.Toggle) data[comp.id] = comp.default || false;
		if (comp.type === ComponentSchemaType.Text || comp.type === ComponentSchemaType.LongText)
			data[comp.id] = comp.default || '';
	}
	return data;
};

export const Flow: React.FC<FlowProps> = ({ flow, initialState, onSubmit, onExit }) => {
	if (initialState === undefined) {
		let data: FlowState['data'] = {};
		if (flow.views instanceof Array) {
			for (const view of flow.views) {
				data = { ...data, ...reduceViewToInitialData(view) };
			}
		} else {
			data = { ...data, ...reduceViewToInitialData(flow.views) };
		}

		initialState = { start: Date.now(), events: [], data };
	}

	const [state, setState] = useState<FlowState>(initialState);
	const [view, setView] = useState(0);

	let current: ViewSchema = flow.views instanceof Array ? flow.views[view] : flow.views;
	let previous: ViewSchema | null = null;
	let next: ViewSchema | null = null;

	if (flow.views instanceof Array) {
		if (view > 0) previous = flow.views[view - 1];
		if (view < flow.views.length - 1) next = flow.views[view + 1];
	}

	return (
		<div className={styles.flow}>
			<View state={state} setState={setState} view={current} />
			<div className={styles.controls}>
				{previous ? (
					<input
						type="button"
						value={`return to ${previous.name || previous.id}`}
						onClick={() => setView(view - 1)}
					/>
				) : (
					<input
						type="button"
						value={`cancel report`}
						onClick={() => onExit && onExit()}
					/>
				)}
				{next ? (
					<input
						type="button"
						value={`continue to ${next.name || next.id}`}
						onClick={() => setView(view + 1)}
					/>
				) : (
					<input
						type="button"
						value={`submit report`}
						onClick={() => onSubmit && onSubmit(state)}
					/>
				)}
			</div>
		</div>
	);
};
