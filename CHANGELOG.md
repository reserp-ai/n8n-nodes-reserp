# Changelog

## 0.3.1

- Correct the node codex identifier to `n8n-nodes-reserp.reserp`.
- Keep only the supported `Development` category, as requested during n8n manual review.

## 0.3.0

- Adopt `POST /v2/serp/search` and its stable `results[]` response.
- Adopt the stable, page-ordered structured `blocks[]` response.
- Preserve existing workflows whose saved response-shape value is `urls` by routing it to Search.

## 0.2.0

- Move the default request from v1 to the v2 beta URL-index endpoint.
- Add a response-shape option for v2 URL-index and structured-result payloads.
- Update the non-billable credential test and document v1 field migration.

## 0.1.1

- Add the n8n-required credential test using one intentionally invalid, non-billable request.
- Keep search execution unchanged: one request per input item with no retry or orchestration policy.

## 0.1.0

- Add the API-key-only Reserp node.
- Preserve the public response without retries or result transformation.
