---
title: Announcing Honcho's Private Beta
date: 04.01.24
tags:
  - announcements
  - dev
  - ml
  - blog
---
![[honcho_thumb_blog_white.png]]
## TL;DR

Today we're announcing the launch of [Honcho's](https://honcho.dev) private beta. [Sign-up for the waitlist here](https://plasticlabs.typeform.com/honchobeta).

This is a hosted version of our agent personalization platform. It integrates user data storage and theory of mind inference accessible via [[Introducing Honcho's Dialectic API|our Dialectic API]]. You can now inject per-user social cognition anywhere in your AI app's architecture.

## The Problem

Most AI apps are still just demos. 

We're seeing new capabilities every day, but great product experiences are few and far between. It's hard to go from knocking down a benchmark or prototyping task completion to a sticky production grade app.

Setting up a per-user storage framework to manage identities at scale *and* knowing what to do with that data is even harder. What kind of inference do you need to run to make this useful? How do you elicit latent theory of mind capabilities from LLMs? What collection of models are best here? How do you build useful user representations? Can these evolve with the user and increase in complexity and sophistication over time?

It's a lot. And trust us, the rabbit hole goes way deeper than that. We obsess over it.

So it's understandable that most projects haven't begun to tackle it. Hell, most haven't even hit this failure mode yet. [[Theory of Mind Is All You Need|We have]]. 

At once, the problem of personalization in AI apps offers both one of the greatest paradigm shifting opportunities and one of the largest challenges. We're solving it so you don't have to.

Users don't want to learn confusing prompt engineering, redundantly establish state with apps every session, or revise and micromanage outputs on the backend. They want their apps to *just work*. [[Humans like personalization|They want]] them to predict their needs. 

But we're finding consistently that the work we offload to AI apps comes back mediocre at best. What's missing? It's not just about [[Machine learning is fixated on task performance|doing the thing generally]], it's doing the thing just like *I* would do it, given the inclination or expertise.

To earn the trust to act autonomously, to graduate from toys to life changing tools, agents need access to dynamic user models and social cognition.

## The Solution

Why use Honcho to start modeling users and incorporate social cognition?

You need to discover your users' unmet needs so you know how your product should evolve.

### Features

Here's what the private beta currently includes, and what's on the way:

#### User-Centric Storage
^x15f37

Honcho allows you to [store](https://docs.honcho.dev/getting-started/architecture) `users`, `messages`, `sessions`, & `metamessages`. That is, you can effortlessly record each user interaction with you application, organized on a per-user basis, and the product of any intermediate steps in between user message and application response.

It also supports `documents` and `collections`. The former to store discrete user embeddings and the latter to organize them globally across sessions. These primitives are used by Honcho's personalization engine to begin modeling user identity based on each interaction. They can also be used to "bring you own" user data or context to be computed over and utilized by Honcho.

#### Personalization Engine
^x53717

Here's where the magic happens. Honcho leverages everything in storage to run theory of mind inference and automatically learn about each user.

The personalization engine both pulls out user desires, history, beliefs, emotions, etc from the data and surfaces it on demand. You can use it to answer queries, run prediction, build training sets, hydrate prompts, or cache for later. Deterministically inject specific types of context or let your LLM dynamically decide what's most useful in each moment.

Honcho is always updating user identity, so it's ready when you need it.

##### Dialectic API
^ee4516

Our [[Introducing Honcho's Dialectic API|Dialectic API]] is how your app-side LLM interfaces with the Honcho-side agent sitting on top of each user identity. This is done in natural language. It's an AI-native endpoint for direct LLM-to-LLM communication.

It allows you to inject personal context and social cognition directly into your app's cognitive architecture wherever you need it, sync or async. Agent-to-agent chat over each user.

[[Introducing Honcho's Dialectic API#^57acc3|Here's an extended list of possible ways to use it]].

#### User-Specific Monitoring (coming soon...)
^x2dd3b

Soon, Honcho will support a suite of tools to get the most out of our personalization platform. 

- **Visualization tools** - it's hard to grok and track everything going on within a session, we're building clean ways to visualize this an its relationship to all the background inference  
  
- **Dialectic Playground** - take past sessions and run simulations predicting user behavior to see how things could have gone better or worse and how to optimize 
  
- **Evaluation & Benchmarking** - the state of theory of mind research is highly compelling, but [[Achieving SOTA on OpenToM with DSPy#^0b4f2e|we need practical, app & user specific evals]]  
  
- **Training Set Curation** - building datasets with personal context [[Introducing Honcho's Dialectic API#^f19646|allows more robust, domain-specific training]], we're building tools for anyone to easily construct then train on

### The Future of Honcho

^eb15f3

At [Plastic Labs](https://plasticlabs.ai), we're dedicated to radically extending human agency and identity. That means giving AI superpowers to every individual.

This only works in a world with a rich ecosystem of personalized agents--individually-aligned, highly distributed, and universally accessible.

We believe Honcho has a pivotal role to play in enabling this future: giving any project the social cognition needed to be competitive while protecting user identity as a first principle. 

All that guides a roadmap including, but not limited to:

- **Theory of mind AI models** - continuing to build the best in class at imputing human mental states  
  
- **Per-user models** - understanding, representing, & updating the full breadth of user identity  
  
- **A *network* of Honcho-powered apps** - agents can share user data, reducing overhead & onboarding, just-in-time personalization  
   ^ebf071
- **User owned data & confidential computing environments** - re-centralizing personal data around the person, then allowing approved applications to *compute-to* that data in a privacy preserving way  
  
- **User-facing controls** - empower users to curate their Honcho identities, authenticate with Honcho, and define sensitive data sharing policies in natural language ^a84f44

### Who Is This For?
^xb6ef1

We want to build with diverse projects at all stages of development--from ideation to production.

We've already begun working with assistant, browsing, ecommerce, education, health, and productivity projects. Many more already on the waitlist are building in co-pilots, crypto, entertainment, finance, gaming, matchmaking, PKM, real estate, social media, & more.

Which AI applications could benefit from knowing the users better, predicting their unmet needs, and personalizing UX? We think the latent list is vast.

Any app producing generative experiences for users has a lot to gain from Honcho. If you're looking to out-compete foundation models, build unique training sets, solve user context storage, or--more importantly--produce delightful experiences, hit us up.

## Join the Beta

[Sign-up for the private beta](https://plasticlabs.typeform.com/honchobeta) and start building personalized agent experiences.

[Join Discord](https://discord.gg/plasticlabs), introduce yourself, and tell us what you're working on.

[Visit our open-source repo](https://github.com/plastic-labs/honcho) and get your hands dirty.

🫡

