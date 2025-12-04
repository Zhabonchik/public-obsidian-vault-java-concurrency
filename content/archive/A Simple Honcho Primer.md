---
title: A Simple Honcho Primer
date: 04.16.24
tags:
  - blog
  - honcho
---
![[bot reading primer.png]]

> [!NOTE] Welcome to our quick, "explain it like I'm 5" guide to [Honcho](https://honcho.dev)!
> We'll keep it simple, covering [[A Simple Honcho Primer#^ef795f|what Honcho is]], [[A Simple Honcho Primer#^x125da|why we built it]], [[A Simple Honcho Primer#^cd2d3c|how to use it]], and [[A Simple Honcho Primer#^ca46d7|where the product is going]]. But throughout, we'll link to places you can dive deeper.

## What Is Honcho?
^ef795f

Honcho is a personalization platform for large language model (LLM) applications built by [Plastic Labs](https://plasticlabs.ai).  

It's software infrastructure that lets AI apps "get to know" their users, resulting in delightful experiences and optimized time to value.

We'll have direct consumer experiences in the future, but today, the product is for application developers. It allows them to [[Introducing Honcho's Dialectic API#^a14c2f|reduce overhead]] and [[Introducing Honcho's Dialectic API#^x7f7f8|enhance their machine learning pipeline]].

Right now, Honcho is in private beta, that means integrating our hosted version requires permission and onboarding[^1]. [You can sign-up here](https://plasticlabs.typeform.com/honchobeta).

In its current form, Honcho has three core components:

1. [[Announcing Honcho's Private Beta#^x15f37|Storage]] - managing each user's data & inference about each user
2. [[Announcing Honcho's Private Beta#^x53717|Insights]] - processing user data with our proprietary AI models
3. [[Announcing Honcho's Private Beta#^ee4516|Retrieval]] - surfacing user data to personalize user experience (UX)

If you've heard of [Retrieval Augmented Generation](https://en.wikipedia.org/wiki/Prompt_engineering#Retrieval-augmented_generation) (RAG), this might sound familiar. But Honcho is doing *much* more than simple RAG.

Behind the scenes, Honcho learns about users as people--[[User State is State of the Art|richly modeling identity]]. It seeks to understand their beliefs, hopes, dreams, history, interests, and preferences. 

It then acts as [[Introducing Honcho's Dialectic API|an oracle to each user]], allowing apps to ask for any personal context they need to improve UX and giving them access to a social cognition layer.

## Why We Built Honcho
^x125da

Plastic Labs was founded as an edtech company. The original mission was to build an AI tutor that [[Open Sourcing Tutor-GPT#^x527dc|could reason like]] the best human instructors. We quickly found the key limitation was data not on the subject matter, but on the student. To overcome it, the tutor needed [[Theory of Mind Is All You Need|a way to]] get to know *each* of its students deeply.

Honcho was born by running up against this challenge, building technology to solve it, and realizing all AI applications are going to need the same solutions. The promise of *generative* AI isn't one-size-fits-all products, but bespoke experiences in each moment for each user. The same limitation emerges--how well do you know your user?

So we believe Honcho will be a critical, table-stakes part of the AI app development stack.

Why? Because [[Humans like personalization|users will want]] their AI experiences to be personalized and app developers shouldn't be redundantly solving that problem.

But it's not intuitive for a few reasons:

- AI app builders are [[Machine learning is fixated on task performance|still focused on]] just getting general tasks to work
- LLMs' [[LLMs excel at theory of mind because they read|potential to personalize]] is still under-appreciated  
- Historic examples of personalized apps usually just leverage our activity & engagement data
- Those examples tend to target only base user desire, lead to addictive behavior, & have poor privacy records

Still, when interacting with an AI app, there's a sense that it *should* be getting to know us. In fact, we're often surprised when we realize it's not learning about us over time. And probably annoyed at having to start over.

Think about personalization here as more like the experience of close human companionship or white glove services than the attention hacking mechanisms of TikTok. There's [[Announcing Honcho's Private Beta#^xb6ef1|enormous potenial]] for more positive-sum use of user data and for aligning AI applications more closely with user needs and preferences[^2]. 

## How to Use Honcho
^cd2d3c

Honcho is first and foremost a **storage** framework. Think of it like an open source version of the OpenAI Assistants API. User `sessions` store both user and AI generated `messages` as well as any intermediate inferences you might want to store as `metamessages`: 

```python
user_input = "Here's a message!"
ai_response = "I'm a helpful AI assistant!"

session.create_message(is_user=True, content=user_input)
session.create_message(is_user=False, content=ai_response)
```

But what about vectorDBs? Don't worry, Honcho has you covered there too. You can embed data and store them as `documents` in per-user vector DBs called `collections`: 

```python
collection.create_document(content="The user is interested in AI")
```

Using Honcho as a storage mechanism allows you to **retrieve** rich insights via the user profiles it's building and managing on the backend. Your application's LLM can access [[Loose theory of mind imputations are superior to verbatim response predictions|theory-of-mind]] inference over those profiles via the *[[Introducing Honcho's Dialectic API|dialectic]]* API. 

It's simple: just query in natural language using the `session.chat()` method:

```python
session.chat("What are the user's interests?")
```

There are a [[Introducing Honcho's Dialectic API#How It Works|ton of ways]] to use Honcho, this primer only scratches the surface[^3]. 

## What's Next for Honcho?
^ca46d7

Beyond improving our internal AI models so they can get to know users as richly as possible, we see three natural extensions in [[Announcing Honcho's Private Beta#^eb15f3|Honcho's future]]:

1. [[Announcing Honcho's Private Beta#^x2dd3b|Monitoring & Evaluation]] - developer tools to understand & assess the impact of personalization + machine learning tools to build personalized datasets
2. [[Announcing Honcho's Private Beta#^a84f44|User-Facing Controls]] - chat with *your* Honcho to direct how it manages & shares data + authenticate with Honcho to sign-in to AI apps
3. [[Announcing Honcho's Private Beta#^ebf071|Honcho Application Ecosystem]] - a network of apps contributing to & sharing Honcho data, user-owned & stored in confidential environments  

And in just a few weeks, we'll be launching a demo platform where anyone can interact with (& eventually build) Honcho powered apps.

## Join the Beta

[Sign-up for the private beta](https://plasticlabs.typeform.com/honchobeta) and start building personalized experiences.

[Join Discord](https://discord.gg/plasticlabs), introduce yourself, and tell us what you're working on.

[Visit our open-source repo](https://github.com/plastic-labs/honcho) and get your hands dirty.

🫡

[^1]: There's also [an open source repo for Honcho](https://github.com/plastic-labs/honcho), so you can self-host a basic version--[join our Discord](https://discord.gg/plasticlabs) for support.

[^2]: If you want to go deeper on the philosophical or machine learning side, take some time to explore the [rest of the blog](https://blog.plasticlabs.ai).

[^3]: To get further into the technical weeds, head over to [our docs](https://docs.honcho.dev). 
