import type {
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	IExecuteFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

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
		credentials: [
			{
				name: 'fixedSenderSmtpApi',
				required: true,
				testedBy: 'smtpConnectionTest',
			},
		],
		properties: [
			{
				displayName: 'To Email',
				name: 'toEmail',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'info@example.com',
				description: 'Email address of the recipient. Multiple ones can be separated by comma.',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				placeholder: 'My subject line',
				description: 'Subject line of the email',
			},
			{
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
			},
			{
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
						emailFormat: ['text', 'both'],
					},
				},
			},
			{
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
						emailFormat: ['html', 'both'],
					},
				},
			},
			{
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
						description:
							'Email address of BCC recipient. Multiple ones can be separated by comma.',
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
			},
		],
	};

	methods = {
		credentialTest: {
			async smtpConnectionTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const credentials = credential.data as ICredentialDataDecryptedObject;
				try {
					const transporter = nodemailer.createTransport({
						host: credentials.host as string,
						port: credentials.port as number,
						secure: credentials.secure as boolean,
						auth: {
							user: credentials.user as string,
							pass: credentials.password as string,
						},
					});
					await transporter.verify();
				} catch (error) {
					return {
						status: 'Error',
						message: (error as Error).message,
					};
				}
				return {
					status: 'OK',
					message: 'Connection successful!',
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('fixedSenderSmtpApi');

		// Get sender email from credentials
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
				const transportOptions: SMTPTransport.Options = {
					host: credentials.host as string,
					port: credentials.port as number,
					secure: credentials.secure as boolean,
					auth: {
						user: credentials.user as string,
						pass: credentials.password as string,
					},
				};

				if (options.allowUnauthorizedCerts === true) {
					transportOptions.tls = {
						rejectUnauthorized: false,
					};
				}

				const transporter: Transporter = nodemailer.createTransport(transportOptions);

				// Build email object - From is always fixed from credentials
				const mailOptions: IDataObject = {
					from: fromEmail,
					to: toEmail,
					subject,
				};

				if (textContent) {
					mailOptions.text = textContent;
				}

				if (htmlContent) {
					mailOptions.html = htmlContent;
				}

				if (options.ccEmail) {
					mailOptions.cc = options.ccEmail;
				}

				if (options.bccEmail) {
					mailOptions.bcc = options.bccEmail;
				}

				if (options.replyTo) {
					mailOptions.replyTo = options.replyTo;
				}

				// Handle attachments
				if (options.attachments && items[itemIndex].binary) {
					const attachments = [];
					const attachmentProperties: string[] = (options.attachments as string)
						.split(',')
						.map((propertyName) => propertyName.trim());

					for (const propertyName of attachmentProperties) {
						const binaryData = items[itemIndex].binary![propertyName];
						if (binaryData) {
							attachments.push({
								filename: binaryData.fileName || 'attachment',
								content: Buffer.from(binaryData.data, 'base64'),
								contentType: binaryData.mimeType,
							});
						}
					}

					if (attachments.length > 0) {
						mailOptions.attachments = attachments;
					}
				}

				// Send email
				const info = await transporter.sendMail(mailOptions);

				const outputData: IDataObject = {
					messageId: info.messageId,
					accepted: info.accepted,
					rejected: info.rejected,
					response: info.response,
					from: fromEmail,
					to: toEmail,
					subject,
				};

				// Include email content in output
				if (textContent) {
					outputData.text = textContent;
				}
				if (htmlContent) {
					outputData.html = htmlContent;
				}

				// Include optional fields if present
				if (options.ccEmail) {
					outputData.cc = options.ccEmail;
				}
				if (options.bccEmail) {
					outputData.bcc = options.bccEmail;
				}
				if (options.replyTo) {
					outputData.replyTo = options.replyTo;
				}

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
}
