<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- New HTTP endpoints are TanStack server routes under `src/routes/api/public/*`; do not add new Supabase Edge Functions. Why: the app's own server routes deploy with the app and skip site auth only under that prefix, so endpoint code stays with the rest of the server logic.
- App-internal server logic stays in `createServerFn` modules outside `src/server/`. Why: files under `src/server/` are blocked from client bundles, so anything a component imports must live in a client-safe path.
