---
title: Release Notes 10.02.25
date: 10.02.25
tags:
  - releases
  - announcements
  - honcho
  - dev
---
# Honcho Updates v2.3.3

- A modified deriver that balances speed with providing with max possible context for Peer representations updates 
- More capable SDKs to compose the different contextual elements of Honcho more easily (Peer Cards, Messages, etc) 
- Easier to build reactive applications that dynamically change based on deriver progress
## ADDED
- SDK: Get Peer Card method 
- SDK: Update Message metadata method 
- SDK: Session level deriver status methods - SDK: Delete session message
## CHANGED
- SDK: Pagination class to match core implementation 
- CORE: Deriver Rollup Queue processes interleaved messages for more context
## FIXED
- SDK: Dialectic Stream returns Iterators 
- SDK: Type warnings 
- CORE: Dialectic Streaming to follow SSE conventions 
- CORE: Sentry tracing in the deriver
# Links
- [Sign-up for Honcho](https://app.honcho.dev/) & start building personalized agent experiences
- [Join our Discord](https://discord.gg/honcho) & tell us what you're working on
- [Visit our open-source repo](https://github.com/plastic-labs/honcho) & get your hands dirty
- [Check out the docs](https://docs.honcho.dev)