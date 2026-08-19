import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class ReserpApi implements ICredentialType {
	name = 'reserpApi';

	displayName = 'Reserp API';

	icon: Icon = {
		light: 'file:../nodes/Reserp/reserp.svg',
		dark: 'file:../nodes/Reserp/reserp.dark.svg',
	};

	documentationUrl = 'https://reserp.ai/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.reserp.ai',
			url: '/v1/serp',
			method: 'POST',
			body: {},
			json: true,
			ignoreHttpStatusErrors: true,
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'error',
					value: 'authentication_failed',
					message: 'Invalid Reserp API key',
				},
			},
		],
	};
}
