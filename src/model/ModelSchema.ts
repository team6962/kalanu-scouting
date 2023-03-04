import { FlowSchema } from '../flow/FlowSchema';

export interface ModelSchema {
	/**
	 * used internally
	 */
	id: string;
	/**
	 * each entry on the model is a possible flow a user can select.
	 */
	flows: FlowSchema[];
}
