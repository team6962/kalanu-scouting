import { Operator } from 'renegade';
import { ComponentSchemaType } from './component/ComponentSchema';
import { ModelSchema } from './model/ModelSchema';

const noPieceHeld: Operator = {
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

const timesScored: Operator = {
	$size: {
		$filter: {
			input: '$events',
			cond: {
				$eq: ['$$this.id', 'score']
			}
		}
	}
};

const timesPickedUp: Operator = {
	$size: {
		$filter: {
			input: '$events',
			cond: {
				$eq: ['$$this.id', 'pickup']
			}
		}
	}
};

const timesFumbled: Operator = {
	$let: {
		vars: {
			fumbled: { $subtract: [timesPickedUp, timesScored] }
		},
		in: {
			$cond: {
				if: { $eq: ['$$fumbled', 0] },
				then: 0,
				else: {
					$cond: {
						if: noPieceHeld,
						then: '$$fumbled',
						else: { $subtract: ['$$fumbled', 1] }
					}
				}
			}
		}
	}
};

const heldPiece: Operator = {
	$let: {
		vars: {
			event: {
				$first: {
					$filter: {
						input: '$events',
						cond: {
							$eq: ['$$this.id', 'pickup']
						}
					}
				}
			}
		},
		in: {
			$cond: {
				if: {
					$or: [noPieceHeld, { $eq: ['$$event', null] }]
				},
				then: null,
				else: '$$event.payload.piece'
			}
		}
	}
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
						name: 'cube',
						id: 'cubePickup',
						eventId: 'pickup',
						eventPayload: { piece: 'cube' },
						disabled: currentlyDocked,
						color: {
							$cond: {
								if: {
									$eq: [heldPiece, 'cube']
								},
								then: '#c48fc2',
								else: '#d8dada'
							}
						}
					},
					{
						type: ComponentSchemaType.Event,
						name: 'cone',
						id: 'conePickup',
						eventId: 'pickup',
						eventPayload: { piece: 'cone' },
						disabled: currentlyDocked,
						color: {
							$cond: {
								if: {
									$eq: [heldPiece, 'cone']
								},
								then: '#c59849',
								else: '#d8dada'
							}
						}
					},
					{
						type: ComponentSchemaType.Event,
						name: '1',
						id: 'bottomScore',
						eventId: 'score',
						eventPayload: { level: 1 },
						disabled: { $or: [noPieceHeld, currentlyDocked] }
					},
					{
						type: ComponentSchemaType.Event,
						name: '2',
						id: 'middleScore',
						eventId: 'score',
						eventPayload: { level: 2 },
						disabled: { $or: [noPieceHeld, currentlyDocked] }
					},
					{
						type: ComponentSchemaType.Event,
						name: '3',
						id: 'topScore',
						eventId: 'score',
						eventPayload: { level: 3 },
						disabled: { $or: [noPieceHeld, currentlyDocked] }
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
					},
					{
						type: ComponentSchemaType.StaticText,
						id: 'timesPickedUp',
						value: {
							$concat: ['pieces collected: ', timesPickedUp]
						}
					},
					{
						type: ComponentSchemaType.StaticText,
						id: 'timesScored',
						value: {
							$concat: ['pieces scored: ', timesScored]
						}
					},
					{
						type: ComponentSchemaType.StaticText,
						id: 'timesFumbled',
						value: {
							$concat: ['pieces fumbled: ', timesFumbled]
						}
					}
				],

				layout: [
					['cubePickup', 'conePickup'],
					['bottomScore', 'middleScore', 'topScore'],
					['docking', 'engaging'],
					['timesPickedUp', 'timesScored', 'timesFumbled']
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
