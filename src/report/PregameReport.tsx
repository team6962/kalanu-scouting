import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { startGame } from '../state/slices/reportSlice';
import { selectMatches, selectTeams } from '../state/slices/offlineSlice';
import { MatchSimple, TeamSimple } from '../api/types';
import { Combobox } from './Combobox';

import * as styles from './PregameReport.module.scss';

const matchLevels: Record<string, string> = {
	qm: 'Quals',
	ef: 'Match',
	qf: 'Quarters',
	sf: 'Semis',
	f: 'Finals'
};

export const PregameReport: React.FC = () => {
	const [team, setTeam] = useState<TeamSimple | null>(null);
	const [match, setMatch] = useState<MatchSimple | null>(null);

	const matches = useAppSelector(selectMatches);
	const teams = useAppSelector(selectTeams);

	const dispatch = useAppDispatch();
	const startHandler = () => {
		dispatch(
			startGame({
				matchId: match?.key!,
				teamId: team?.key!
			})
		);
	};

	return (
		<div className={styles.pregame}>
			<div>
				<Combobox
					choices={matches}
					value={match}
					onChange={(match) => setMatch(match)}
					itemMatchesSearch={(match, search) => {
						const teamDefined = team !== null;
						const teamInMatch: boolean =
							teamDefined &&
							match.alliances !== undefined &&
							(match.alliances.blue!.team_keys!.includes(team.key) ||
								match.alliances.red!.team_keys!.includes(team.key));
						const matchesSearch =
							search !== null &&
							search
								.split(' ')
								.some(
									(chunk) =>
										match.match_number.toString().includes(chunk) ||
										matchLevels[match.comp_level]
											.toLowerCase()
											.includes(chunk.toLowerCase())
								);
						return teamDefined ? teamInMatch && matchesSearch : matchesSearch;
					}}
					itemToString={(match) =>
						match === null
							? ''
							: `${matchLevels[match.comp_level]} ${match.match_number}${
									match.comp_level !== 'qm' ? ` Match ${match.set_number}` : ''
							  }`
					}
					itemToKey={(match) => match.key}
					placeholder={'match'}
					hoverClass={styles.hover}
					activeClass={styles.active}
				/>
				<Combobox
					choices={teams}
					value={team}
					onChange={(team) => setTeam(team)}
					itemMatchesSearch={(team, search) => {
						const matchDefined = match !== null;
						const teamInMatch: boolean =
							matchDefined &&
							match.alliances !== undefined &&
							// tba-api-typescript doesn't accurately type api results,
							// but that's a later problem
							(match.alliances.blue!.team_keys!.includes(team.key) ||
								match.alliances.red!.team_keys!.includes(team.key));
						const matchesSearch =
							search !== null &&
							search
								.split(' ')
								.some(
									(chunk) =>
										team.team_number.toString().includes(chunk) ||
										team.nickname.toLowerCase().includes(chunk.toLowerCase())
								);
						return matchDefined ? teamInMatch && matchesSearch : matchesSearch;
					}}
					itemToString={(team) =>
						team === null ? '' : `${team.team_number}: ${team.nickname}`
					}
					itemToKey={(team) => team.team_number}
					placeholder={'team'}
					hoverClass={styles.hover}
					activeClass={styles.active}
				/>
			</div>
			<input
				type="button"
				onClick={startHandler}
				value="start match"
				disabled={team === null || match === null}
			/>
		</div>
	);
};
