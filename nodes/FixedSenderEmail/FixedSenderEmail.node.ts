import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { SEND_AND_WAIT_OPERATION } from './types';
import {
	operationProperty,
	toEmailProperty,
	subjectProperty,
	optionsProperty,
	sendProperties,
	sendAndWaitProperties,
} from './properties';
import { executeSend } from './operations/send.operation';
import { executeSendAndWait } from './operations/sendAndWait.operation';
import { handleWebhook } from './handlers/webhook.handler';
import { smtpConnectionTest } from './methods';

export class FixedSenderEmail implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fixed Sender Email',
		name: 'fixedSenderEmail',
		icon: { light: 'file:fixedSenderEmail.svg', dark: 'file:fixedSenderEmail.dark.svg' },
		group: ['output'],
		version: 1,
		description: 'Sends an email using SMTP protocol (From address automatically set from credentials)',
		defaults: {
			name: 'Fixed Sender Email',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		webhooks: [
			{
				name: 'default',
				httpMethod: 'GET',
				responseMode: 'onReceived',
				path: '={{ $nodeId }}',
				restartWebhook: true,
				isFullPath: true,
			},
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{ $nodeId }}',
				restartWebhook: true,
				isFullPath: true,
			},
		],
		credentials: [
			{
				name: 'fixedSenderSmtpApi',
				required: true,
				testedBy: 'smtpConnectionTest',
			},
		],
		properties: [
			operationProperty,
			toEmailProperty,
			subjectProperty,
			...sendProperties,
			...sendAndWaitProperties,
			optionsProperty,
		],
	};

	methods = {
		credentialTest: {
			smtpConnectionTest,
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return handleWebhook.call(this);
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const operation = this.getNodeParameter('operation', 0) as string;

		if (operation === SEND_AND_WAIT_OPERATION) {
			return executeSendAndWait.call(this);
		}

		return executeSend.call(this, this.getInputData());
	}
}
