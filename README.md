# n8n-nodes-reserp

An n8n community node for the [Reserp Google Search API v2](https://reserp.ai/docs).

It accepts a complete Google Search URL, makes one request per input item, and returns the selected public v2 payload as the n8n output item. It adds no retries, timeout policy, concurrency management, caching, queues, result conversion, or automatic pagination.

## Installation

Follow the [n8n community-node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Response shapes

- **Search** (default) calls [`POST /v2/serp/search`](https://reserp.ai/docs/search) and returns flat, page-ordered, deduplicated entries in `results[]`.
- **Structured Results** calls [`POST /v2/serp/structured`](https://reserp.ai/docs/structured) and returns typed, page-ordered SERP blocks in `blocks[]`.

In either mode, the node forwards the public response without reshaping it.

## Credentials

Create a **Reserp API** credential and enter your Reserp API key. n8n stores the key and sends it directly to `https://api.reserp.ai` as a bearer token. No OAuth flow or additional Reserp service is involved.

When you explicitly test the credential, n8n sends one empty request to the v2 Search endpoint. A valid key receives the non-billable `invalid_request` response; an invalid key receives `authentication_failed`. The test does not run a Google search.

## Usage

Provide a complete URL such as:

```text
https://www.google.com/search?q=photonic+computing&gl=us&hl=en
```

Every successful response includes `pagination.next_url`. Submit that URL in a later node execution to advance; its presence does not guarantee that another page contains results. Do not infer pagination from a result-array length.

The surrounding n8n workflow owns retries, timeouts, error branches, queues, concurrency, observability, and pagination.

## Migrating

From 0.2, select **Search** and replace `/v2/serp/urls` with `/v2/serp/search` and `urls[]` with `results[]`. Existing workflows whose saved option is `urls` are routed to Search for compatibility. If you used the structured beta, replace grouped `results` and `features` with the stable page-ordered `blocks[]` model.

## Resources

- [Reserp API documentation](https://reserp.ai/docs)
- [Reserp OpenAPI definition](https://reserp.ai/openapi.json)
- [Postman collection](https://www.postman.com/reserp-ai/reserp-google-search-api)
- [n8n community-node documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

- `0.3.0`: adopt stable Search `results[]` and structured `blocks[]` contracts.
- `0.2.0`: migrate to the Reserp v2 beta and add response selection.
- `0.1.1`: add the required non-billable credential test.
- `0.1.0`: initial one-request Reserp node.

## License

MIT
