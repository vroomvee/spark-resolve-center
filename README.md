# Spark Resolve Center

Build a responsive client-facing website and maintenance ticketing portal for THUMP SERVICES & SOLUTIONS, a fire safety and security company based in Bangalore, India.

This is a new project. Create the application from scratch with a polished, futuristic industrial aesthetic.

## Brand identity
- Company: THUMP SERVICES & SOLUTIONS
- Tagline: A Fire Safety & Security Company
- Palette: graphite grey, charcoal, white and fire-engine red.
- Brand symbol: a powerful geometric rhinoceros representing strength, protection and reliability.
- Style: premium industrial design, architectural minimalism, precision engineering and sophisticated security technology.

Create a temporary original geometric rhino emblem if the official logo file is unavailable. Keep the emblem easy to replace later.

## Landing page
Create a dramatic, full-width charcoal hero with bold editorial typography, subtle red rim lighting, fine technical grid lines and a large metallic rhino emblem on the right.

Headline: "PROTECTION. ENGINEERED."

Supporting text: "Fire safety and security services, with maintenance support you can rely on."

Buttons:
- Client Login
- Raise a Service Request

Below the hero, add a clean white services section for fire alarm systems, hydrants and pumps, fire extinguishers, sprinkler systems, fire curtains and maintenance services.

Add a client portal introduction explaining that registered customers can submit maintenance requests and track their ticket progress.

Footer contact details:
- Phone: 080-41134036
- Email: mohit@thumpserve.com
- Website: www.thumpserve.com
- Address: No. 839, 6th Cross, 10th 'A' Main, Indiranagar 2nd Stage, Bangalore - 560 038.

Do not invent testimonials, client logos, statistics or certifications.

## Client portal screens
Create:
1. Client login.
2. Forgot password and reset password.
3. Client dashboard with ticket counts and recent tickets.
4. New service request form.
5. Ticket details and status history.
6. Client profile and logout.

The service request form should support selecting a site and equipment asset, equipment category, issue description, priority, preferred visit date and an optional photo.

Equipment categories: fire alarm panels, hydrants, fire extinguishers, sprinkler systems, fire pumps, fire curtains and other fire safety equipment.

Ticket statuses: New, Under Review, Scheduled, In Progress, Awaiting Parts, Resolved and Closed.

## Technical requirements
Use React, TypeScript and a maintainable component structure.

Prepare the application for Supabase PostgreSQL, Supabase Auth and private file storage. The database must support customer organisations, memberships, sites, equipment assets, tickets and ticket status history.

Client accounts must only be able to access their own organisation's records. Use database-level Row Level Security and secure backend operations. Never expose privileged API keys in frontend code.

Do not build an internal staff dashboard or technician scheduling calendar. Thump staff will initially receive new requests by email and manage scheduling outside the portal.

## Build order
First generate the complete visual interface and navigation. Use clearly identified fictional demo data only until the backend is connected.

Do not pretend authentication, ticket persistence, photo uploads or email delivery are working before they have been implemented and tested.

Preserve the branding and component structure as subsequent backend features are added. Make all pages responsive, accessible and polished, with sensible loading, empty, error and success states.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c40851e6-a5a9-4619-abee-dafb0b096665).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
