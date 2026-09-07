import assert from 'node:assert/strict';
import test from 'node:test';

import { ReserpApi } from '../dist/credentials/ReserpApi.credentials.js';
import { Reserp } from '../dist/nodes/Reserp/Reserp.node.js';

test('validates credentials without running or billing a search', () => {
	const credential = new ReserpApi();

	assert.deepEqual(credential.test, {
		request: {
			baseURL: 'https://api.reserp.ai',
			url: '/v2/serp/urls',
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
	});
});

test('uses the v2 URL index by default and returns the API payload', async () => {
	const payload = {
		ok: true,
		request: { url: 'https://www.google.com/search?q=test' },
		page: { url: 'https://www.google.com/search?q=test' },
		urls: [{ url: 'https://example.com', text: 'Example' }],
		pagination: { next_url: 'https://www.google.com/search?q=test&start=10' },
		metadata: { captured_at: '2026-09-07T00:00:00Z', parser_version: '2.0.0', warnings: [] },
		billed: true,
		billing_source: 'prepaid',
	};
	const calls = [];
	const context = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: (name) =>
			name === 'responseShape' ? 'urls' : 'https://www.google.com/search?q=test',
		helpers: {
			httpRequestWithAuthentication(...args) {
				calls.push(args);
				return Promise.resolve(payload);
			},
		},
	};

	const result = await new Reserp().execute.call(context);

	assert.deepEqual(result, [[{ json: payload, pairedItem: 0 }]]);
	assert.equal(calls.length, 1);
	assert.equal(calls[0][0], 'reserpApi');
	assert.deepEqual(calls[0][1], {
		method: 'POST',
		url: 'https://api.reserp.ai/v2/serp/urls',
		headers: { 'Content-Type': 'application/json' },
		body: { url: 'https://www.google.com/search?q=test' },
		json: true,
	});
});

test('can request the v2 structured response without reshaping it', async () => {
	const payload = {
		ok: true,
		schema_version: '2.0',
		results: { organic: [], ads: [], images: [], shopping: [], news: [], videos: [], local: [] },
		features: [],
	};
	const calls = [];
	const context = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: (name) =>
			name === 'responseShape' ? 'structured' : 'https://www.google.com/search?q=test',
		helpers: {
			httpRequestWithAuthentication(...args) {
				calls.push(args);
				return Promise.resolve(payload);
			},
		},
	};

	const result = await new Reserp().execute.call(context);

	assert.deepEqual(result, [[{ json: payload, pairedItem: 0 }]]);
	assert.equal(calls.length, 1);
	assert.equal(calls[0][1].url, 'https://api.reserp.ai/v2/serp/structured');
});

test('propagates a transport failure without retrying', async () => {
	const failure = new Error('transport failure');
	let calls = 0;
	const context = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: (name) =>
			name === 'responseShape' ? 'urls' : 'https://www.google.com/search?q=test',
		helpers: {
			httpRequestWithAuthentication() {
				calls += 1;
				return Promise.reject(failure);
			},
		},
	};

	await assert.rejects(new Reserp().execute.call(context), (error) => error === failure);
	assert.equal(calls, 1);
});
