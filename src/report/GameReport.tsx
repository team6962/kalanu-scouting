import { useAppDispatch, useAppSelector } from '../state/hooks';
import { ReportEvent, ReportEventType } from '../state/Report';
import { addEvent, finishGame, selectEvents, undoEvent } from '../state/slices/reportSlice';
import { useStopwatch } from './useStopwatch';
import { Line } from 'rc-progress';

import * as styles from './GameReport.module.scss';

interface StopwatchProps {
	time: number;
	totalTime: number;
}

const autonLength = 15 * 1000;
const gameLength = 150 * 1000;

export const Stopwatch: React.FC<StopwatchProps> = ({ time, totalTime }) => (
	<>
		<p>
			{Math.floor(time / (1000 * 60))}m {((time / 1000) % 60).toFixed(1)}s
		</p>
		<Line
			percent={(time / totalTime) * 100}
			strokeWidth={8}
			trailWidth={8}
			strokeLinecap="square"
		/>
	</>
);

export const GameReport: React.FC = () => {
	const time = useStopwatch(100);
	const dispatch = useAppDispatch();

	const events = useAppSelector(selectEvents);

	// if an auton event has been fired or if 15 seconds have elapsed
	const autonOver =
		events.find((event) => event.type === ReportEventType.Auton) !== undefined ||
		time > autonLength;
	// if 2 minutes 30 seconds have elapsed
	const gameOver = time > gameLength;

	// find the index of the most recent score event (lets us slice the event array)
	const scoreIndex = events.findIndex((event) => event.type === ReportEventType.Score);
	const pieceHeld =
		// if we found a score event, only check events after. otherwise, check all events
		(scoreIndex === -1 ? events : events.slice(0, scoreIndex)).find(
			(event) => event.type === ReportEventType.Pickup
		) as ReportEvent & { type: ReportEventType.Pickup };

	// if we have attempted docking, find the engage state
	const dockingEvent = events.find(
		(event) => event.type === ReportEventType.Docking
	) as ReportEvent & { type: ReportEventType.Docking };
	let engaged: boolean | undefined = undefined;
	if (dockingEvent !== undefined) engaged = dockingEvent.engaged;

	return (
		<div className={styles.game}>
			<div>
				<Stopwatch time={time} totalTime={autonOver ? gameLength : autonLength} />
				{autonOver ? (
					<input
						type="button"
						onClick={() => dispatch(undoEvent())}
						value="Undo"
						disabled={events.length === 0}
					/>
				) : null}
			</div>
			{autonOver ? (
				<div>
					<div>
						<input
							type="button"
							onClick={() =>
								dispatch(
									addEvent({
										time,
										type: ReportEventType.Pickup,
										piece: 'box'
									})
								)
							}
							value={`Box${
								pieceHeld !== undefined ? ` (drop last ${pieceHeld.piece})` : ''
							}`}
						/>
						<input
							type="button"
							onClick={() =>
								dispatch(
									addEvent({
										time,
										type: ReportEventType.Pickup,
										piece: 'cone'
									})
								)
							}
							value={`Cone${
								pieceHeld !== undefined ? ` (drop last ${pieceHeld.piece})` : ''
							}`}
						/>
					</div>
					<div>
						<input
							type="button"
							onClick={() =>
								dispatch(
									addEvent({
										time,
										type: ReportEventType.Score,
										row: 1
									})
								)
							}
							disabled={pieceHeld === undefined}
							value="1"
						/>
						<input
							type="button"
							onClick={() =>
								dispatch(
									addEvent({
										time,
										type: ReportEventType.Score,
										row: 2
									})
								)
							}
							disabled={pieceHeld === undefined}
							value="2"
						/>
						<input
							type="button"
							onClick={() =>
								dispatch(
									addEvent({
										time,
										type: ReportEventType.Score,
										row: 3
									})
								)
							}
							disabled={pieceHeld === undefined}
							value="3"
						/>
					</div>
					<div>
						<input
							type="button"
							onClick={() =>
								dispatch(
									addEvent({
										time,
										type: ReportEventType.Docking,
										engaged: !engaged
									})
								)
							}
							/* if we haven't docked yet, do that. otherwise, toggle engage state */
							value={
								engaged === undefined ? 'Dock' : engaged ? 'Disengage' : 'Engage'
							}
						/>
						<input
							type="button"
							onClick={() => dispatch(finishGame())}
							value="End game"
							disabled={!gameOver}
						/>
					</div>
				</div>
			) : (
				<div>
					<div>
						<input
							type="button"
							onClick={() =>
								dispatch(addEvent({ time, type: ReportEventType.Auton }))
							}
							value="Auton"
						/>
					</div>
				</div>
			)}
		</div>
	);
};
