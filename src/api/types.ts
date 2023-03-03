// simple match stuff
export namespace MatchSimple {
	export enum CompLevelEnum {
		Qm = <any>'qm',
		Ef = <any>'ef',
		Qf = <any>'qf',
		Sf = <any>'sf',
		F = <any>'f'
	}

	export enum WinningAllianceEnum {
		Red = <any>'red',
		Blue = <any>'blue',
		Empty = <any>''
	}
}

export interface MatchAlliance {
	/**
	 * Score for this alliance. Will be null or -1 for an unplayed match.
	 */
	score: number;

	team_keys: Array<string>;
	/**
	 * TBA team keys (eg `frc254`) of any teams playing as a surrogate.
	 */
	surrogate_team_keys?: Array<string>;
	/**
	 * TBA team keys (eg `frc254`) of any disqualified teams.
	 */
	dq_team_keys?: Array<string>;
}

/**
 * A list of alliances, the teams on the alliances, and their score.
 */
export interface MatchSimpleAlliances {
	red?: MatchAlliance;
	blue?: MatchAlliance;
}

export interface MatchSimple {
	/**
	 * TBA match key with the format `yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER]`, where `yyyy` is the year, and `EVENT_CODE` is the event code of the event, `COMP_LEVEL` is (qm, ef, qf, sf, f), and `MATCH_NUMBER` is the match number in the competition level. A set number may append the competition level if more than one match in required per set.
	 */
	key: string;
	/**
	 * The competition level the match was played at.
	 */
	comp_level: MatchSimple.CompLevelEnum;
	/**
	 * The set number in a series of matches where more than one match is required in the match series.
	 */
	set_number: number;
	/**
	 * The match number of the match in the competition level.
	 */
	match_number: number;

	alliances?: MatchSimpleAlliances;
	/**
	 * The color (red/blue) of the winning alliance. Will contain an empty string in the event of no winner, or a tie.
	 */
	winning_alliance?: MatchSimple.WinningAllianceEnum;
	/**
	 * Event key of the event the match was played at.
	 */
	event_key: string;
	/**
	 * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the scheduled match time, as taken from the published schedule.
	 */
	time?: number;
	/**
	 * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the TBA predicted match start time.
	 */
	predicted_time?: number;
	/**
	 * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of actual match start time.
	 */
	actual_time?: number;
}

// simple team stuff
export interface TeamSimple {
	/**
	 * TBA team key with the format `frcXXXX` with `XXXX` representing the team number.
	 */
	key: string;
	/**
	 * Official team number issued by FIRST.
	 */
	team_number: number;
	/**
	 * Team nickname provided by FIRST.
	 */
	nickname?: string;
	/**
	 * Official long name registered with FIRST.
	 */
	name: string;
	/**
	 * City of team derived from parsing the address registered with FIRST.
	 */
	city?: string;
	/**
	 * State of team derived from parsing the address registered with FIRST.
	 */
	stateProv?: string;
	/**
	 * Country of team derived from parsing the address registered with FIRST.
	 */
	country?: string;
}
