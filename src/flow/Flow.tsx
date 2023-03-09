import { Dispatch, useState } from 'react';
import { ComponentSchemaType } from '../component/ComponentSchema';
import { View, ViewEvent } from '../view/View';
import { ViewSchema } from '../view/ViewSchema';
import { FlowSchema, TimerPhase } from './FlowSchema';

interface FlowProps {
	flow: FlowSchema;
	initialState?: FlowState;
	onSubmit?: Dispatch<FlowState>;
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

const resolveTimerPhase = (time: number, flow: FlowSchema): TimerPhase | null => {
	if (flow.options === undefined) return null;
	if (flow.options.timerPhases === undefined) return null;

	let currentTime = 0;
	for (const phase of flow.options.timerPhases) {
		if (currentTime + phase.length > time) return phase;
		else currentTime += phase.length;
	}
	return null;
};

export const Flow: React.FC<FlowProps> = ({ flow, initialState, onSubmit }) => {
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

	const onExit = () => {
		const useSubmit = flow.views instanceof Array ? view === flow.views.length - 1 : true;
		if (useSubmit) return onSubmit !== undefined && onSubmit(state);
		else return setView(view + 1);
	};

	return (
		<View
			state={state}
			setState={setState}
			view={flow.views instanceof Array ? flow.views[view] : flow.views}
			onExit={onExit}
		/>
	);
};
