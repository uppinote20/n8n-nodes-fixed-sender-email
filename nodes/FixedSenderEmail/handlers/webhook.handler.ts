import type {
	IDataObject,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import type { FormElement } from '../types';
import { ACTION_RECORDED_PAGE, createFormPage, createFreeTextFormPage } from '../utils/htmlTemplates';

export async function handleWebhook(
	this: IWebhookFunctions,
): Promise<IWebhookResponseData> {
	const req = this.getRequestObject();
	const res = this.getResponseObject();

	// Handle GET request
	if (req.method === 'GET') {
		const approvalValue = req.query.approved as string | undefined;
		const formType = req.query.formType as string | undefined;

		// If it's an approval button click
		if (approvalValue !== undefined) {
			res.setHeader('Content-Type', 'text/html; charset=utf-8');
			res.end(ACTION_RECORDED_PAGE);

			return {
				webhookResponse: ACTION_RECORDED_PAGE,
				workflowData: [
					[
						{
							json: {
								response: approvalValue,
								responseType: 'approval',
							},
						},
					],
				],
			};
		}

		// If it's a form request
		if (formType === 'freeText' || formType === 'customForm') {
			const webhookUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;

			let formPage: string;

			if (formType === 'freeText') {
				formPage = buildFreeTextFormPage.call(this, webhookUrl);
			} else {
				formPage = buildCustomFormPage.call(this, webhookUrl);
			}

			res.setHeader('Content-Type', 'text/html; charset=utf-8');
			res.end(formPage);

			return {
				noWebhookResponse: true,
			};
		}
	}

	// Handle POST request (form submission)
	const body = this.getBodyData() as IDataObject;
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end(ACTION_RECORDED_PAGE);

	return {
		webhookResponse: ACTION_RECORDED_PAGE,
		workflowData: [
			[
				{
					json: {
						...body,
						responseType: 'form',
					},
				},
			],
		],
	};
}

function buildFreeTextFormPage(this: IWebhookFunctions, webhookUrl: string): string {
	let formTitle = 'Submit your response';
	let formDescription = '';
	let formButtonLabel = 'Submit';

	try {
		formTitle = (this.getNodeParameter('responseFormTitle', 0) as string) || formTitle;
		formDescription = (this.getNodeParameter('responseFormDescription', 0) as string) || '';
		formButtonLabel = (this.getNodeParameter('responseFormButtonLabel', 0) as string) || formButtonLabel;
	} catch {
		// Use defaults if parameters not available
	}

	return createFreeTextFormPage(formTitle, formDescription, formButtonLabel, webhookUrl);
}

function buildCustomFormPage(this: IWebhookFunctions, webhookUrl: string): string {
	let formTitle = 'Submit your response';
	let formDescription = '';
	let formButtonLabel = 'Submit';
	let elements: FormElement[] = [];

	try {
		formTitle = (this.getNodeParameter('responseFormTitle', 0) as string) || formTitle;
		formDescription = (this.getNodeParameter('responseFormDescription', 0) as string) || '';
		formButtonLabel = (this.getNodeParameter('responseFormButtonLabel', 0) as string) || formButtonLabel;
		const formElementsData = this.getNodeParameter('formElements', 0) as IDataObject;
		const elementValues = (formElementsData?.elementValues as IDataObject[]) || [];

		elements = elementValues.map((el) => ({
			type: (el.type as string) || 'text',
			label: (el.label as string) || '',
			fieldName: (el.fieldName as string) || '',
			required: (el.required as boolean) || false,
			placeholder: (el.placeholder as string) || '',
			selectOptions: el.selectOptions as string,
		}));
	} catch {
		// Use defaults if parameters not available
	}

	return createFormPage(formTitle, formDescription, formButtonLabel, elements, webhookUrl);
}
