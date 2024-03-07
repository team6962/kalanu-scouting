import { useState } from 'react';
import { EventSimple, MatchSimple, TeamSimple } from '../api/types';
import { FlowSchema } from '../flow/FlowSchema';
import { ModelSchema } from '../model/ModelSchema';
import { ComboPlaceholder } from '../comboBox/ComboBox';
import { EventCombo } from './EventCombo';
import { MatchCombo } from './MatchCombo';
import { TeamCombo } from './TeamCombo';
import { YearPicker } from './YearPicker';

import * as styles from './Setup.module.scss';

interface SetupProps {
	year?: number;
	setYear?: (year: number) => void;
	event?: EventSimple | null;
	setEvent?: (event: EventSimple | null) => void;
	match?: MatchSimple | null;
	setMatch?: (match: MatchSimple | null) => void;
	team?: TeamSimple | null;
	setTeam?: (team: TeamSimple | null) => void;

	onFlowStart: (flow: FlowSchema) => void;
	model: ModelSchema | ((year: number) => ModelSchema);
}

export const Setup: React.FC<SetupProps> = ({
	year,
	setYear,
	event,
	setEvent,
	match,
	setMatch,
	team,
	setTeam,

	onFlowStart,
	model: modelGetter
}) => {
	if (year === undefined) [year, setYear] = useState(new Date().getFullYear());
	if (event === undefined) [event, setEvent] = useState<EventSimple | null>(null);
	if (match === undefined) [match, setMatch] = useState<MatchSimple | null>(null);
	if (team === undefined) [team, setTeam] = useState<TeamSimple | null>(null);

	const model = modelGetter instanceof Function ? modelGetter(year!) : modelGetter;

	return (
		<div className={styles.pregame}>
			<div className={styles.yearAndEvent}>
				<YearPicker year={year!} setYear={(year) => setYear && setYear(year)} />
				{year !== null ? (
					<EventCombo
						year={year!}
						value={event!}
						onChange={(event) => setEvent && setEvent(event)}
					/>
				) : (
					<ComboPlaceholder placeholder="event" />
				)}
			</div>
			{event !== null ? (
				<>
					<MatchCombo
						event={event}
						value={match}
						onChange={(match) => setMatch && setMatch(match)}
						team={team}
					/>
					<TeamCombo
						event={event}
						value={team}
						onChange={(team) => setTeam && setTeam(team)}
						match={match}
					/>
				</>
			) : (
				<>
					<ComboPlaceholder placeholder="match" />
					<ComboPlaceholder placeholder="team" />
				</>
			)}
			<div className={styles.flowPicker}>
				{model.flows.map((flow) => {
					const requiresMatch = flow.options
						? flow.options.requiresMatch === undefined || flow.options.requiresMatch
						: true;
					const disabled =
						year === null ||
						event === null ||
						team === null ||
						(requiresMatch ? match === null : false);

					return (
						<input
							key={flow.id}
							type="button"
							value={`start ${flow.name}`}
							disabled={disabled}
							onClick={() => onFlowStart(flow)}
						/>
					);
				})}
				<input
                id="clear"
                type="button"
                value="Clear"
                onClick={() => {
                    match=null;
                    team=null;
                }}
            />
			</div>
		</div>
	);
};
