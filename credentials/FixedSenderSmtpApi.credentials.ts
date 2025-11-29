import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FixedSenderSmtpApi implements ICredentialType {
	name = 'fixedSenderSmtpApi';

	displayName = 'Fixed Sender SMTP';

	documentationUrl = 'https://nodemailer.com/smtp/';

	icon = {
		light: 'file:fixedSenderEmail.svg',
		dark: 'file:fixedSenderEmail.dark.svg',
	} as const;

	iconUrl = 'file:fixedSenderEmail.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'User (Email Address)',
			name: 'user',
			type: 'string',
			default: '',
			placeholder: 'name@email.com',
			description: 'Email address to use as sender (From field)',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Password for the email account',
		},
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '',
			placeholder: 'smtp.gmail.com',
			description: 'SMTP server host',
		},
		{
			displayName: 'Port',
			name: 'port',
			type: 'number',
			default: 587,
			description: 'SMTP server port (typically 587 for TLS or 465 for SSL)',
		},
		{
			displayName: 'Secure',
			name: 'secure',
			type: 'boolean',
			default: false,
			description: 'Whether to use SSL/TLS (typically false for port 587, true for port 465)',
		},
	];
}
