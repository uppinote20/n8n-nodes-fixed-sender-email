import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import type { MailOptions, ButtonConfig } from '../types';
import { BUTTON_STYLE_PRIMARY, BUTTON_STYLE_SECONDARY } from '../types';

export function buildMailOptions(
	fromEmail: string,
	toEmail: string,
	subject: string,
	options: IDataObject = {},
): MailOptions {
	const mailOptions: MailOptions = {
		from: fromEmail,
		to: toEmail,
		subject,
	};

	if (options.ccEmail) {
		mailOptions.cc = options.ccEmail as string;
	}

	if (options.bccEmail) {
		mailOptions.bcc = options.bccEmail as string;
	}

	if (options.replyTo) {
		mailOptions.replyTo = options.replyTo as string;
	}

	return mailOptions;
}

export function handleAttachments(
	item: INodeExecutionData,
	attachmentPropertyNames: string,
): Array<{ filename: string; content: Buffer; contentType: string }> {
	const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [];

	if (!attachmentPropertyNames || !item.binary) {
		return attachments;
	}

	const propertyNames = attachmentPropertyNames
		.split(',')
		.map((name) => name.trim())
		.filter(Boolean);

	for (const propertyName of propertyNames) {
		const binaryData = item.binary[propertyName];
		if (binaryData) {
			attachments.push({
				filename: binaryData.fileName || 'attachment',
				content: Buffer.from(binaryData.data, 'base64'),
				contentType: binaryData.mimeType,
			});
		}
	}

	return attachments;
}

export function buildApprovalButtonsHtml(buttons: ButtonConfig[], webhookUrl: string): string {
	return buttons
		.map((btn) => {
			const style = btn.style === 'primary' ? BUTTON_STYLE_PRIMARY : BUTTON_STYLE_SECONDARY;
			const url = `${webhookUrl}?approved=${encodeURIComponent(btn.value)}`;
			return `<a href="${url}" style="${style}">${btn.label}</a>`;
		})
		.join(' ');
}

export function buildFormButtonHtml(label: string, webhookUrl: string, formType: string): string {
	const formUrl = `${webhookUrl}?formType=${formType}`;
	return `<a href="${formUrl}" style="${BUTTON_STYLE_PRIMARY}">${label}</a>`;
}

export function buildOutputData(
	info: IDataObject,
	fromEmail: string,
	toEmail: string,
	subject: string,
	textContent?: string,
	htmlContent?: string,
	options: IDataObject = {},
): IDataObject {
	const outputData: IDataObject = {
		messageId: info.messageId,
		accepted: info.accepted,
		rejected: info.rejected,
		response: info.response,
		from: fromEmail,
		to: toEmail,
		subject,
	};

	if (textContent) {
		outputData.text = textContent;
	}
	if (htmlContent) {
		outputData.html = htmlContent;
	}

	if (options.ccEmail) {
		outputData.cc = options.ccEmail;
	}
	if (options.bccEmail) {
		outputData.bcc = options.bccEmail;
	}
	if (options.replyTo) {
		outputData.replyTo = options.replyTo;
	}

	return outputData;
}
