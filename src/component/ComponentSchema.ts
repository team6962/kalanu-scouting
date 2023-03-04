export enum ComponentSchemaType {
	/**
	 * adds an event to the report. displayed as a button.
	 */
	Event = 'event',
	/**
	 * represents a boolean. displayed as a checkbox.
	 */
	Toggle = 'toggle',
	/**
	 * represents text. displayed as a one-line input.
	 */
	Text = 'text',
	/**
	 * represents text. displayed as a textarea.
	 */
	LongText = 'longtext'
}

export type ComponentSchema = {
	/**
	 * described further in the enum.
	 */
	type: ComponentSchemaType;
	/**
	 * displayed to the user.
	 */
	name: string;
	/**
	 * recorded internally and used for layouting.
	 */
	id: string;
} & (
	| {
			type: ComponentSchemaType.Event;
			/**
			 * specify if `eventId` is different from the component id.
			 * relevant if multiple buttons produce variations of a single event.
			 * @default id
			 */
			eventId?: string;
			/**
			 * optional additional data to include in the event.
			 * relevant if multiple buttons produce variations of a single event.
			 * @default undefined
			 */
			eventPayload?: any;
			/**
			 * whether the event should include the time elapsed
			 * since the start of the match in its payload. no effect
			 * unless `showTimer` is `true`
			 * @default true
			 */
			includeTime?: boolean;
	  }
	| {
			type: ComponentSchemaType.Toggle;
			/**
			 * the default value of the checkbox
			 * @default false
			 */
			default?: boolean;
	  }
	| {
			type: ComponentSchemaType.Text | ComponentSchemaType.LongText;
			/**
			 * the default value of the text input
			 * @default ''
			 */
			default?: string;
	  }
);
