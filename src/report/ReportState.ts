import { FlowState } from '../flow/Flow';

export interface ReportState extends FlowState {
	// meta
	id: string;
	modelId: string;
	flowId: string;

	// setup
	year: number;
	eventId: string;
	matchId: string;
	teamId: string;
}
