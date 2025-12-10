import type { FormElement } from '../types';

// HTML template for action recorded page
export const ACTION_RECORDED_PAGE = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Response Recorded</title>
	<style>
	body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f5f5f5; }
	.container { text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
	h1 { color: #333; }
	p { color: #666; }
	</style>
</head>
<body>
	<div class="container">
	<h1>Got it, thanks!</h1>
	<p>Your response has been recorded.</p>
	</div>
</body>
</html>
`;

export function createEmailBody(message: string, buttons: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
	<div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
	<div style="margin-bottom: 20px;">${message}</div>
	<div style="text-align: center; margin-top: 30px;">
	${buttons}
	</div>
	</div>
</body>
</html>
`;
}

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
			<div style="margin-bottom: 16px;">
			<label style="display: block; margin-bottom: 4px; font-weight: 500;">${el.label} ${requiredMark}</label>
			<textarea name="${el.fieldName}" placeholder="${el.placeholder || ''}" ${requiredAttr}
			style="width: 100%; padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 14px; min-height: 80px; box-sizing: border-box;"></textarea>
			</div>`;
				case 'select':
					const options = (el.selectOptions || '')
						.split(',')
						.map((opt) => opt.trim())
						.filter(Boolean);
					const optionsHtml = options.map((opt) => `<option value="${opt}">${opt}</option>`).join('');
					return `
			<div style="margin-bottom: 16px;">
			<label style="display: block; margin-bottom: 4px; font-weight: 500;">${el.label} ${requiredMark}</label>
			<select name="${el.fieldName}" ${requiredAttr}
			style="width: 100%; padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
			<option value="">-- Select --</option>
			${optionsHtml}
			</select>
			</div>`;
				default:
					return `
			<div style="margin-bottom: 16px;">
			<label style="display: block; margin-bottom: 4px; font-weight: 500;">${el.label} ${requiredMark}</label>
			<input type="${el.type}" name="${el.fieldName}" placeholder="${el.placeholder || ''}" ${requiredAttr}
			style="width: 100%; padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 14px; box-sizing: border-box;" />
			</div>`;
			}
		})
		.join('');

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title}</title>
	<style>
	body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
	.container { max-width: 500px; margin: 40px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
	h1 { color: #333; font-size: 24px; margin-bottom: 8px; }
	.description { color: #666; margin-bottom: 24px; }
	button { background-color: #ff6d5a; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; width: 100%; }
	button:hover { background-color: #e55a48; }
	</style>
</head>
<body>
	<div class="container">
	<h1>${title}</h1>
	${description ? `<p class="description">${description}</p>` : ''}
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
			label: 'Your Response',
			fieldName: 'response',
			required: true,
			placeholder: 'Enter your response here...',
		},
	], webhookUrl);
}
