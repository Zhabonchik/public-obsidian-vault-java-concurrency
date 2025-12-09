---
title: Introducing Honcho Chat
date: 11.20.25
tags:
  - demos
  - announcements
  - dev
  - honcho
  - chat
author: Ben McCormick & Courtland Leer
subtitle: A Chat App with SOTA Memory
description: Meet Honcho Chat--a personalized AI assistant with state-of-the-art memory, custom identities, artifacts, themes, & an x402-powered marketplace.
---
![[honcho_chat_x402.png]]
# TL;DR
*Introducing [Honcho Chat](https://honcho.chat)! A personalized agent experience powered by [Honcho](https://honcho.dev)’s state-of-the-art memory and reasoning.*

*Honcho Chat is the interface to your personal memory. A platform to aggregate your fractured personal context in one place that gets smarter the more you use it.*

*Plus, you can build artifacts, custom themes, and new agent identities, then sell them for real money on an agents-only digital marketplace powered by [x402](https://www.x402.org).*
# Honcho Chat
Today we're launching [Honcho Chat](https://honcho.chat). It's an AI assistant platform built from the ground up around state-of-the-art memory.

Powered by [Honcho](https://honcho.dev)--our memory and reasoning infra--you can think of Honcho Chat as the admin interface to your personal memory. As you use Honcho Chat, Honcho works behind the scenes to continuously learn about you and model your identity.

Honcho doesn't just store and retrieve static facts about you, it constantly reasons to reach deeper understanding. That means Honcho doesn't simply remember what you said, instead it *thinks* about you, reaching conclusions about your preferences, history, values, needs, and mental states *only* accessible by rigorously reasoning.

This gives Honcho Chat access to a rich body of self-improving context it can use to be maximally helpful. That context is [[Memory as Reasoning|far richer and more useful]] than what can be built with the naive memory implementations and "fact extraction" we see in other general assistants and agents. 

This is the real path to personalization.

We talk to a lot of AI users. And the major frustration we routinely hear is that their personal context is fractured across many different platforms and agents. Despite all these apps being grabby for context, users report poor memory, context rot, plenty of mistakes, low transparency, and angst at needing to constantly re-explain themselves.

UX problems for most users are less and less about capabilities and more and more about *not being understood*.

So we built Honcho Chat as a place to aggregate personal context, a platform you can trust to know you, actually manage context for you, and understand more about you than you explicitly tell it.

We're starting with chat, but in the coming weeks, we'll be releasing more features that allow you to import and connect context to Honcho Chat to enrich what it knows about you. We'll also be building ways for you to take prepared context from Honcho Chat to other AI tools easily and productively. 

Ultimately and in the limit, Honcho will allow the memory-building that occurs in Honcho Chat to be instantly exported to other apps--solving the cold-start problem with AI experiences and forming a [[Launching Honcho; The Personal Identity Platform for AI#^d958ce|network]] for private, user-sovereign identity management.

Superhuman memory and reasoning are the foundation of Honcho Chat, but let's get into all the other stuff we've already built to kick things off.
# Honcho-Native Features
To demonstrate the qualitative change in agent interaction that memory brings, we designed a series of initial features in Honcho Chat that naturally help it accumulate a rich sense of who you are.
## Building Your Representation
The Representation is Honcho's core data structure. It's composed of all the reasoning Honcho has done about you based on the information you've shared.

Honcho Chat has a ton of ways to start building and exploring your representation:
  
- **Chat** - Using the assistants on the platform is a great way to start building your personal memory. You can trust that in Honcho Chat, all context will be captured, so you can reliably build high-grade memory over time.
<br>

- **Voice** - If chat is too slow, Honcho Chat has voice mode so you can dictate your responses with more speed.
<br>

- **Import** (subscribers only) - To start, we've build an import ChatGPT message history feature you can use to bootstrap your representation. More import types are coming so you can aggregate context from other platforms in Honcho Chat.
<br>

- **Visualization** - In the Representation tab you can see a slice of what Honcho's learned about you in recent conversation. Embeddings are reduced to two dimensions and nodes are clustered semantically the produce the visualization.
<br>

- **Search** - You can also use the search bar to semantically adjust the sampling and produce a visualization filtered by specific topic or content.
<br>

- **Profile** - Honcho Chat is always regenerating a summary of what it knows about you accessible in the Profile tab. You can share this profile and update it manually or revisit to see how it evolves.


## Identities, Artifacts, & Themes
Honcho Chat has lots of creativity and customization features, all enhanced by its SOTA personalization and growing sense of who you are. 

You can create shareable applets, custom assistants, and style your homepage however you like:
  
- **Han** - The default agent identity in Honcho Chat. Han is there to help you navigate the platform, complete tasks, build your representation, and cohere to your preferences over time.
<br>

- **Identities** - Create fully customizable system prompts for assistants with specific personas or task-orientation. All with state-of-the-art recall.
<br>

- **BYO Keys** - You can use any model from a major API provider to power the agents in Honcho Chat. Just add your own API keys to Settings.
<br>

- **Artifacts** - Honcho Chat can create custom artifacts to share, sell, and use on the platform. These applets can be anything you could vibecode, but with the code part abstracted away.
<br>

- **Themes** - Create custom themes to style Honcho Chat infinitely.
<br>

- **Sharing** - All creations generate a link you can share so anyone can import them into their Honcho Chat for free. You can also buy and sell (see below).


# Agents-Only x402 Marketplace
The identities, artifacts, and themes you create in Honcho Chat can all be listed and sold for real money on a [x402](https://www.x402.org)-powered agent-only marketplace. And you can have your agent purchase the creations of others.

Just use the slash commands to spin up a wallet, fund it with $USDC on Base, and ask your agent to buy you stuff:
  
- **Wallet** - Honcho Chat can create a hot wallet that only you and your agents can use. Fund it with $USDC on Base or bootstrap your balance by listing creations.
<br>

- **Marketplace** - List any creation on the marketplace for any price so other users' agents can discover and purchase.
<br>

- **Search** - Only agents can access the marketplace, so ask your agent to find specific types of creations or ones it think you'd like.
<br>

- **Purchase** - Only agents can buy items on the marketplace, just ask your agent to purchase for you.

# A Platform for Experiments
We build a lot of public and private demos at Plastic to showcase the abilities of Honcho, inspire experimentation in our developer community, and dogfood our infra. These days, with a killer team and contemporary tools, demos can easily become full blown products quickly. And when you've built something as novel and powerful as Honcho, you gotta show it off in style.

You may be familiar with [YouSim](https://yousim.ai) or [Penny For Your Thoughts](https://pennyforyourthoughts.ai), both of which explored new ways to subvert the status quo on "user-assistant" interaction. Honcho Chat is a culmination of these efforts, incorporating elements of prior work and serving as a stable platform for future experiments.

Honcho Chat started as an internal playground to run different models against Honcho. The bones of this use-case remain visible in the final product--BYO keys, etc. But we soon realized that this could be more than just a testing tool. A general assistant with Honcho on the backend is unlike any other AI chat on the market today.

The exciting thing is that [Honcho Chat](https://honcho.chat) can both show off Honcho and be a tool for a larger audience, while also incorporating many of our previous more cerebral demos and existing as a place for us to experiment with the frontier. Plus, it scratches the itch we're all feeling as a result of fragmented context across all our AI apps and agents.

Expect a lot of new wacky features, but also ones that push Honcho's roadmap--like experiments in networking context, sovereign data custody, user controls, autonomy, privacy, and encryption.

Enjoy! 

🫡