---
title: Context window size doesn't solve personalization
date: 05.11.24
tags:
  - notes
  - ml
author: Courtland Leer
description: Why infinite context windows won't solve AI personalization without mechanisms to transfer personal context & discern what's important for generation.
---
There are two reasons that ever increasing and even functionally infinite context windows won't by default solve personalization for AI apps/agents:

1. **Personal context has to come from somewhere.** Namely, from your head--off your wetware. So we need mechanisms to transfer that data from the human to the model. And there's *[[The model-able space of user identity is enormous|a lot of it]]*. At [Plastic](https://plasticlabs.ai) we think the path here is mimicking human social cognition, which is why we built [Honcho](https://honcho.dev)--to ambiently model users, the generate personal context for agents on demand.

2. **If everything is important, nothing is important**. Even if the right context is stuffed in a crammed context window somewhere, the model still needs mechanisms to discern what's valuable and important for generation. What should it pay attention to? What weight should it give different pieces of context in any given moment? Again humans do this almost automatically, so mimicking what we know about those processes can give the model critical powers of on-demand discernment. Even what might start to look to us like intuition, taste, or vibes.

All that said, better and bigger context window are incredibly useful. We just need to build the appropriate supporting systems to leverage their full potential.