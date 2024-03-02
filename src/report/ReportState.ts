import { FlowState } from '../flow/Flow';

export interface ReportState extends FlowState {
	// meta
	id: string;
	appVersion: string;
	modelId: string;
	modelVersion: string;
	flowId: string;

	// setup
	year: number;
	eventId: string | null;
	matchId: string | null;
	teamId: string | null;

	// event type counts
	ampAuton: number;
	speakerAuton: number;
	ampTeleop: number;
	speakerTeleop: number;
	trap: number;
	hung: boolean;
}
