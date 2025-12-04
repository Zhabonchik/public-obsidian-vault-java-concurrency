---
title: "ARCHIVED: Introducing Honcho's Dialectic API"
date: 03.26.24
tags:
  - dev
  - ml
  - announcements
  - blog
---
![[agent_dialectics.jpeg]]
## TL;DR

Our [Dialectic API](https://docs.honcho.dev/guides/dialectic-endpoint) is an LLM-native way for your AI application to discuss user context with Honcho. It allows for direct LLM-to-LLM communication in natural language.

Agents need ways to interface dynamically and autonomously, free from the rigidness of traditional APIs. We're building that substrate.

## What's a Dialectic API?

[Honcho](https://honcho.dev) is our platform for personalizing agents to users. Currently, it includes [[ARCHIVED; Honcho; User Context Management for LLM Apps#^a9d0f8|session storage]], BYO context storage, passive [[Loose theory of mind imputations are superior to verbatim response predictions|theory of mind]] user modeling, and *now* an agent deeply coupled to all of that rich user context. That agent can be called via our Dialectic API to surface user data for use with any cognitive architecture.

### How It Works

In designing an LLM pipeline and an application's cognitive architecture, you'll need to decide where and how to inject personal user context so the task is [[Machine learning is fixated on task performance|not simply completed in a general way]], but in the most appropriate way for [[ARCHIVED; User State is State of the Art|each specific user]].

That's when your agent asks Honcho for what it needs in natural language. This query can take many forms. Some possibilities:  

- A single or list of question(s) about the user
- A prompt fed to Honcho to hydrate with personal context
- A user insight to inject directly into a prompt
- A custom while loop to gather context from Honcho until some condition is met
- A personalized revision of a potential user response
- A theory of mind prediction about the user's state or behavior
- A user context query to cache for later use
- A list of Honcho-derived facts about the user so far in the session
- A list of reasons why the user is behaving a certain way
- A static fact about user identity
- A piece of user data to use in improving your app's overall vertical or user-specific service  

Key to note here is the ability to hard code the most useful type of Honcho query for your app's use case *or*--better yet--to [[On intellectual respect|trust your agent]] to reason autonomously about what it needs based upon the current session (or any other criteria) and feed that to Honcho. Or run a hybrid approach. This can be done synchronously with an inference/session or async as needed.

In this way, Honcho becomes an self-improving oracle to the identity of each and every one of your app's users. Any agent can chat with a representation of a user (as Honcho) on the backend.

Honcho responds to queries in the same format--natural language. Most simply, this is just a conversation between two agents, *collaboratively* reasoning about the best way to personalize UX. Agent-to-agent chat over users.

In the coming weeks, we'll release a number of off the shelf options to plug into any cognitive architecture and demos to illustrate more custom utility. We expect to see (and are already seeing in [our private beta](https://plasticlabs.typeform.com/honchobeta)) lots of novel ways to prompt Honcho effectively.

### Why We Built It

Why is a dialectic API the right way to solve the problem of user context in LLM applications? 

Not only is it ideal from a development and design perspective, it's optimal for the particular task of personal context and user identity.

#### The DevEx Case
^a14c2f

Our Dialectic API is single endpoint for everything personalization.

It reduces development overhead and allows you to get a personalized application running quickly and efficiently--speedrunning to production. 

For most AI apps, personalization will be a key differentiator between your agent and ever more capable foundation models. But setting up a RAG pipeline to manage all your user data--much less transform that into a useful representation of each user--is a laborious and significant R&D investment. Honcho is a ready-made, plug and play solution.

Further, when agents can communicate directly using natural language, there's no need to learn and manage complicated API specification. Or for us to build it. Since LLMs are proficient at interpreting the intricacies of natural language, there's a functionally infinite number of ways to ask Honcho a question and get a satisfactory result. Far superior to brittle and strict legacy APIs.

However, this doesn't mean the developer now needs to be a prompting expert, fluent in all its esoterica. Honcho is an expert in personal context and theory of mind reasoning, so your prompts can be adaptive and ad hoc, and Honcho will figure out the rest. When you're ready, you can even offload the queries to your app-side LLM.

#### The ML Case
^x7f7f8

Extra context improves user response generation, the more specific, the better. Focus on ML to crush your vertical, let Honcho personalize it by default.

##### Leverage Natural Language Plasticity

Each user has a [[ARCHIVED; User State is State of the Art#^5bc20b|rich and complex personal identity]].  Access to higher-fidelity representations of that identity can be combined with the task completion context of you app in each moment to generate the most optimal tokens for each user-agent interaction. I.e. ones that are felt by the user to be [[Humans like personalization|more personalized and satisfactory]]--enhancing the real and perceived time to value ratio of your app.

But that complexity is hard to capture and needlessly constrained with typical API design. In order to express the nuance of personal context, we need the high variance, dynamic nature of natural language.

Because LLMs consider tokens in relation to a vast [[LLMs excel at theory of mind because they read|human narrative space]], we're much closer to *semantic* machine understanding than ever. Personal context allows you to target parts of the latent space most useful in generating tokens for specific users in specific settings. The only way we know to communicate and leverage that depth is with the inherent diversity of natural language...which is itself evolutionarily optimized to describe human identity well.

Way richer than running RAG over a vector store of session logs. Or stateless CRUD-inspired API spec.

##### Out-Compete Foundation Models

Honcho's Dialectic API also allows you to build training examples with rich theory of mind context. Those datasets can help you outperform foundation models in your specific vertical and its set of tasks.

By adding additional context to inputs, the distribution of responses your model samples from can be improved. Any sort of "reasoning" the language model exhibits in a single inference is due to learned patterns in the dataset. So if you can create examples that can help it learn better patterns, you can improve the "reasoning" steps it exhibits. 

Ultimately, we're learning ways of responding that foundation models won't. Using theory of mind context yields more specific examples, which allows more robust domain-specific training.

### Why "Dialectic"?

In the classical sense, a *dialectic* process is one where two parties seek to arrive at the truth via reasoned dialogue.

(In our case, the truth is a solution for delivering the optimal per-app, per-user, per-session experience.)

We've termed our API this way because not only is it communication between software systems, but it's a reasoned discourse between agents to reach the ideal conclusion. 

Each agent has a different set of information, the free discussion allows them to eliminate that asymmetry and arrive at a synthesis greater than its parts. One agent is expert in delivering a service in its vertical, the other in modeling user identity and surfacing relevant, timely context based on that representation.

## The Agentic Substrate

Our Dialectic API is part of an evolutionary lineage. One that records humanity's slow discovery of all the ways machines can communicate with one another--from telegraph and punch cards to REST and GraphQL. Along each axis of typical machine comm improvement, agent-to-agent dialectics offer advantages:

- **Speed** - user time to value can be optimized with granular personal context requests
- **Complexity** - natural language, being more expressive, is capable of capturing highly specific user states and predictions
- **Efficiency** - ask for precisely what you need, inject exactly where you need it
- **Security** - re-centralizing user identity with Honcho disincentivizes user modeling on a per-app basis
- **Standardization** - natural language is universal to humans and LLM-powered synthetic agents, as is the narrative space those parties draw from
- **Fault Tolerance**[^1] - instead of just throwing errors, LLM agents can either figure out any confusion or simply ask for clarification 

As the commodification of inference and intelligence is coupled with growing general foundation model capability, application developers will naturally be pushed toward greater and greater vertical specificity. This will drive the development of increasingly atomic agents, ones who excel at a very narrow tasks.

This explosion of such agent microservices, will have to include the evolution of systems for agent-agent communication and transaction. If agents are going to collaborate and get shit done for us, they need native ways to communicate. Beautifully, LLMs share with us and among themselves the universal interface of natural language.  

We can leverage this substrate for agent coordination with more depth and nuance than fragile trad API design. Doubtless, categories of agents will find more efficient symbol structures for cooperation in specific, repetitive cases. But discourse in natural language remains always available as a rich foundational protocol. And as we've explored, it's the ideal starting place for transmitting insights about human identity.

This is just the start. Just like you can appendage memory and tools to an LLM, we can augment this substrate in a number of ways--from designing multi-party protocols, to enabling zero knowledge or confidential environments, or recording transactional data on blockchains or other types of public or private immutable ledgers.

That kind of richness puts us one step closer to the dream of a semantic web, one as replete with meaning as the physical world *and* machine grokkable. What *matters* to me can be used to personalize an atomic agent *just in time*, without sacrificing important context. Intelligent microservices can be more aligned with me than human economic actors and professional services, which are plagued with high-latency interest misalignment and information asymmetry.

Honcho and agent dialectics can eliminate the principal-agent problem for this new economic paradigm, digitally extending human agency and identity further than ever before. 

## Private Beta

Our Dialectic API is now available in private beta.

We're working closely with a diverse array of projects across many different verticals in various stages of development--from ideation to production.

If you're excited build with a hosted version of Honcho and explore the ideas covered here, [sign-up for our waitlist](https://plasticlabs.typeform.com/honchobeta).

And in the meantime, [join our Discord](https://discord.gg/plasticlabs) and tell us what you're working on!

[^1]: Our friend [Neel Baronia](https://twitter.com/nbaronia1) calls this a "[Squishy API](https://nbaronia.notion.site/AI-Agents-Squishy-APIs-56f1f845d3bd44cda306967652de08ca)" & has thought a lot about the business model implications