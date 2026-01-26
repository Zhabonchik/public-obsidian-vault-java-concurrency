---
title: Announcing Honcho 3
subtitle: Pareto dominant, 5x cost reduction, SOTA token efficiency, & expanded advanced reasoning capabilities
date: 1.26.26
tags:
  - announcements
  - dev
  - honcho
  - releases
author: Ben McCormick & Courtland Leer
description: The latest version of Honcho, serving state-of-the-art memory, reasoning, & continual learning
---
![[honcho-pixel-banner-v3.png]]
# TL;DR
*Over the past month, we've been hard at work applying research results to [Honcho](https://honcho.dev), our flagship product for stateful agents. After achieving [state-of-the-art results](https://evals.honcho.dev), it was time to release a new version of Honcho that fully incorporated and improved upon the winning architecture so everyone can experience effortless Pareto-frontier memory. The core improvements inspired a number of breaking changes to Honcho's API and SDKs along with dramatic reasoning, cost, and token efficiency improvements, all converging to necessitate a **major** release.*
# What's New?
Careful readers of our [[Benchmarking Honcho|Benchmarking Honcho]] post may have noticed a departure from prior descriptions of Honcho's architecture. It's true: we've done a complete overhaul.
## Ingestion Reasoning
The initial message ingestion system (previously called the "Deriver") has been trimmed down significantly: it now only deals with exhaustive *explicit* information capture, and as such can be done *faster*, *cheaper*, and *in full parallel*, allowing ingestion to scale limitlessly.
## Asynchronous Reasoning
Tasks previously handled at the time of ingestion, including summarization and peer card generation, are handled by a completely new part of the system: we call it the *Dreaming Agent*. 

