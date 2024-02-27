// fun fact this is actually Model2024 xD xD

import { Operator } from 'renegade-js';
import { ComponentSchemaType } from './component/ComponentSchema';
import { ModelSchema } from './model/ModelSchema';
import { ViewSchema } from './view/ViewSchema';

//var ampauton = null;
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
/*const countScores: Operator = {
	$sum: {
		input: '$events',
		in: {
			$and: [
				{ $eq: ['$$this.id', 'amp'] },
				{ $eq: ['$$this.phase', '$auton'] }
				
			]
		}
		
		
	}
	
}*/
/*const countScores: Operator = {
	$addFields: {
	  scoreCount: {
		$sum: {
		  $map: {
			input: '$events',
			as: 'event',
			in: {
			  $cond: [
				{
				  $and: [
					{ $eq: ['$$event.id', 'amp'] },
					{ $eq: ['$$event.phase', '$auton'] }
				  ]
				},
				1,  // If conditions are met, add 1 to the count
				0   // Otherwise, add 0
			  ]
			}
		  }
		}
	  }
	}
  };*/
/*const countScored: Operator = {
	$size: {
		$filter: {
			input: '$events',
			cond: {
				$in: {
					$and: [
						{ $eq: ['$$this.id', 'amp'] },
						{ $eq: ['$$this.phase', '$auton'] }
					]

				}
			}
		}
	}
};*/
const AmpAuton: Operator = {
	$size: {
	  $filter: {
		input: '$events',
		cond: {
		  $and: [
			{ $eq: ['$$this.id', 'amp'] },              // Check if 'id' is 'amp'
			{ $eq: ['$$this.phase', 'auton'] }          // Check if 'phase' is 'auton'
		  ]
		}
	  }
	}
  };
  const SpeakerAuton: Operator = {
	$size: {
	  $filter: {
		input: '$events',
		cond: {
		  $and: [
			{ $eq: ['$$this.id', 'speaker'] },              // Check if 'id' is 'amp'
			{ $eq: ['$$this.phase', 'auton'] }          // Check if 'phase' is 'auton'
		  ]
		}
	  }
	}
  };
  const AmpTeleop: Operator = {
	$size: {
	  $filter: {
		input: '$events',
		cond: {
		  $and: [
			{ $eq: ['$$this.id', 'amp'] },              // Check if 'id' is 'amp'
			{ $eq: ['$$this.phase', 'teleop'] }          // Check if 'phase' is 'auton'
		  ]
		}
	  }
	}
  };
  const SpeakerTeleop: Operator = {
	$size: {
	  $filter: {
		input: '$events',
		cond: {
		  $and: [
			{ $eq: ['$$this.id', 'speaker'] },              // Check if 'id' is 'amp'
			{ $eq: ['$$this.phase', 'teleop'] }          // Check if 'phase' is 'auton'
		  ]
		}
	  }
	}
  };
  const Trap: Operator = {
	$size: {
		$filter: {
			input: '$events',
			cond: {
				$in: ['$$this.id', ['trap']]
			}
		}
	}
};
const Hang: Operator = {
	$size: {
		$filter: {
			input: '$events',
			cond: {
				$in: ['$$this.id', ['hung']]
			}
		}
	}
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
	version: '2.1.1',
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
					/*	{
							type: ComponentSchemaType.StaticText,
							id: 'AmpAuton',
							value: {
								$concat: ['ampauton scored: ', AmpAuton]
							}
						},
						{
							type: ComponentSchemaType.StaticText,
							id: 'SpeakerAuton',
							value: {
								$concat: ['speakerauton scored: ', SpeakerAuton]
							}
						},
						{
							type: ComponentSchemaType.StaticText,
							id: 'AmpTeleop',
							value: {
								$concat: ['ampteleop scored: ', AmpTeleop]
							}
						},
						{
							type: ComponentSchemaType.StaticText,
							id: 'SpeakerTeleop',
							value: {
								$concat: ['speakerteleop scored: ', SpeakerTeleop]
							}
						},
						{
							type: ComponentSchemaType.StaticText,
							id: 'Trap',
							value: {
								$concat: ['trap scored: ', Trap]
							}
						},
						{
							type: ComponentSchemaType.StaticText,
							id: 'Hang',
							value: {
								$concat: ['Hang scored: ', Hang]
							}
						}*/
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
