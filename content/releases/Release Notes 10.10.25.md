---
title: Release Notes 10.10.25
date: 10.10.25
tags:
  - releases
  - announcements
  - honcho
  - dev
---
# HONCHO v2.4.0
- `Get_Context` is faster, gives richer context, & more powerful, now returns working representation & peer card
## ADDED
- Unified `Representation` class
- vllm client support
- Periodic queue cleanup logic
- WIP Dreaming Feature
- LongMemEval to Test Bench
- Prometheus Client for better Metrics
- Performance metrics instrumentation
- Error reporting to deriver
- Workspace Delete Method
- Multi-db option in test harness
- SDK version 1.5.0 for compatibility
## CHANGED
- Working Representations are Queried on the fly rather than cached in metadata
- EmbeddingStore to RepresentationFactory
- Summary Response Model to use public_id of message for cutoff
- Semantic across codebase to reference resources based on `observer` and `observed`
- Prompts for Deriver & Dialectic to reference peer_id and add examples
- `Get_Context` route returns peer card and representation in addition to messages and summaries
- Refactoring logger.info calls to logger.debug where applicable
## FIXED
- Gemini client to use async methods
# Links
- [Sign-up for Honcho](https://app.honcho.dev/) & start building personalized agent experiences
- [Join our Discord](https://discord.gg/honcho) & tell us what you're working on
- [Visit our open-source repo](https://github.com/plastic-labs/honcho) & get your hands dirty
- [Check out the docs](https://docs.honcho.dev)