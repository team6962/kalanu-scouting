import { ChangeEvent, Dispatch } from 'react';
import { ComponentSchema, ComponentSchemaType } from './ComponentSchema';
import { FlowState } from '../flow/Flow';

import * as styles from './Component.module.scss';

interface ComponentProps {
	component: ComponentSchema;

	state: FlowState;
	setState: Dispatch<FlowState>;
}

export const Component: React.FC<ComponentProps> = ({ component, state, setState }) => {
	switch (component.type) {
		case ComponentSchemaType.Event:
			const handleEvent = () => {
				setState({
					...state,
					events: [
						...state.events,
						{
							id: component.eventId || component.id,
							time: component.includeTime ? Date.now() : undefined,
							payload: component.eventPayload
						}
					]
				});
			};

			return <input type="button" value={component.name} onClick={handleEvent} />;
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
					/>
					{component.name}
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
					{component.name}
					<input
						type="text"
						value={state.data[component.id] as string}
						onChange={handleText}
						placeholder={component.name}
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
					placeholder={component.name}
				/>
			);
	}
};
