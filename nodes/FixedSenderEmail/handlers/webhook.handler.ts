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
			const approved = approvalValue === 'true';

			res.setHeader('Content-Type', 'text/html; charset=utf-8');
			res.end(ACTION_RECORDED_PAGE);

			return {
				webhookResponse: ACTION_RECORDED_PAGE,
				workflowData: [
					[
						{
							json: {
								data: { approved },
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

	// Check if this is a freeText response (has 'response' field)
	if (body.response !== undefined) {
		return {
			webhookResponse: ACTION_RECORDED_PAGE,
			workflowData: [
				[
					{
						json: {
							data: { text: body.response },
						},
					},
				],
			],
		};
	}

	// Custom form response
	return {
		webhookResponse: ACTION_RECORDED_PAGE,
		workflowData: [
			[
				{
					json: {
						data: body,
					},
				},
			],
		],
	};
}

function buildFreeTextFormPage(this: IWebhookFunctions, webhookUrl: string): string {
	const message = getMessageParam.call(this);
	const options = getOptionsParam.call(this);

	const formTitle = (options.responseFormTitle as string) || '';
	const formDescription = (options.responseFormDescription as string) || message;
	const formButtonLabel = (options.responseFormButtonLabel as string) || 'Submit';

	return createFreeTextFormPage(formTitle, formDescription, formButtonLabel, webhookUrl);
}

function buildCustomFormPage(this: IWebhookFunctions, webhookUrl: string): string {
	const message = getMessageParam.call(this);
	const options = getOptionsParam.call(this);

	const formTitle = (options.responseFormTitle as string) || '';
	const formDescription = (options.responseFormDescription as string) || message;
	const formButtonLabel = (options.responseFormButtonLabel as string) || 'Submit';

	let elements: FormElement[] = [];

	try {
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
		// Use empty elements if not available
	}

	return createFormPage(formTitle, formDescription, formButtonLabel, elements, webhookUrl);
}

function getMessageParam(this: IWebhookFunctions): string {
	try {
		return (this.getNodeParameter('message', 0) as string) || '';
	} catch {
		return '';
	}
}

function getOptionsParam(this: IWebhookFunctions): IDataObject {
	try {
		return (this.getNodeParameter('options', 0) as IDataObject) || {};
	} catch {
		return {};
	}
}
