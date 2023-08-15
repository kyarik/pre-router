# Preloading code and data at the router level with Relay Hooks

- Take the README Usage section as a starting point
- Mention loadQuery (previously preloadQuery)
- Show simple preloading example with loadQuery
- Show example of page with multiple sections, each using usePreloadedQuery, so the page has multiple loadQuery's in preloadData in line with the Render-as-You-Fetch pattern and coordinates the loading states using suspense boundaries. Mention that multiple queries won't be necessary once the `@defer` and `@stream` GraphQL directives become standard.
