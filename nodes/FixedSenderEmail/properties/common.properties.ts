import type { INodeProperties } from 'n8n-workflow';
import { SEND_AND_WAIT_OPERATION } from '../types';

export const operationProperty: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'send',
	options: [
		{
			name: 'Send',
			value: 'send',
			action: 'Send an email',
			description: 'Send an email immediately',
		},
		{
			name: 'Send and Wait for Response',
			value: SEND_AND_WAIT_OPERATION,
			action: 'Send an email and wait for response',
			description: 'Send an email with approval buttons and wait for recipient response',
		},
	],
};

export const toEmailProperty: INodeProperties = {
	displayName: 'To Email',
	name: 'toEmail',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'info@example.com',
	description: 'Email address of the recipient. Multiple ones can be separated by comma.',
};

export const subjectProperty: INodeProperties = {
	displayName: 'Subject',
	name: 'subject',
	type: 'string',
	default: '',
	placeholder: 'My subject line',
	description: 'Subject line of the email',
};

export const optionsProperty: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add Option',
	default: {},
	options: [
		{
			displayName: 'Allow Unauthorized Certs',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			default: false,
			description: 'Whether to connect even if SSL certificate validation is not possible',
		},
		{
			displayName: 'Attachments',
			name: 'attachments',
			type: 'string',
			default: '',
			description:
				'Name of the binary properties that contain data to add to email as attachment. Multiple ones can be comma-separated.',
		},
		{
			displayName: 'BCC Email',
			name: 'bccEmail',
			type: 'string',
			default: '',
			placeholder: 'info@example.com',
			description: 'Email address of BCC recipient. Multiple ones can be separated by comma.',
		},
		{
			displayName: 'CC Email',
			name: 'ccEmail',
			type: 'string',
			default: '',
			placeholder: 'info@example.com',
			description: 'Email address of CC recipient. Multiple ones can be separated by comma.',
		},
		{
			displayName: 'Reply To',
			name: 'replyTo',
			type: 'string',
			default: '',
			placeholder: 'info@example.com',
			description: 'The email address to send the reply to',
		},
	],
};
