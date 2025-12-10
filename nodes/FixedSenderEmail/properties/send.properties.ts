import type { INodeProperties } from 'n8n-workflow';

export const emailFormatProperty: INodeProperties = {
	displayName: 'Email Format',
	name: 'emailFormat',
	type: 'options',
	options: [
		{
			name: 'Text',
			value: 'text',
		},
		{
			name: 'HTML',
			value: 'html',
		},
		{
			name: 'Both',
			value: 'both',
		},
	],
	default: 'text',
	description: 'The format of the email to send',
	displayOptions: {
		show: {
			operation: ['send'],
		},
	},
};

export const textProperty: INodeProperties = {
	displayName: 'Text',
	name: 'text',
	type: 'string',
	typeOptions: {
		rows: 5,
	},
	default: '',
	description: 'Plain text message of email',
	displayOptions: {
		show: {
			operation: ['send'],
			emailFormat: ['text', 'both'],
		},
	},
};

export const htmlProperty: INodeProperties = {
	displayName: 'HTML',
	name: 'html',
	type: 'string',
	typeOptions: {
		rows: 5,
	},
	default: '',
	description: 'HTML text message of email',
	displayOptions: {
		show: {
			operation: ['send'],
			emailFormat: ['html', 'both'],
		},
	},
};

export const sendProperties: INodeProperties[] = [
	emailFormatProperty,
	textProperty,
	htmlProperty,
];
