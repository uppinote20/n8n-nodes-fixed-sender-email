import type { INodeProperties } from 'n8n-workflow';
import { SEND_AND_WAIT_OPERATION } from '../types';

// Message property
export const messageProperty: INodeProperties = {
	displayName: 'Message',
	name: 'message',
	type: 'string',
	typeOptions: {
		rows: 5,
	},
	default: '',
	required: true,
	description: 'The message to include in the email body (HTML supported)',
	displayOptions: {
		show: {
			operation: [SEND_AND_WAIT_OPERATION],
		},
	},
};

// Response Type
export const responseTypeProperty: INodeProperties = {
	displayName: 'Response Type',
	name: 'responseType',
	type: 'options',
	default: 'approval',
	options: [
		{
			name: 'Approval',
			value: 'approval',
			description: 'User can approve or disapprove from within the message',
		},
		{
			name: 'Free Text',
			value: 'freeText',
			description: 'User can submit a response via a form',
		},
		{
			name: 'Custom Form',
			value: 'customForm',
			description: 'User can submit a response with a custom form',
		},
	],
	displayOptions: {
		show: {
			operation: [SEND_AND_WAIT_OPERATION],
		},
	},
};

// Approval Options
export const approvalProperties: INodeProperties[] = [
	{
		displayName: 'Approval Type',
		name: 'approvalType',
		type: 'options',
		default: 'single',
		options: [
			{
				name: 'Approve Only',
				value: 'single',
				description: 'Single approval button',
			},
			{
				name: 'Approve and Disapprove',
				value: 'double',
				description: 'Approve and Disapprove buttons',
			},
		],
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				responseType: ['approval'],
			},
		},
	},
	{
		displayName: 'Approve Button Label',
		name: 'approveLabel',
		type: 'string',
		default: 'Approve',
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				responseType: ['approval'],
			},
		},
	},
	{
		displayName: 'Approve Button Style',
		name: 'approveStyle',
		type: 'options',
		default: 'primary',
		options: [
			{ name: 'Primary', value: 'primary' },
			{ name: 'Secondary', value: 'secondary' },
		],
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				responseType: ['approval'],
			},
		},
	},
	{
		displayName: 'Disapprove Button Label',
		name: 'disapproveLabel',
		type: 'string',
		default: 'Decline',
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				responseType: ['approval'],
				approvalType: ['double'],
			},
		},
	},
	{
		displayName: 'Disapprove Button Style',
		name: 'disapproveStyle',
		type: 'options',
		default: 'secondary',
		options: [
			{ name: 'Primary', value: 'primary' },
			{ name: 'Secondary', value: 'secondary' },
		],
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				responseType: ['approval'],
				approvalType: ['double'],
			},
		},
	},
];

// Form Options (shared by freeText and customForm)
export const formProperties: INodeProperties[] = [
	{
		displayName: 'Message Button Label',
		name: 'messageButtonLabel',
		type: 'string',
		default: 'Respond',
		description: 'The text on the button in the email that opens the response form',
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				responseType: ['freeText', 'customForm'],
			},
		},
	},
	{
		displayName: 'Response Form Title',
		name: 'responseFormTitle',
		type: 'string',
		default: 'Submit your response',
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				responseType: ['freeText', 'customForm'],
			},
		},
	},
	{
		displayName: 'Response Form Description',
		name: 'responseFormDescription',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				responseType: ['freeText', 'customForm'],
			},
		},
	},
	{
		displayName: 'Response Form Button Label',
		name: 'responseFormButtonLabel',
		type: 'string',
		default: 'Submit',
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				responseType: ['freeText', 'customForm'],
			},
		},
	},
];

// Custom Form Elements
export const customFormProperty: INodeProperties = {
	displayName: 'Form Elements',
	name: 'formElements',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
		sortable: true,
	},
	default: { elementValues: [] },
	placeholder: 'Add Form Element',
	displayOptions: {
		show: {
			operation: [SEND_AND_WAIT_OPERATION],
			responseType: ['customForm'],
		},
	},
	options: [
		{
			name: 'elementValues',
			displayName: 'Element',
			values: [
				{
					displayName: 'Type',
					name: 'type',
					type: 'options',
					default: 'text',
					options: [
						{ name: 'Text', value: 'text' },
						{ name: 'Textarea', value: 'textarea' },
						{ name: 'Number', value: 'number' },
						{ name: 'Email', value: 'email' },
						{ name: 'Select', value: 'select' },
						{ name: 'Date', value: 'date' },
					],
				},
				{
					displayName: 'Label',
					name: 'label',
					type: 'string',
					default: '',
					description: 'Label shown above the field',
				},
				{
					displayName: 'Field Name',
					name: 'fieldName',
					type: 'string',
					default: '',
					description: 'Name of the field in the response data',
				},
				{
					displayName: 'Required',
					name: 'required',
					type: 'boolean',
					default: false,
				},
				{
					displayName: 'Placeholder',
					name: 'placeholder',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Options (for Select)',
					name: 'selectOptions',
					type: 'string',
					default: '',
					description: 'Comma-separated list of options for select field',
					displayOptions: {
						show: {
							type: ['select'],
						},
					},
				},
			],
		},
	],
};

// Wait Time Options
export const waitTimeProperties: INodeProperties[] = [
	{
		displayName: 'Wait Time Limit',
		name: 'limitWaitTime',
		type: 'boolean',
		default: false,
		description: 'Whether to set a time limit for waiting',
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
			},
		},
	},
	{
		displayName: 'Limit Type',
		name: 'limitType',
		type: 'options',
		default: 'afterTimeInterval',
		options: [
			{
				name: 'After Time Interval',
				value: 'afterTimeInterval',
				description: 'Resume after a specified time interval',
			},
			{
				name: 'At Specified Time',
				value: 'atSpecifiedTime',
				description: 'Resume at a specific date and time',
			},
		],
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				limitWaitTime: [true],
			},
		},
	},
	{
		displayName: 'Wait Amount',
		name: 'resumeAmount',
		type: 'number',
		default: 1,
		typeOptions: {
			minValue: 0,
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				limitWaitTime: [true],
				limitType: ['afterTimeInterval'],
			},
		},
	},
	{
		displayName: 'Wait Unit',
		name: 'resumeUnit',
		type: 'options',
		default: 'hours',
		options: [
			{ name: 'Minutes', value: 'minutes' },
			{ name: 'Hours', value: 'hours' },
			{ name: 'Days', value: 'days' },
		],
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				limitWaitTime: [true],
				limitType: ['afterTimeInterval'],
			},
		},
	},
	{
		displayName: 'Max Date and Time',
		name: 'maxDateTime',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				operation: [SEND_AND_WAIT_OPERATION],
				limitWaitTime: [true],
				limitType: ['atSpecifiedTime'],
			},
		},
	},
];

// Export all sendAndWait properties combined
export const sendAndWaitProperties: INodeProperties[] = [
	messageProperty,
	responseTypeProperty,
	...approvalProperties,
	...formProperties,
	customFormProperty,
	...waitTimeProperties,
];
