import type { INodeProperties } from 'n8n-workflow';
import { SEND_AND_WAIT_OPERATION } from '../types';

// Message property
export const messageProperty: INodeProperties = {
	displayName: 'Message',
	name: 'message',
	type: 'string',
	typeOptions: {
		rows: 4,
	},
	default: '',
	required: true,
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
			description: 'User can approve/disapprove from within the message',
		},
		{
			name: 'Free Text',
			value: 'freeText',
			description: 'User can submit a response via a form',
		},
		{
			name: 'Custom Form',
			value: 'customForm',
			description: 'User can submit a response via a custom form',
		},
	],
	displayOptions: {
		show: {
			operation: [SEND_AND_WAIT_OPERATION],
		},
	},
};

// Limit Wait Time Properties (used inside fixedCollection)
const limitWaitTimeProperties: INodeProperties[] = [
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
	},
	{
		displayName: 'Amount',
		name: 'resumeAmount',
		type: 'number',
		default: 1,
		typeOptions: {
			minValue: 0,
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				limitType: ['afterTimeInterval'],
			},
		},
	},
	{
		displayName: 'Unit',
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
				limitType: ['atSpecifiedTime'],
			},
		},
	},
];

// Limit Wait Time Option (fixedCollection)
const limitWaitTimeOption: INodeProperties = {
	displayName: 'Limit Wait Time',
	name: 'limitWaitTime',
	type: 'fixedCollection',
	description: 'Whether the workflow will automatically resume execution after the specified limit type',
	default: {},
	options: [
		{
			displayName: 'Values',
			name: 'values',
			values: limitWaitTimeProperties,
		},
	],
};

// Approval Options (fixedCollection) - matching n8n official structure
export const approvalOptionsProperty: INodeProperties = {
	displayName: 'Approval Options',
	name: 'approvalOptions',
	type: 'fixedCollection',
	placeholder: 'Add option',
	default: {},
	options: [
		{
			displayName: 'Values',
			name: 'values',
			values: [
				{
					displayName: 'Type of Approval',
					name: 'approvalType',
					type: 'options',
					default: 'single',
					options: [
						{
							name: 'Approve Only',
							value: 'single',
						},
						{
							name: 'Approve and Disapprove',
							value: 'double',
						},
					],
				},
				{
					displayName: 'Approve Button Label',
					name: 'approveLabel',
					type: 'string',
					default: 'Approve',
					displayOptions: {
						show: {
							approvalType: ['single', 'double'],
						},
					},
				},
				{
					displayName: 'Approve Button Style',
					name: 'buttonApprovalStyle',
					type: 'options',
					default: 'primary',
					options: [
						{ name: 'Primary', value: 'primary' },
						{ name: 'Secondary', value: 'secondary' },
					],
					displayOptions: {
						show: {
							approvalType: ['single', 'double'],
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
							approvalType: ['double'],
						},
					},
				},
				{
					displayName: 'Disapprove Button Style',
					name: 'buttonDisapprovalStyle',
					type: 'options',
					default: 'secondary',
					options: [
						{ name: 'Primary', value: 'primary' },
						{ name: 'Secondary', value: 'secondary' },
					],
					displayOptions: {
						show: {
							approvalType: ['double'],
						},
					},
				},
			],
		},
	],
	displayOptions: {
		show: {
			operation: [SEND_AND_WAIT_OPERATION],
			responseType: ['approval'],
		},
	},
};

// Options for Approval response type
export const approvalOptionsCollectionProperty: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add option',
	default: {},
	options: [limitWaitTimeOption],
	displayOptions: {
		show: {
			operation: [SEND_AND_WAIT_OPERATION],
			responseType: ['approval'],
		},
	},
};

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

// Options for freeText and customForm response types
export const formOptionsCollectionProperty: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add option',
	default: {},
	options: [
		{
			displayName: 'Message Button Label',
			name: 'messageButtonLabel',
			type: 'string',
			default: 'Respond',
		},
		{
			displayName: 'Response Form Title',
			name: 'responseFormTitle',
			description: 'Title of the form that the user can access to provide their response',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Response Form Description',
			name: 'responseFormDescription',
			description: 'Description of the form that the user can access to provide their response',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Response Form Button Label',
			name: 'responseFormButtonLabel',
			type: 'string',
			default: 'Submit',
		},
		limitWaitTimeOption,
	],
	displayOptions: {
		show: {
			operation: [SEND_AND_WAIT_OPERATION],
			responseType: ['freeText', 'customForm'],
		},
	},
};

// Export all sendAndWait properties combined
export const sendAndWaitProperties: INodeProperties[] = [
	messageProperty,
	responseTypeProperty,
	customFormProperty,
	approvalOptionsProperty,
	approvalOptionsCollectionProperty,
	formOptionsCollectionProperty,
];
