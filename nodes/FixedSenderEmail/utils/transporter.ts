import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { IDataObject } from 'n8n-workflow';
import type { SmtpCredentials } from '../types';

export function createTransportOptions(
	credentials: SmtpCredentials | IDataObject,
	options: IDataObject = {},
): SMTPTransport.Options {
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

	return transportOptions;
}

export function createTransporter(
	credentials: SmtpCredentials | IDataObject,
	options: IDataObject = {},
): Transporter {
	const transportOptions = createTransportOptions(credentials, options);
	return nodemailer.createTransport(transportOptions);
}

export async function verifyTransporter(transporter: Transporter): Promise<void> {
	await transporter.verify();
}
