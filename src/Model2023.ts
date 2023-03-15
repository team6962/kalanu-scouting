import { Operator } from 'renegade-js';
import { ComponentSchemaType } from './component/ComponentSchema';
import { ModelSchema } from './model/ModelSchema';
import { ViewSchema } from './view/ViewSchema';

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
			name: 'unstable',
			id: 'unstable'
		},
		{
			type: ComponentSchemaType.LongText,
			name: 'notes',
			id: 'notes'
		}
	],

	layout: [['parked', 'unstable'], ['notes']],

	options: {
		showTimer: false,
		showUndo: false
	}
};

export const Model2023: ModelSchema = {
	id: 'kalanu23',
	version: '1.1.2',
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
							name: 'bottom',
							id: 'bottomScore',
							eventId: 'score',
							eventPayload: { level: 1, piece: heldPiece },
							disabled: { $or: [noPieceHeld, currentlyDocked] }
						},
						{
							type: ComponentSchemaType.Event,
							name: 'middle',
							id: 'middleScore',
							eventId: 'score',
							eventPayload: { level: 2, piece: heldPiece },
							disabled: { $or: [noPieceHeld, currentlyDocked] }
						},
						{
							type: ComponentSchemaType.Event,
							name: 'top',
							id: 'topScore',
							eventId: 'score',
							eventPayload: { level: 3, piece: heldPiece },
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
							type: ComponentSchemaType.Toggle,
							id: 'leftCommunity',
							name: 'left community',
							disabled: {
								$ne: ['$$phase', 'auton']
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
						['leftCommunity', 'docking', 'engaging'],
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
						type: ComponentSchemaType.Toggle,
						id: 'functional',
						name: 'functional?',
						default: true
					},
					{
						type: ComponentSchemaType.Number,
						id: 'weight',
						name: 'weight (lbs)'
					},
					{
						type: ComponentSchemaType.Number,
						id: 'height',
						name: 'height (in)'
					},
					{
						type: ComponentSchemaType.Number,
						id: 'speed',
						name: 'top speed (mph)'
					},
					{
						type: ComponentSchemaType.ComboBox,
						id: 'drivetrain',
						choices: ['tank drive', 'swerve drive', 'mecanum drive']
					},
					{
						type: ComponentSchemaType.ComboBox,
						id: 'highestGrid',
						name: 'highest grid level',
						choices: ['top', 'middle', 'bottom']
					},
					{
						type: ComponentSchemaType.LongText,
						id: 'jank',
						name: 'jankiest part?'
					},
					{
						type: ComponentSchemaType.StaticText,
						id: 'chargingLabel',
						value: 'charging slot:'
					},
					{
						type: ComponentSchemaType.Toggle,
						id: 'charging1',
						name: '1st'
					},
					{
						type: ComponentSchemaType.Toggle,
						id: 'charging2',
						name: '2nd'
					},
					{
						type: ComponentSchemaType.Toggle,
						id: 'charging3',
						name: '3rd'
					},
					{
						type: ComponentSchemaType.LongText,
						id: 'chargingNotes',
						name: 'charging notes?'
					}
				],

				layout: [
					['functional', 'weight'],
					['height', 'speed'],
					['drivetrain', 'highestGrid'],
					['jank'],
					['chargingLabel', 'charging1', 'charging2', 'charging3'],
					['chargingNotes']
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
