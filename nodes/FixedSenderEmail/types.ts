import type { IDataObject } from 'n8n-workflow';

// Operation constants
export const SEND_AND_WAIT_OPERATION = 'sendAndWait';

// Button styles for email
export const BUTTON_STYLE_PRIMARY =
	'background-color: #ff6d5a; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; text-decoration: none; display: inline-block; margin: 4px;';
export const BUTTON_STYLE_SECONDARY =
	'background-color: white; color: #909399; border: 1px solid #909399; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; text-decoration: none; display: inline-block; margin: 4px;';

// Interfaces
export interface FormElement {
	type: string;
	label: string;
	fieldName: string;
	required: boolean;
	placeholder: string;
	selectOptions?: string;
}

export interface ButtonConfig {
	label: string;
	value: string;
	style: 'primary' | 'secondary';
}

export interface SmtpCredentials {
	host: string;
	port: number;
	secure: boolean;
	user: string;
	password: string;
}

export interface MailOptions extends IDataObject {
	from: string;
	to: string;
	subject: string;
	text?: string;
	html?: string;
	cc?: string;
	bcc?: string;
	replyTo?: string;
	attachments?: Array<{
		filename: string;
		content: Buffer;
		contentType: string;
	}>;
}
