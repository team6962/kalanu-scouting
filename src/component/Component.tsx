import { ChangeEvent, Dispatch } from 'react';
import { assertBoolean, assertString, Operator, resolveOperator } from 'renegade-js';
import { FlowState } from '../flow/Flow';
import { TimerPhase } from '../view/ViewSchema';
import { ComponentSchema, ComponentSchemaType } from './ComponentSchema';

import * as styles from './Component.module.scss';

interface ComponentProps {
	component: ComponentSchema;
	phase: TimerPhase | null;

	disabled?: boolean;

	state: FlowState;
	setState: Dispatch<FlowState>;
}

export const Component: React.FC<ComponentProps> = ({
	component,
	state,
	disabled: disabledProp,
	phase,
	setState
}) => {
	const resolve = (operator: Operator) =>
		resolveOperator(operator, state, { phase: phase ? phase.id : null });

	const name = component.name ? resolve(component.name) : component.id;
	assertString(name);

	const disabled =
		disabledProp || (component.disabled !== undefined ? resolve(component.disabled) : false);
	assertBoolean(disabled);

	switch (component.type) {
		case ComponentSchemaType.Event:
			const handleEvent = () => {
				const includeTime =
					component.includeTime === undefined ? true : component.includeTime;

				setState({
					...state,
					events: [
						{
							id: component.eventId || component.id,
							time: includeTime ? (Date.now() - state.start) / 1000 : null,
							phase: phase ? phase.id : null,
							payload: component.eventPayload || null
						},
						...state.events
					]
				});
			};

			const backgroundColor = component.color ? resolve(component.color) : '#d8dada';
			assertString(backgroundColor);

			return (
				<input
					type="button"
					value={name}
					onClick={handleEvent}
					disabled={disabled}
					style={{ backgroundColor }}
				/>
			);
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
		case ComponentSchemaType.StaticText:
			const value = resolve(component.value);
			assertString(value);

			return <p className={styles.staticText}>{value}</p>;
	}
};
