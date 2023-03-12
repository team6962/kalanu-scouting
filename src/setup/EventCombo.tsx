import { useEventsByYearSimple } from '../api/api';
import { EventSimple } from '../api/types';
import { ComboBox, ComboPlaceholder } from './ComboBox';

interface EventComboProps {
	year: number;
	value: EventSimple | null;
	onChange: (event: EventSimple | null) => void;
	disabled?: boolean;
}

export const EventCombo: React.FC<EventComboProps> = ({ year, value, onChange, disabled }) => {
	// fetch events from api
	const [events, eventsLoading, eventsError] = useEventsByYearSimple(year);

	// if year changes to one other than this event, unset it
	if (value !== null && value.year !== year) onChange(null);

	// prep handler
	const eventToString = (event: EventSimple | null) => {
		if (event === null) return '';
		return event.name;
	};

	// if events aren't ready to display
	return events === undefined || eventsLoading || eventsError !== undefined ? (
		// show dummy element
		<ComboPlaceholder placeholder="event" />
	) : (
		// otherwise show picker
		<ComboBox
			items={events}
			//
			value={value}
			onChange={onChange}
			//
			itemToString={eventToString}
			itemToKey={(event) => event.key}
			//
			itemMatchesSearch={(item, input) =>
				eventToString(item).toLowerCase().includes(input.toLowerCase())
			}
			//
			sortItems={(a, b) => a.event_code.localeCompare(b.event_code)}
			//
			placeholder="event"
			label="event: "
			disabled={disabled}
		/>
	);
};
