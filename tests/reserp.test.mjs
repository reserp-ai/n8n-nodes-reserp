import assert from 'node:assert/strict';
import test from 'node:test';

import { ReserpApi } from '../dist/credentials/ReserpApi.credentials.js';
import { Reserp } from '../dist/nodes/Reserp/Reserp.node.js';

test('validates credentials without running or billing a search', () => {
	const credential = new ReserpApi();

	assert.deepEqual(credential.test, {
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
	});
});

test('makes one request per input item and returns the API payload', async () => {
	const payload = {
		ok: true,
		url: 'https://www.google.com/search?q=test',
		finalUrl: 'https://www.google.com/search?q=test',
		results: [{ url: 'https://example.com' }],
		pagination: {
			start: 0,
			nextStart: 10,
			nextUrl: 'https://www.google.com/search?q=test&start=10',
		},
		billed: true,
	};
	const calls = [];
	const context = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: () => 'https://www.google.com/search?q=test',
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
		url: 'https://api.reserp.ai/v1/serp',
		headers: { 'Content-Type': 'application/json' },
		body: { url: 'https://www.google.com/search?q=test' },
		json: true,
	});
});

test('propagates a transport failure without retrying', async () => {
	const failure = new Error('transport failure');
	let calls = 0;
	const context = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: () => 'https://www.google.com/search?q=test',
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
