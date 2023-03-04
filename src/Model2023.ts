import { ComponentSchemaType } from './component/ComponentSchema';
import { ModelSchema } from './model/ModelSchema';

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
						eventPayload: { piece: 'box' }
					},
					{
						type: ComponentSchemaType.Event,
						name: 'cone',
						id: 'conePickup',
						eventId: 'pickup',
						eventPayload: { piece: 'cone' }
					},
					{
						type: ComponentSchemaType.Event,
						name: '1',
						id: 'bottomScore',
						eventId: 'score',
						eventPayload: { level: 1 }
					},
					{
						type: ComponentSchemaType.Event,
						name: '2',
						id: 'middleScore',
						eventId: 'score',
						eventPayload: { level: 2 }
					},
					{
						type: ComponentSchemaType.Event,
						name: '3',
						id: 'topScore',
						eventId: 'score',
						eventPayload: { level: 3 }
					},
					{
						type: ComponentSchemaType.Event,
						name: 'dock',
						id: 'docking',
						eventId: 'docking'
					}
				],

				layout: [
					['boxPickup', 'conePickup'],
					['bottomScore', 'middleScore', 'topScore'],
					['docking']
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
					showTimer: false
				}
			}
		}
	]
};
