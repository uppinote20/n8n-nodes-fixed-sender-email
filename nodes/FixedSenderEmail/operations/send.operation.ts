import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { createTransporter } from '../utils/transporter';
import { buildMailOptions, handleAttachments, buildOutputData } from '../utils/mailBuilder';

export async function executeSend(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[][]> {
	const returnData: INodeExecutionData[] = [];
	const credentials = await this.getCredentials('fixedSenderSmtpApi');
	const fromEmail = credentials.user as string;

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			const toEmail = this.getNodeParameter('toEmail', itemIndex) as string;
			const subject = this.getNodeParameter('subject', itemIndex) as string;
			const emailFormat = this.getNodeParameter('emailFormat', itemIndex) as string;
			const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

			const textContent = ['text', 'both'].includes(emailFormat)
				? (this.getNodeParameter('text', itemIndex, '') as string)
				: undefined;
			const htmlContent = ['html', 'both'].includes(emailFormat)
				? (this.getNodeParameter('html', itemIndex, '') as string)
				: undefined;

			// Create transporter
			const transporter = createTransporter(credentials, options);

			// Build mail options
			const mailOptions = buildMailOptions(fromEmail, toEmail, subject, options);

			if (textContent) {
				mailOptions.text = textContent;
			}

			if (htmlContent) {
				mailOptions.html = htmlContent;
			}

			// Handle attachments
			if (options.attachments) {
				const attachments = handleAttachments(items[itemIndex], options.attachments as string);
				if (attachments.length > 0) {
					mailOptions.attachments = attachments;
				}
			}

			// Send email
			const info = await transporter.sendMail(mailOptions);

			// Build output data
			const outputData = buildOutputData(
				info as unknown as IDataObject,
				fromEmail,
				toEmail,
				subject,
				textContent,
				htmlContent,
				options,
			);

			returnData.push({
				json: outputData,
				pairedItem: {
					item: itemIndex,
				},
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
					},
					pairedItem: {
						item: itemIndex,
					},
				});
				continue;
			}
			throw new NodeOperationError(this.getNode(), error as Error, {
				itemIndex,
			});
		}
	}

	return [returnData];
}
