import { ViewSchema } from '../view/ViewSchema';

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

export interface FlowOptions {
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
	 * whether this flow needs a valid chosen match to be selected.
	 * @default true
	 */
	requiresMatch?: boolean;
}

export interface FlowSchema {
	/**
	 * the id of the flow. not shown to the user.
	 */
	id: string;
	/**
	 * the name of the flow, as displayed to the user.
	 */
	name: string;
	/**
	 * a view or an array of views the flow progresses through.
	 */
	views: ViewSchema | ViewSchema[];

	options?: FlowOptions;
}
