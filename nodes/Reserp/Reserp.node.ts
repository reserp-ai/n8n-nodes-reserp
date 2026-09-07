import type {
	ICredentialsDecrypted,
	IDataObject,
	IExecuteFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class Reserp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Reserp',
		name: 'reserp',
		icon: {
			light: 'file:reserp.svg',
			dark: 'file:reserp.dark.svg',
		},
		group: ['input'],
		version: 1,
		description: 'Get a v2 URL index or structured Google Search results from Reserp',
		subtitle: '={{$parameter["url"]}}',
		defaults: {
			name: 'Reserp',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'reserpApi',
				required: true,
				testedBy: 'reserpApiCredentialTest',
			},
		],
		properties: [
			{
				displayName: 'Response Shape',
				name: 'responseShape',
				type: 'options',
				options: [
					{
						name: 'URL Index',
						value: 'urls',
						description: 'Flat, page-ordered, deduplicated URLs with optional visible text',
					},
					{
						name: 'Structured Results',
						value: 'structured',
						description: 'Typed result families, SERP features, and explicit positions',
					},
				],
				default: 'urls',
				description: 'Choose which Reserp v2 response contract to return',
			},
			{
				displayName: 'Google Search URL',
				name: 'url',
				type: 'string',
				default: 'https://www.google.com/search?q=photonic+computing&gl=us&hl=en',
				required: true,
				description:
					'Complete https://www.google.com/search URL with a non-empty q parameter. Do not include num.',
			},
		],
	};

	methods = {
		credentialTest: {
			reserpApiCredentialTest: async (
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> => {
				const apiKey = credential.data?.apiKey;

				if (typeof apiKey !== 'string' || apiKey.trim() === '') {
					return { status: 'Error', message: 'Enter a Reserp API key.' };
				}

				return {
					status: 'OK',
					message: 'API key is present. It will be verified when the node runs.',
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const output: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const responseShape = this.getNodeParameter('responseShape', itemIndex) as string;
			const url = this.getNodeParameter('url', itemIndex) as string;
			const endpoint = responseShape === 'structured' ? 'structured' : 'urls';
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'reserpApi',
				{
					method: 'POST',
					url: `https://api.reserp.ai/v2/serp/${endpoint}`,
					headers: {
						'Content-Type': 'application/json',
					},
					body: { url },
					json: true,
				},
			);

			output.push({
				json: response as IDataObject,
				pairedItem: itemIndex,
			});
		}

		return [output];
	}
}
