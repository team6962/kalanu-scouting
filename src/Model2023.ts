import { Operator } from 'renegade';
import { ComponentSchemaType } from './component/ComponentSchema';
import { ModelSchema } from './model/ModelSchema';

const scoreDisabled: Operator = {
	$let: {
		// find index of most recent time we scored and picked up a piece
		vars: {
			lastPickup: {
				$indexOfArray: [
					{
						$map: {
							input: '$events',
							in: {
								$eq: ['$$this.id', 'pickup']
							}
						}
					},
					true
				]
			},
			lastScore: {
				$indexOfArray: [
					{
						$map: {
							input: '$events',
							in: {
								$eq: ['$$this.id', 'score']
							}
						}
					},
					true
				]
			}
		},
		in: {
			$cond: {
				// if we never picked up a piece
				if: {
					$eq: ['$$lastPickup', -1]
				},
				// disable scoring
				then: true,
				// if we have picked up a piece
				else: {
					$cond: {
						// and we haven't scored since then
						if: {
							$eq: ['$$lastScore', -1]
						},
						// enable scoring
						then: false,
						// otherwise, only disable scoring if we scored
						// more recently than we picked up a piece
						else: {
							$lt: ['$$lastScore', '$$lastPickup']
						}
					}
				}
			}
		}
	}
};

const currentlyDocked: Operator = {
	$ne: [
		{
			$indexOfArray: [
				{
					$map: {
						input: '$events',
						in: {
							$and: [
								{ $eq: ['$$this.id', 'dock'] },
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

const currentlyEngaged: Operator = {
	$ne: [
		{
			$indexOfArray: [
				{
					$map: {
						input: '$events',
						in: {
							$and: [
								{ $eq: ['$$this.id', 'engage'] },
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

export const Model2023: ModelSchema = {
	id: 'kalanu23',
	flows: [
		{
			id: 'scoring',
			name: 'team scoring',
			views: {
				id: 'scoring_view',
				name: 'team scoring',

				components: [
					{
						type: ComponentSchemaType.Event,
						name: 'box',
						id: 'boxPickup',
						eventId: 'pickup',
						eventPayload: { piece: 'box' },
						disabled: currentlyDocked
					},
					{
						type: ComponentSchemaType.Event,
						name: 'cone',
						id: 'conePickup',
						eventId: 'pickup',
						eventPayload: { piece: 'cone' },
						disabled: currentlyDocked
					},
					{
						type: ComponentSchemaType.Event,
						name: '1',
						id: 'bottomScore',
						eventId: 'score',
						eventPayload: { level: 1 },
						disabled: { $or: [scoreDisabled, currentlyDocked] }
					},
					{
						type: ComponentSchemaType.Event,
						name: '2',
						id: 'middleScore',
						eventId: 'score',
						eventPayload: { level: 2 },
						disabled: { $or: [scoreDisabled, currentlyDocked] }
					},
					{
						type: ComponentSchemaType.Event,
						name: '3',
						id: 'topScore',
						eventId: 'score',
						eventPayload: { level: 3 },
						disabled: { $or: [scoreDisabled, currentlyDocked] }
					},
					{
						type: ComponentSchemaType.Event,
						name: {
							$cond: {
								if: currentlyDocked,
								then: 'docked',
								else: 'dock'
							}
						},
						id: 'docking',
						eventId: 'dock',
						disabled: currentlyDocked
					},
					{
						type: ComponentSchemaType.Event,
						name: {
							$cond: {
								if: currentlyEngaged,
								then: 'engaged',
								else: 'engage'
							}
						},
						id: 'engaging',
						eventId: 'engage',
						disabled: {
							$or: [
								{
									$not: [currentlyDocked]
								},
								currentlyEngaged
							]
						}
					}
				],

				layout: [
					['boxPickup', 'conePickup'],
					['bottomScore', 'middleScore', 'topScore'],
					['docking', 'engaging']
				],

				options: {
					timerPhases: [
						{
							length: 15,
							id: 'auton',
							color: '#cb3d3b'
						},
						{
							length: 135,
							id: 'teleop',
							color: '#4979db'
						}
					]
				}
			}
		},
		{
			id: 'eval',
			name: 'team evaluation',
			views: {
				id: 'eval_view',
				name: 'team evaluation',

				components: [
					{
						type: ComponentSchemaType.Toggle,
						name: 'fouled',
						id: 'fouled'
					},
					{
						type: ComponentSchemaType.Toggle,
						name: 'parked',
						id: 'parked'
					},
					{
						type: ComponentSchemaType.LongText,
						name: 'notes',
						id: 'notes'
					}
				],

				layout: [['fouled', 'parked'], ['notes']],

				options: {
					showTimer: false,
					showUndo: false
				}
			}
		}
	]
};
