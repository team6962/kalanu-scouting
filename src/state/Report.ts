export enum ReportEventType {
	Auton,
	Pickup,
	Score,
	Docking
}

export type ReportEvent = {
	time: number;
	type: ReportEventType;
} & (
	| { type: ReportEventType.Auton }
	| { type: ReportEventType.Pickup; piece: 'box' | 'cone' }
	| { type: ReportEventType.Score; row: number }
	| { type: ReportEventType.Docking; engaged: boolean }
);

export interface Report {
	// meta
	id: string;
	// pregame
	matchId: string;
	teamId: string;
	// game
	events: ReportEvent[];
	// postgame
	notes: string;
	fouled: boolean;
	parked: boolean;
}
