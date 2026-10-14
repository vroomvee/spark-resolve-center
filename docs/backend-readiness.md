# THUMP backend readiness

This release is a visual prototype. It has no authentication, database persistence, photo uploads, ticket notifications or account recovery. All portal records are fictional. New demo tickets live only in a React context and disappear on reload; photo previews use temporary browser object URLs.

## Proposed live schema (not applied)
- customer_organisations: id, name, contact details.
- profiles: auth user id, display name, phone. User roles are not stored here.
- memberships: organisation id, auth user id, membership state. Any privileged staff roles belong in a separate user_roles table, not profiles.
- sites: id, organisation id, name, address.
- equipment_assets: id, organisation id, site id, category, identifier, description.
- tickets: id, organisation id, site id, optional asset id, created_by, subject, description, priority, preferred_visit_date, status, timestamps.
- ticket_status_history: id, organisation id, ticket id, status, changed_by, note, timestamp.
- ticket_attachments: id, organisation id, ticket id, private object path, original filename, content type, size.

## Security requirements for the live phase
Enable Lovable Cloud before implementing persistence. Ask the required profile-data question before authentication code. Each table migration needs explicit GRANTs followed by RLS. Active membership must scope every read to the caller’s organisation. Clients can create requests but cannot assign organisations, update statuses, create memberships or write status history. Composite foreign keys or server validation must keep site, asset, ticket and attachment in the same organisation. Validate all input with schemas both in browser and server. Use server middleware to revalidate the caller for every private operation. Public server routes must verify the caller independently.

Store photos in a private bucket with membership-scoped object policies. Validate image type and size server-side; use short-lived signed download URLs. Notify the configured staff email only after a successful ticket transaction, with durable retry/delivery state. Do not expose privileged API keys or use admin access for routine member reads. Do not seed fictional records into real customer organisations.

## Account and request flow
Default live login methods are email/password and Google unless a workspace policy rules one out. Enable email auth and the social provider when introducing each flow. Use one root identity-change subscriber. Recovery must validate a recovery session and update the password at the public reset route. Move the portal under the integration-managed authenticated layout while preserving its public URL. New requests must atomically create a ticket and initial history event; real success should display only after readback. Signed-out teardown cancels and clears private query caches before sign-out and replacement navigation.

Staff scheduling stays outside this app. No internal staff dashboard or calendar is included. Existing public demo pages are intentionally not authorization boundaries.