[Dreams](https://gwern.net/ai-daydreaming) are agentic background tasks. The agent crawls over everything known about a user and fills out missing pieces while rearranging the data to be retrieved more efficiently when needed. 

It's responsible for processing explicit conclusions and conversation history, then producing deductive, inductive, and abductive conclusions; summaries; peer cards; and more. Dreaming notices patterns across interactions, and forms hypotheses to test against new data.

We call it a dream for obvious reasons: researchers hypothesize that human dreams literally serve the same purpose in our own minds. Plus, these tasks may very well be concentrated during evening hours, when users are sleeping (not sending messages) and compute is less costly. But let's not get carried away with anthropomorphizing our agents: the similarities pretty much end there. There's no reason that an agent cannot display *perfect* recall--something that humans will never achieve, but that Honcho is asymptotically approaching in our eval results.
## Advanced Reasoning Levels
Honcho still serves a `.chat()` endpoint for retrieving insights, but the work under the hood of that endpoint has changed dramatically. The *Dialectic Agent* replaces a prior fixed-path architecture.

Agentic retrieval was the single most important change towards achieving state-of-the-art memory benchmark results. Instead of trying to fetch the right memory in a static code path based on the query, we did what the last year of industry-wide disruption has proven works best: we took our retrieval methods, turned them into tools, and handed them over to an agent loop. 

Now, the model can search across *everything* Honcho knows about the target to synthesize the best possible answer to any query, and string together disparate facts over long periods of time to produce insights backed by source material and logical inference. 

This new architecture enables *reasoning levels*, a new addition to our API that allows developers (or agents!) to select exactly how much effort a chat query should take. Basic questions (often the most important) such as "what is the user's name?" and "where is the user located?" can be answered with `minimal` reasoning. Tricky recall questions, like the harder ones in today's memory evals,  requiring reasoning across multiple sessions or time frames, can usually be answered with `low` or `medium` reasoning. The extended reasoning levels, `high` and `max`, push beyond what today's evals can measure. You can use them to write full-blown research reports on a user, or generate a story or case study customized to their preferences.

All of these features are available in our open-source Honcho repo as well as in our managed SaaS platform.

You can check out the [full 3.0.0 changelog here](https://docs.honcho.dev/changelog/introduction#honcho-api-and-sdk-changelogs).

> [!tip]
> [The 3.0.0 docs also include **skills** for AI agents to one-shot Honcho integrations and migrations from the Honcho v2 API.](https://docs.honcho.dev/v3/documentation/introduction/vibecoding)
# Pricing Updates
Big news: Honcho is now 5x lower cost!

We've restructured pricing to be more aligned with what developers want and how Honcho works, allowing us to more efficiently charge for usage and pass the savings on to the developer. Plus Honcho R&D continues to pay big dividends for builders.

## Token-Based Pricing
A major pain point we hear from developers about memory solutions that pricing is often confusing or down right obfuscated. We agree. Compute credits, subscription tiers, limits, episode credits, "memory" units. It's a mess. And none of it is AI-native. Even per message pricing no longer makes sense. Developers want to model their costs and that requires clear and transparent pricing.

Instead of charging for each message ingested, Honcho 3.0 charges for *tokens* ingested, meaning that cost of reasoning is accurate and fair across all use cases. It's $2 per million tokens: 2.5-25x less expensive than other solutions and SOTA.

Moreover, ingestion is only charged when a message is actually *processed*, meaning that messages sent by peers or in sessions with reasoning disabled are free. You only pay for the actual work done, just as if you were self-hosting Honcho, but more cost and token efficient.

## Unlimited `get_context`, Granular `.chat()`
On the retrieval side, things have also gotten more granular. 

The `get_context()` method is unlimited, fast enough to call on every turn (~200ms), and solves statefulness with Honcho's opinion of the most relevant timely context automatically recruited and served. We don't charge for `get_context()`, it's reasoning you've already paid for, we don't hold it hostage.

And for advanced retrieval reasoning, `.chat()` is far more dynamic. You can now pay for the level of intelligence you need for each natural language question: each reasoning level has its own per-query price, starting at just $0.001. Combined with the inherent [token efficiency savings](https://blog.plasticlabs.ai/research/Benchmarking-Honcho#3-benchmarking-cost-efficiency) of using Honcho's chat API to gather context, sophisticated users can now save even more by routing their queries based on complexity. We may even support automatic routing in the future, though developers will always be able to exercise full control if desired.

Lastly, since "dreaming" tasks are still under heavy iteration, we're making them *free* for now. In the near future, we expect dreaming to be the place to spend to  get the *most* out of Honcho, since that it will continue to take on work currently done during both ingestion and retrieval, making those areas of the system faster and cheaper *and* improve in other ways to maximize the utility of each peer's representation. You can expect some dream tasks to no longer be free at that point, but this will only occur when dream configuration is exposed to the point where you have full control over exactly *what* background tasks get performed and *when* they occur. Anything we feel is necessary for *all* representations, we'll cover.
# Key Behavior Changes
In addition to the core Representation object that acts as the foundation upon which Honcho reasons about a peer, Honcho also exposes *summaries* and *peer cards* as fetchable objects in the API. These aren't going away, but in Honcho 3.0, they get produced differently. 

Instead of constantly updating alongside message ingestion, summaries and peer cards are moving to the dreaming system. Since dreams run intermittently, this means these objects won't be available for sessions and peers that haven't undergone dreaming. But don't worry our pareto dominant benchmark results don't include summaries or peer cards at all! Our research suggest that these once critical components are now best used surgically and per usecase across the spectrum of contemporary models, as opposed to every turn.

Developers should not rely on the existence of these objects in a vacuum. They should only be used as part of a comprehensive context gathering step that includes recent messages, peer representations, and the results from `.chat()` queries, all of which are designed exclusively for LLM consumption. 

We'll be publishing detailed case studies and example apps showcasing how best to do this with Honcho, but if you're confused, never hesitate to reach out in our [Discord](https://discord.gg/honcho).

# What's Next?
The trend is clear now. Honcho is going to get more agentic as time goes on. 

Not only will reasoning over memory be an agentic task, but soon enough, the entire process of storing application-specific history and knowledge will likely become automated by an agent. 

As an application provides implicit context to Honcho, in the form of sessions, peers, and messages, Honcho should be able to understand how best to form useful representations and memories for that application. 

And even beyond that, Honcho will eventually move beyond siloed per-application usage, allowing new apps to solve the memory "cold start" problem by hooking into existing representations of a new user from other apps. 

The future of agent memory is very bright indeed.