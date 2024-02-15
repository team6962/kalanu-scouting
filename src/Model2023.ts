import { Operator } from 'renegade-js';
import { ComponentSchemaType } from './component/ComponentSchema';
import { ModelSchema } from './model/ModelSchema';
import { ViewSchema } from './view/ViewSchema';
/*hi*/
// const noPieceHeld: Operator = {
// 	$let: {
// 		// find index of most recent time we scored and picked up a piece
// 		vars: {
// 			lastPickup: {
// 				$indexOfArray: [
// 					{
// 						$map: {
// 							input: '$events',
// 							in: {
// 								$eq: ['$$this.id', 'pickup']
// 							}
// 						}
// 					},
// 					true
// 				]
// 			},
// 			lastScore: {
// 				$indexOfArray: [
// 					{
// 						$map: {
// 							input: '$events',
// 							in: {
// 								$eq: ['$$this.id', 'score']
// 							}
// 						}
// 					},
// 					true
// 				]
// 			}
// 		},
// 		in: {
// 			$cond: {
// 				// if we never picked up a piece
// 				if: {
// 					$eq: ['$$lastPickup', -1]
// 				},
// 				// disable scoring
// 				then: true,
// 				// if we have picked up a piece
// 				else: {
// 					$cond: {
// 						// and we haven't scored since then
// 						if: {
// 							$eq: ['$$lastScore', -1]
// 						},
// 						// enable scoring
// 						then: false,
// 						// otherwise, only disable scoring if we scored
// 						// more recently than we picked up a piece
// 						else: {
// 							$lt: ['$$lastScore', '$$lastPickup']
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// };

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

// const currentlyEngaged: Operator = {
// 	$ne: [
// 		{
// 			$indexOfArray: [
// 				{
// 					$map: {
// 						input: '$events',
// 						in: {
// 							$and: [
// 								{ $eq: ['$$this.id', 'engage'] },
// 								{ $eq: ['$$this.phase', '$$phase'] }
// 							]
// 						}
// 					}
// 				},
// 				true
// 			]
// 		},
// 		-1
// 	]
// };

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

// const timesPickedUp: Operator = {
// 	$size: {
// 		$filter: {
// 			input: '$events',
// 			cond: {
// 				$eq: ['$$this.id', 'pickup']
// 			}
// 		}
// 	}
// };



// const heldPiece: Operator = {
// 	$let: {
// 		vars: {
// 			event: {
// 				$first: {
// 					$filter: {
// 						input: '$events',
// 						cond: {
// 							$eq: ['$$this.id', 'pickup']
// 						}
// 					}
// 				}
// 			}
// 		},
// 		in: {
// 			$cond: {
// 				if: {
// 					$or: [noPieceHeld, { $eq: ['$$event', null] }]
// 				},
// 				then: null,
// 				else: '$$event.payload.piece'
// 			}
// 		}
// 	}
// };


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
	version: '1.1.3',
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
							// eventPayload: { level: 1, piece: heldPiece },
							disabled: { $or: [currentlyHanging] }
						},
						{
							type: ComponentSchemaType.Event,
							name: 'speaker',
							id: 'speaker',
							eventId: 'speaker',
							// eventPayload: { level: 2, piece: heldPiece },
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
						//	disabled: currentlyHanging
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
							id: 'leaf',
							name: 'leaf',
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
						['leaf', 'hang', 'trap'],
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
