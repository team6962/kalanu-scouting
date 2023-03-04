import { Dispatch } from 'react';
import { Component } from '../component/Component';
import { FlowState } from '../flow/Flow';
import { ViewSchema } from './ViewSchema';

import * as styles from './View.module.scss';

interface ViewProps {
	view: ViewSchema;

	state: FlowState;
	setState: Dispatch<FlowState>;

	onExit?: () => void;
}

export interface ViewEvent {
	id: string;
	time?: number;
	payload?: any;
}

export const View: React.FC<ViewProps> = ({ view, state, setState, onExit }) => {
	return (
		<div className={styles.view}>
			{view.layout.map((row, i) => (
				<div key={i}>
					{row.map((key) => (
						<Component
							key={key}
							component={view.components.find((comp) => comp.id === key)!}
							state={state}
							setState={setState}
						/>
					))}
				</div>
			))}
			<input type="button" value={`end ${view.name || view.id}`} onClick={onExit} />
		</div>
	);
};
