# n8n-nodes-reserp

An n8n community node for the [Reserp Google Search API v2](https://reserp.ai/docs).

It accepts a complete Google Search URL, makes one request per input item, and returns the selected public v2 payload as the n8n output item. It adds no retries, timeout policy, concurrency management, caching, queues, result conversion, or automatic pagination.

## Installation

Follow the [n8n community-node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Response shapes

- **URL Index** (default) calls `POST /v2/serp/urls` and returns flat, page-ordered, deduplicated URLs with optional visible text.
- **Structured Results** calls `POST /v2/serp/structured` and returns typed result families, SERP features, and explicit positions.

In either mode, the node forwards the public response without reshaping it.

## Credentials

Create a **Reserp API** credential and enter your Reserp API key. n8n stores the key and sends it directly to `https://api.reserp.ai` as a bearer token. No OAuth flow or additional Reserp service is involved.

When you explicitly test the credential, n8n sends one empty request to the v2 URL-index endpoint. A valid key receives the non-billable `invalid_request` response; an invalid key receives `authentication_failed`. The test does not run a Google search.

## Usage

Provide a complete URL such as:

```text
https://www.google.com/search?q=photonic+computing&gl=us&hl=en
```

Every successful response includes `pagination.next_url`. Submit that URL in a later node execution to advance; its presence does not guarantee that another page contains results. Do not infer pagination from a result-array length.

The surrounding n8n workflow owns retries, timeouts, error branches, queues, concurrency, observability, and pagination.

## Migrating from 0.1

Version 0.2 defaults to the v2 flat `urls[]` index instead of the v1 recursive `results[]` response. Other notable field renames are `url` → `request.url`, `finalUrl` → `page.url`, `pagination.nextUrl` → `pagination.next_url`, and `billingSource` → `billing_source`. Choose **Structured Results** for typed result families and explicit positions.

## Resources

- [Reserp API documentation](https://reserp.ai/docs)
- [Reserp OpenAPI definition](https://reserp.ai/openapi.json)
- [Postman collection](https://www.postman.com/reserp-ai/reserp-google-search-api)
- [n8n community-node documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

- `0.2.0`: migrate to Reserp v2 and add URL-index/structured response selection.
- `0.1.1`: add the required non-billable credential test.
- `0.1.0`: initial one-request Reserp node.

## License

MIT
