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
			name: 'parked',
			id: 'parked'
		},
		{
			type: ComponentSchemaType.Toggle,
			name: 'consistently passing',
			id: 'pass'
		},
		{
			type: ComponentSchemaType.Toggle,
			name: 'unstable',
			id: 'unstable'
		},
		{
			type: ComponentSchemaType.LongText,
			name: 'notes',
			id: 'notes'
		}
	],

	layout: [['parked', 'unstable', 'pass'], ['notes']],
	options: {
		showTimer: false,
		showUndo: false
	}
};

export const Model2023: ModelSchema = {
	id: 'kalanu23',
	version: '2.2.5',
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
							type: ComponentSchemaType.Event,
							name: 'trap',
							id: 'trap',
							eventId: 'trap',
							disabled: { $not: [currentlyHanging] }
						},
						{
							type: ComponentSchemaType.Event,
							name: {
								$cond: {
									if: currentlyHanging,
									then: 'hanging',
									else: 'hang'
								}
							},
							id: 'hang',
							eventId: 'hung',
							disabled: {
								$or: [
									{
										$ne: ['$$phase', 'teleop']
									},
									currentlyHanging
								]
							}
						},
						{
							type: ComponentSchemaType.Toggle,
							id: 'leave',
							name: 'leave',
							disabled: {
								$ne: ['$$phase', 'auton']
							}
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
						['leave', 'hang', 'trap'],
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
						id: 'jank',
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
					}
				],
				layout: [
					['jank'],
					['PreferredAuto'],
					['PreferredPickup'],
					['Notes']
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
