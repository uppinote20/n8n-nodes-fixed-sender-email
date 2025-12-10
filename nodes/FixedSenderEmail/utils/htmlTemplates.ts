import type { FormElement } from '../types';

// HTML template for action recorded page (matching n8n official style)
export const ACTION_RECORDED_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
	<title>Action recorded</title>
	<style>
		*, ::after, ::before { box-sizing: border-box; margin: 0; padding: 0; }
		body { font-family: Open Sans, sans-serif; font-weight: 400; font-size: 12px; display: flex; flex-direction: column; justify-content: start; background-color: #FBFCFE; }
		.container { margin: auto; text-align: center; padding-top: 24px; width: 448px; }
		.card { padding: 24px; background-color: white; border: 1px solid #DBDFE7; border-radius: 8px; box-shadow: 0px 4px 16px 0px rgba(99, 77, 255, 0.06); margin-bottom: 16px; }
		.header h1 { color: #525356; font-size: 20px; font-weight: 400; padding-bottom: 8px; }
		.header p { color: #7E8186; font-size: 14px; font-weight: 400; }
	</style>
</head>
<body>
	<div class="container">
		<section>
			<div class="card">
				<div class="header">
					<h1>Got it, thanks</h1>
					<p>This page can be closed now</p>
				</div>
			</div>
		</section>
	</div>
</body>
</html>
`;

// Email body template (table-based for email client compatibility)
export function createEmailBody(message: string, buttons: string): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Email</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 12px; background-color: #fbfcfe; margin: 0; padding: 0;">
	<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbfcfe; border: 1px solid #dbdfe7; border-radius: 8px;">
		<tr>
			<td align="center" style="padding: 24px 0;">
				<table width="448" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 448px; background-color: #ffffff; border: 1px solid #dbdfe7; border-radius: 8px; padding: 24px; box-shadow: 0px 4px 16px rgba(99, 77, 255, 0.06);">
					<tr>
						<td style="text-align: center; padding-top: 8px; font-family: Arial, sans-serif; font-size: 14px; color: #7e8186;">
							<p style="white-space: pre-line;">${message}</p>
						</td>
					</tr>
					<tr>
						<td align="center" style="padding-top: 12px;">
							${buttons}
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
`;
}

// Form page template (matching n8n official style)
export function createFormPage(
	title: string,
	description: string,
	submitLabel: string,
	elements: FormElement[],
	webhookUrl: string,
): string {
	const formFields = elements
		.map((el) => {
			const requiredAttr = el.required ? 'required' : '';
			const requiredMark = el.required ? '<span style="color: #ff6d5a;">*</span>' : '';

			switch (el.type) {
				case 'textarea':
					return `
				<div style="margin-bottom: 16px; text-align: left;">
					<label style="display: block; margin-bottom: 4px; font-weight: 600; color: #525356; font-size: 14px;">${el.label} ${requiredMark}</label>
					<textarea name="${el.fieldName}" placeholder="${el.placeholder || ''}" ${requiredAttr}
						style="width: 100%; padding: 10px 12px; border: 1px solid #dbdfe7; border-radius: 6px; font-size: 14px; font-family: Arial, sans-serif; min-height: 100px; box-sizing: border-box; resize: vertical;"></textarea>
				</div>`;
				case 'select':
					const options = (el.selectOptions || '')
						.split(',')
						.map((opt) => opt.trim())
						.filter(Boolean);
					const optionsHtml = options.map((opt) => `<option value="${opt}">${opt}</option>`).join('');
					return `
				<div style="margin-bottom: 16px; text-align: left;">
					<label style="display: block; margin-bottom: 4px; font-weight: 600; color: #525356; font-size: 14px;">${el.label} ${requiredMark}</label>
					<select name="${el.fieldName}" ${requiredAttr}
						style="width: 100%; padding: 10px 12px; border: 1px solid #dbdfe7; border-radius: 6px; font-size: 14px; font-family: Arial, sans-serif; box-sizing: border-box; background-color: #fff;">
						<option value="">-- Select --</option>
						${optionsHtml}
					</select>
				</div>`;
				default:
					return `
				<div style="margin-bottom: 16px; text-align: left;">
					<label style="display: block; margin-bottom: 4px; font-weight: 600; color: #525356; font-size: 14px;">${el.label} ${requiredMark}</label>
					<input type="${el.type}" name="${el.fieldName}" placeholder="${el.placeholder || ''}" ${requiredAttr}
						style="width: 100%; padding: 10px 12px; border: 1px solid #dbdfe7; border-radius: 6px; font-size: 14px; font-family: Arial, sans-serif; box-sizing: border-box;" />
				</div>`;
			}
		})
		.join('');

	const descriptionHtml = description
		? `<p style="color: #7e8186; font-size: 14px; margin-bottom: 24px; white-space: pre-line;">${description}</p>`
		: '';

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
	<title>${title || 'Form'}</title>
	<style>
		*, ::after, ::before { box-sizing: border-box; margin: 0; padding: 0; }
		body { font-family: Open Sans, Arial, sans-serif; font-size: 14px; background-color: #fbfcfe; margin: 0; padding: 20px; }
		.container { max-width: 448px; margin: 40px auto; background: white; padding: 24px; border-radius: 8px; border: 1px solid #dbdfe7; box-shadow: 0px 4px 16px rgba(99, 77, 255, 0.06); }
		h1 { color: #525356; font-size: 20px; font-weight: 400; margin-bottom: 8px; }
		button[type="submit"] {
			background-color: #ff6d5a;
			color: white;
			border: none;
			padding: 12px 24px;
			border-radius: 6px;
			cursor: pointer;
			font-size: 14px;
			font-weight: 600;
			width: 100%;
			font-family: Arial, sans-serif;
		}
		button[type="submit"]:hover { background-color: #e55a48; }
	</style>
</head>
<body>
	<div class="container">
		${title ? `<h1>${title}</h1>` : ''}
		${descriptionHtml}
		<form method="POST" action="${webhookUrl}">
			${formFields}
			<button type="submit">${submitLabel}</button>
		</form>
	</div>
</body>
</html>
`;
}

export function createFreeTextFormPage(
	title: string,
	description: string,
	submitLabel: string,
	webhookUrl: string,
): string {
	return createFormPage(title, description, submitLabel, [
		{
			type: 'textarea',
			label: 'Response',
			fieldName: 'response',
			required: true,
			placeholder: '',
		},
	], webhookUrl);
}
