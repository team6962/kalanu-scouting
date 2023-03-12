import { FlowSchema } from '../flow/FlowSchema';

export interface ModelSchema {
	/**
	 * used internally
	 */
	id: string;
	/**
	 * handy in data analysis to make sure everyone is up-to-date. recommended to use semver
	 */
	version: string;
	/**
	 * each entry on the model is a possible flow a user can select.
	 */
	flows: FlowSchema[];
}
