---
title: Identity is diachronic
date: 09.18.25
tags:
  - philosophy
  - honcho
  - ml
  - notes
  - cogsci
author: Courtland Leer
description: Why AI context management is really identity management--understanding how identities persist yet change over time to deliver optimal context.
---
The quality of any single AI system output is in large part determined by the context available to it at inference time. While some context is static and reusable, AI systems aspiring to be truly generative, 1-to-1, and dynamic, must also manage large sets of changing context.

So a major obstacle to solving context management for AI systems is in squaring continuity with change. That is, how do we differentiate between static and evolving context? Or should we instead view both as properties of context sets? What do we even call a body of context that remains static in some ways, but changes over time in others?

In philosophy and many other cognitive sciences, this is called an *identity*. All material or conceptual objects have a personal identity--humans, agents, APIs, NPCs, organizations, communities, memes, brands, etc. And those identities have a temporal dimension; they can be coherently understood as enduring things, but also as different at different moments in time. They're diachronic[^1].

At Plastic, we think context management/engineering is really better framed as identity management/engineering. Delivering the best context to your system in each moment itself requires a system to understand multiple identities at multiple points in time.

Our system for that is [Honcho](https://honcho.dev), where developers or agents can create a [[Beyond the User-Assistant Paradigm; Introducing Peers|peer]] for any identity it's important to model, so that optimal context is synthesized and available when an application needs it. Peers in Honcho are self-improving representations of identity, made of context and the reasoning done by our [Neuromancer](https://honcho.dev/neuromancer) series of models over that context.

[^1]: Identity over time is a hotly debated topic in philosophy. Those interested should explore the endurantist vs. perdurantist debate and synchronic vs. diachronic identity, especially the work of Parfit & Lewis, from which we take heavy inspiration.
