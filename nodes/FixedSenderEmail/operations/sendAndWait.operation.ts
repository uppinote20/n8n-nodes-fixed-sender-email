import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeOperationError, WAIT_INDEFINITELY } from 'n8n-workflow';
import type { ButtonConfig } from '../types';
import { createTransporter } from '../utils/transporter';
import { buildMailOptions, buildApprovalButtonsHtml, buildFormButtonHtml } from '../utils/mailBuilder';
import { createEmailBody } from '../utils/htmlTemplates';

export async function executeSendAndWait(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	const credentials = await this.getCredentials('fixedSenderSmtpApi');
	const fromEmail = credentials.user as string;

	// Only process first item for send and wait
	const itemIndex = 0;

	try {
		const toEmail = this.getNodeParameter('toEmail', itemIndex) as string;
		const subject = this.getNodeParameter('subject', itemIndex) as string;
		const message = this.getNodeParameter('message', itemIndex) as string;
		const responseType = this.getNodeParameter('responseType', itemIndex) as string;
		const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

		// Get the webhook URL using n8n's built-in method
		const instanceBaseUrl = this.getInstanceBaseUrl();
		const node = this.getNode();
		const webhookUrl = `${instanceBaseUrl}webhook-waiting/${this.getExecutionId()}/${node.id}`;

		let buttonHtml = '';

		if (responseType === 'approval') {
			// Build approval buttons
			const approvalType = this.getNodeParameter('approvalType', itemIndex) as string;
			const buttons: ButtonConfig[] = [];

			const approveLabel = this.getNodeParameter('approveLabel', itemIndex) as string;
			const approveStyle = this.getNodeParameter('approveStyle', itemIndex) as 'primary' | 'secondary';
			buttons.push({ label: approveLabel, value: 'true', style: approveStyle });

			if (approvalType === 'double') {
				const disapproveLabel = this.getNodeParameter('disapproveLabel', itemIndex) as string;
				const disapproveStyle = this.getNodeParameter('disapproveStyle', itemIndex) as 'primary' | 'secondary';
				buttons.push({ label: disapproveLabel, value: 'false', style: disapproveStyle });
			}

			// Generate button HTML
			buttonHtml = buildApprovalButtonsHtml(buttons, webhookUrl);
		} else if (responseType === 'freeText' || responseType === 'customForm') {
			// Build form link button
			const messageButtonLabel = this.getNodeParameter('messageButtonLabel', itemIndex) as string;
			buttonHtml = buildFormButtonHtml(messageButtonLabel, webhookUrl, responseType);
		}

		// Create email body with buttons
		const htmlContent = createEmailBody(message, buttonHtml);

		// Create transporter
		const transporter = createTransporter(credentials, options);

		// Build email options
		const mailOptions = buildMailOptions(fromEmail, toEmail, subject, options);
		mailOptions.html = htmlContent;

		// Send email
		await transporter.sendMail(mailOptions);

		// Calculate wait time
		const waitTill = calculateWaitTime.call(this, itemIndex);

		// Put execution to wait
		await this.putExecutionToWait(waitTill);

		return [this.getInputData()];
	} catch (error) {
		if (this.continueOnFail()) {
			return [
				[
					{
						json: {
							error: (error as Error).message,
						},
						pairedItem: {
							item: itemIndex,
						},
					},
				],
			];
		}
		throw new NodeOperationError(this.getNode(), error as Error, {
			itemIndex,
		});
	}
}

function calculateWaitTime(
	this: IExecuteFunctions,
	itemIndex: number,
): Date | typeof WAIT_INDEFINITELY {
	const limitWaitTime = this.getNodeParameter('limitWaitTime', itemIndex, false) as boolean;

	if (!limitWaitTime) {
		return WAIT_INDEFINITELY;
	}

	const limitType = this.getNodeParameter('limitType', itemIndex) as string;

	if (limitType === 'afterTimeInterval') {
		const resumeAmount = this.getNodeParameter('resumeAmount', itemIndex) as number;
		const resumeUnit = this.getNodeParameter('resumeUnit', itemIndex) as string;

		let milliseconds = 0;
		switch (resumeUnit) {
			case 'minutes':
				milliseconds = resumeAmount * 60 * 1000;
				break;
			case 'hours':
				milliseconds = resumeAmount * 60 * 60 * 1000;
				break;
			case 'days':
				milliseconds = resumeAmount * 24 * 60 * 60 * 1000;
				break;
		}

		return new Date(Date.now() + milliseconds);
	} else if (limitType === 'atSpecifiedTime') {
		const maxDateTime = this.getNodeParameter('maxDateTime', itemIndex) as string;
		return new Date(maxDateTime);
	}

	return WAIT_INDEFINITELY;
}
