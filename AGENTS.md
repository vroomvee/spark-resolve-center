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

## Application architecture
- Keep the public website and client portal in separate shared shells; portal demo state uses one React context so future authenticated data can replace it without reworking pages.
- Keep service definitions, equipment categories, demo records and leaf metadata helpers in the shared browser-safe data module to prevent inconsistent values across screens.
- This phase is frontend-only: never call authentication, storage, email or persistence APIs from demo controls, and label all session-only results explicitly.
- Future live organisation records must use membership-scoped PostgreSQL RLS, authenticated server operations and private storage; never use privileged keys in client modules.
- Keep the original rhino symbol in one replaceable brand component and use its silhouette for the favicon to preserve consistent identity.
