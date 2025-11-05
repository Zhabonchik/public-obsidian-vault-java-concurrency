---
title: Release Notes 11.05.25
date: 11.05.25
tags:
  - releases
  - announcements
  - honcho
  - dev
---
# HONCHO v2.4.1-2
Stability, reliability, speed.

## ADDED
- Alembic migration validation test suite
## CHANGED
- Logging infrastructure to remove noisy messages
- Sentry integration is centralized
- Alembic to always use a session pooler
- Statement timeout during alembic operations to 5 min
## FIXED
- Alembic migrations to batch changes
- Batch message creation sequence number
- Langfuse tracing to have readable waterfalls
- Alembic Migrations to match models.py
- `message_in_seq` correctly included in webhook payload
# Links
- [Sign-up for Honcho](https://app.honcho.dev/) & start building personalized agent experiences
- [Join our Discord](https://discord.gg/honcho) & tell us what you're working on
- [Visit our open-source repo](https://github.com/plastic-labs/honcho) & get your hands dirty
- [Check out the docs](https://docs.honcho.dev)