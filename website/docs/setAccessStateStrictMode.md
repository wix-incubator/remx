---
id: setAccessStateStrictMode
title: setAccessStateStrictMode
sidebar_label: setAccessStateStrictMode
slug: /api/setAccessStateStrictMode
---

### `remx.setAccessStateStrictMode(true)` (experimental)
Enables writing in console.error (in DEV mode) when accessing state in React components
which are not wrapped in `observer()`, so they may not re-render automatically when needed.
