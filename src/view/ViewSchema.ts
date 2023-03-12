import { Operator } from 'renegade-js';
import { ComponentSchema } from '../component/ComponentSchema';

export interface TimerPhase {
	/**
	 * the length of the phase, in seconds.
	 */
	length: number;
	/**
	 * the id of the phase. used by your components and internally.
	 */
	id: string;
	/**
	 * the name of the phase as displayed to the user.
	 */
	name?: string;
	/**
	 * the color taken by the timer during this phase. hex.
	 * @default '#4979db'
	 */
	color?: string;
}

export interface ViewSchemaOptions {
	/**
	 * display total and elapsed match length at the top of the screen.
	 * @default true
	 */
	showTimer?: boolean;
	/**
	 * length of the match, in seconds. only used if `showTimer` is set to `true`.
	 * @default 150
	 */
	timerLength?: number;
	/**
	 * phases of the timer. can be referenced by components.
	 * @default []
	 */
	timerPhases?: TimerPhase[];

	/**
	 * show event undo button.
	 * @default true
	 */
	showUndo?: boolean;
	/**
	 * allow undoing events from a previous phase.
	 * @default false
	 */
	undoAcrossPhases?: boolean;
}

export interface ViewSchema {
	/**
	 * used to distinguish between views and the data collected from them internally.
	 */
	id: string;
	/**
	 * the name of the view, as displayed to the user.
	 */
	name?: string;

	/**
	 * components that make up the view.
	 * will not be displayed unless included in layout.
	 */
	components: ComponentSchema[];

	/**
	 * an array of arrays containing component ids.
	 * rows do not need to be of equal length.
	 */
	layout: Operator;

	/**
	 * additional options to control how the view behaves.
	 */
	options?: ViewSchemaOptions;
}
