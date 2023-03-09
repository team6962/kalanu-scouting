// simple match stuff
export namespace MatchSimple {
	export enum CompLevelEnum {
		Quals = 'qm',
		Match = 'ef',
		Quarters = 'qf',
		Semis = 'sf',
		Finals = 'f'
	}

	export enum WinningAllianceEnum {
		Red = 'red',
		Blue = 'blue',
		Empty = ''
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
	state_prov?: string;
	/**
	 * Country of team derived from parsing the address registered with FIRST.
	 */
	country?: string;
}

// simple event stuff
export interface DistrictList {
	/**
	 * The short identifier for the district.
	 */
	abbreviation: string;
	/**
	 * The long name for the district.
	 */
	display_name: string;
	/**
	 * Key for this district, e.g. `2016ne`.
	 */
	key: string;
	/**
	 * Year this district participated.
	 */
	year: number;
}

export interface EventSimple {
	/**
	 * TBA event key with the format yyyy[EVENT_CODE], where yyyy is the year, and EVENT_CODE is the event code of the event.
	 */
	key: string;
	/**
	 * Official name of event on record either provided by FIRST or organizers of offseason event.
	 */
	name: string;
	/**
	 * Event short code, as provided by FIRST.
	 */
	event_code: string;
	/**
	 * Event Type, as defined here: https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/event_type.py#L2
	 */
	event_type: number;

	district?: DistrictList;
	/**
	 * City, town, village, etc. the event is located in.
	 */
	city?: string;
	/**
	 * State or Province the event is located in.
	 */
	state_prov?: string;
	/**
	 * Country the event is located in.
	 */
	country?: string;
	/**
	 * Event start date in `yyyy-mm-dd` format.
	 */
	start_date: string;
	/**
	 * Event end date in `yyyy-mm-dd` format.
	 */
	end_date: string;
	/**
	 * Year the event data is for.
	 */
	year: number;
}
