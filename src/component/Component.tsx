import { ChangeEvent, Dispatch } from 'react';
import { assertBoolean, assertString, Operator, resolveOperator } from 'renegade';
import { FlowState } from '../flow/Flow';
import { ComponentSchema, ComponentSchemaType } from './ComponentSchema';

import * as styles from './Component.module.scss';
import { TimerPhase } from '../view/ViewSchema';

interface ComponentProps {
	component: ComponentSchema;
	phase: TimerPhase | null;

	state: FlowState;
	setState: Dispatch<FlowState>;
}

export const Component: React.FC<ComponentProps> = ({ component, state, phase, setState }) => {
	const resolve = (operator: Operator) =>
		resolveOperator(operator, state, { phase: phase ? phase.id : null });

	const name = resolve(component.name);
	assertString(name);

	const disabled = component.disabled !== undefined ? resolve(component.disabled) : false;
	assertBoolean(disabled);

	switch (component.type) {
		case ComponentSchemaType.Event:
			const handleEvent = () => {
				setState({
					...state,
					events: [
						{
							id: component.eventId || component.id,
							time: component.includeTime ? Date.now() : null,
							phase: phase ? phase.id : null,
							payload: component.eventPayload || null
						},
						...state.events
					]
				});
			};

			return <input type="button" value={name} onClick={handleEvent} disabled={disabled} />;
		case ComponentSchemaType.Toggle:
			const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
				setState({
					...state,
					data: {
						...state.data,
						[component.id]: event.target.checked
					}
				});
			};

			return (
				<label className={styles.toggle}>
					<input
						type="checkbox"
						checked={state.data[component.id] as boolean}
						onChange={handleToggle}
						disabled={disabled}
					/>
					{name}
				</label>
			);
		case ComponentSchemaType.Text:
			const handleText = (event: ChangeEvent<HTMLInputElement>) => {
				setState({
					...state,
					data: {
						...state.data,
						[component.id]: event.target.value
					}
				});
			};

			return (
				<label>
					{name}
					<input
						type="text"
						value={state.data[component.id] as string}
						onChange={handleText}
						placeholder={name}
						disabled={disabled}
					/>
				</label>
			);
		case ComponentSchemaType.LongText:
			const handleLongText = (event: ChangeEvent<HTMLTextAreaElement>) => {
				setState({
					...state,
					data: {
						...state.data,
						[component.id]: event.target.value
					}
				});
			};

			return (
				<textarea
					className={styles.longText}
					value={state.data[component.id] as string}
					onChange={handleLongText}
					placeholder={name}
					disabled={disabled}
				/>
			);
	}
};
