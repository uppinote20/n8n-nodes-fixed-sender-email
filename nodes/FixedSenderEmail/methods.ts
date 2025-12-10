import type {
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	INodeCredentialTestResult,
} from 'n8n-workflow';
import nodemailer from 'nodemailer';

export async function smtpConnectionTest(
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
}
