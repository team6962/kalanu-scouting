import { ViewSchema } from '../view/ViewSchema';

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
}
