# n8n-nodes-reserp

This is an n8n community node for the [Reserp Google Search API](https://reserp.ai/).

It accepts a complete Google Search URL, makes one request per input item, and returns the public API payload as the n8n output item. It adds no retries, timeout policy, concurrency management, caching, queues, result conversion, or automatic pagination.

## Installation

Follow the [n8n community-node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Operation

- **Google Search**: send one complete `https://www.google.com/search` URL to Reserp.

## Credentials

Create a **Reserp API** credential and enter your Reserp API key. n8n stores the key and sends it directly to `https://api.reserp.ai` as a bearer token. No OAuth flow or additional Reserp service is involved.

When you explicitly test the credential, n8n sends one empty request to the public endpoint. A valid key receives the non-billable `invalid_request` response; an invalid key receives `authentication_failed`. The test does not run a Google search.

## Usage

Provide a complete URL such as:

```text
https://www.google.com/search?q=photonic+computing&gl=us&hl=en
```

The surrounding n8n workflow owns retries, timeouts, error branches, queues, concurrency, observability, and pagination.

## Compatibility

Prepared against the current n8n community-node starter and `n8n-workflow` 2.x. Verify against the current n8n release before publishing.

## Resources

- [Reserp API documentation](https://reserp.ai/docs)
- [Reserp OpenAPI definition](https://reserp.ai/openapi.json)
- [n8n community-node documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

- `0.1.1`: add the required non-billable credential test.
- `0.1.0`: initial one-request Reserp node.

## License

MIT
