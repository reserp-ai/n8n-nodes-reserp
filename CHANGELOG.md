# Changelog

## 0.2.0

- Move the default request from v1 to the v2 URL-index endpoint.
- Add a response-shape option for v2 URL-index and structured-result payloads.
- Update the non-billable credential test and document v1 field migration.

## 0.1.1

- Add the n8n-required credential test using one intentionally invalid, non-billable request.
- Keep search execution unchanged: one request per input item with no retry or orchestration policy.

## 0.1.0

- Add the API-key-only Reserp node.
- Preserve the public response without retries or result transformation.
