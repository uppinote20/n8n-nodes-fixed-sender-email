import type { IDataObject } from 'n8n-workflow';

// Operation constants
export const SEND_AND_WAIT_OPERATION = 'sendAndWait';

// Button styles for email (matching n8n official style)
export const BUTTON_STYLE_PRIMARY =
	'display:inline-block; text-decoration:none; background-color:#ff6d5a; color:#fff; padding:12px 24px; font-family:Arial,sans-serif; font-size:14px; font-weight:600; border-radius:6px; min-width:120px; margin:12px 2px 0 2px;';
export const BUTTON_STYLE_SECONDARY =
	'display:inline-block; text-decoration:none; background-color:#fff; color:#4a4a4a; padding:12px 24px; font-family:Arial,sans-serif; font-size:14px; font-weight:600; border:1px solid #d1d1d1; border-radius:6px; min-width:120px; margin:12px 6px 0 6px;';

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
