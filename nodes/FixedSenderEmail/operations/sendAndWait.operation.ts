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
			// Get approval options from fixedCollection
			const approvalOptions = this.getNodeParameter('approvalOptions.values', itemIndex, {}) as {
				approvalType?: string;
				approveLabel?: string;
				buttonApprovalStyle?: string;
				disapproveLabel?: string;
				buttonDisapprovalStyle?: string;
			};

			const approvalType = approvalOptions.approvalType || 'single';
			const buttons: ButtonConfig[] = [];

			const approveLabel = approvalOptions.approveLabel || 'Approve';
			const approveStyle = (approvalOptions.buttonApprovalStyle || 'primary') as 'primary' | 'secondary';
			buttons.push({ label: approveLabel, value: 'true', style: approveStyle });

			if (approvalType === 'double') {
				const disapproveLabel = approvalOptions.disapproveLabel || 'Decline';
				const disapproveStyle = (approvalOptions.buttonDisapprovalStyle || 'secondary') as 'primary' | 'secondary';
				buttons.push({ label: disapproveLabel, value: 'false', style: disapproveStyle });
			}

			// Generate button HTML
			buttonHtml = buildApprovalButtonsHtml(buttons, webhookUrl);
		} else if (responseType === 'freeText' || responseType === 'customForm') {
			// Build form link button - get from options collection
			const messageButtonLabel = (options.messageButtonLabel as string) || 'Respond';
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
		const waitTill = calculateWaitTime.call(this, itemIndex, options);

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
	options: IDataObject,
): Date | typeof WAIT_INDEFINITELY {
	// Get limitWaitTime from options.limitWaitTime.values (fixedCollection structure)
	const limitWaitTimeData = options.limitWaitTime as IDataObject | undefined;
	const limitWaitTimeValues = limitWaitTimeData?.values as IDataObject | undefined;

	if (!limitWaitTimeValues) {
		return WAIT_INDEFINITELY;
	}

	const limitType = limitWaitTimeValues.limitType as string;

	if (limitType === 'afterTimeInterval') {
		const resumeAmount = (limitWaitTimeValues.resumeAmount as number) || 1;
		const resumeUnit = (limitWaitTimeValues.resumeUnit as string) || 'hours';

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
		const maxDateTime = limitWaitTimeValues.maxDateTime as string;
		if (maxDateTime) {
			return new Date(maxDateTime);
		}
	}

	return WAIT_INDEFINITELY;
}
