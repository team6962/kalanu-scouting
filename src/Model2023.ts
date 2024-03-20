// fun fact this is actually Model2024 xD xD

import { Operator } from 'renegade-js';
import { ComponentSchemaType } from './component/ComponentSchema';
import { ModelSchema } from './model/ModelSchema';
import { ViewSchema } from './view/ViewSchema';

const currentlyHanging: Operator = {
	$ne: [
		{
			$indexOfArray: [
				{
					$map: {
						input: '$events',
						in: {
							$and: [
								{ $eq: ['$$this.id', 'hung'] },
								{ $eq: ['$$this.phase', '$$phase'] }
							]
						}
					}
				},
				true
			]
		},
		-1
	]
};

const timesScored: Operator = {
	$size: {
		$filter: {
			input: '$events',
			cond: {
				$in: ['$$this.id', ['amp', 'speaker', 'trap']]
			}
		}
	}
};


const evalView: ViewSchema = {
	id: 'eval_view',
	name: 'team evaluation',
	components: [
		{
			type: ComponentSchemaType.Toggle,
			name: 'broken',
			id: 'parked'
		},
		{
			type: ComponentSchemaType.Toggle,
			name: 'passing',
			id: 'passing'
		},
		{
			type: ComponentSchemaType.Toggle,
			name: 'unstable',
			id: 'unstable'
		},
		{
			type: ComponentSchemaType.Toggle,
			name: 'defending',
			id: 'defend'
		},
		{
			type: ComponentSchemaType.LongText,
			name: 'notes',
			id: 'notes'
		}
	],

	layout: [['parked', 'unstable', 'passing', 'defend'], ['notes']],
	options: {
		showTimer: false,
		showUndo: false
	}
};

export const Model2023: ModelSchema = {
	id: 'kalanu23',
	version: '2.2.6',

	flows: [
		{
			id: 'scoring',
			name: 'team scoring',
			views: [
				{
					id: 'scoring_view',
					name: 'team scoring',

					components: [
						{
							type: ComponentSchemaType.Event,
							name: 'amp',
							id: 'amp',
							eventId: 'amp',
							disabled: { $or: [currentlyHanging] }
						},
						{
							type: ComponentSchemaType.Event,
							name: 'speaker',
							id: 'speaker',
							eventId: 'speaker',
							disabled: { $or: [currentlyHanging] }
							
						},
						{
							type: ComponentSchemaType.StaticText,
							id: 'timesScored',
							value: {
								$concat: ['pieces scored: ', timesScored]
							}
						},
					],
					layout: [
						['amp', 'speaker'],
						['timesScored']
					],
					options: {
						timerPhases: [
							{
								length: 15,
								id: 'auton',
								color: '#cb3d3b'
							},
							{
								length: 140,
								id: 'teleop',
								color: '#4979db'
							}
						
						]
					}
				},
				evalView
			]
		},
		{
			id: 'eval',
			name: 'team evaluation',
			views: evalView
		},
		{
			id: 'pit',
			name: 'pit scouting',
			views: {
				id: 'pit_view',
				name: 'pit scouting',
				components: [
					{
						type: ComponentSchemaType.LongText,
						id: 'Jank',
						name: 'jankiest part?'
					},
					{
						type: ComponentSchemaType.LongText,
						id: 'PreferredAuto',
						name: 'preferred auto setup:'
					},
					{
						type: ComponentSchemaType.LongText,
						id: 'PreferredPickup',
						name: 'preferred pickup position:'
					},
					{
						type: ComponentSchemaType.LongText,
						id: 'Notes',
						name: 'notes?'
					},
					{
						type: ComponentSchemaType.Button,
						id: 'Image',
						name: 'robot photo form'
					}
				],
				layout: [
					['Jank'],
					['PreferredAuto'],
					['PreferredPickup'],
					['Notes'],
					['Image']

				],
				options: {
					showTimer: false,
					showUndo: false
				}
			},
			options: {
				requiresMatch: false
			}
		}
	]
};
