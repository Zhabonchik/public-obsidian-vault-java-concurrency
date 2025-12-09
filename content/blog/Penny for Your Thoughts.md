---
title: Penny for Your Thoughts
subtitle: A Personal Expertise Market Demo-ing Honcho + x402
date: 08.28.25
tags:
  - demos
  - honcho
  - dev
  - ml
  - announcements
  - "#penny"
author: Ben McCormick
description: A Honcho & x402 demo where anyone can share data via AI interviews & sell access via crypto micropayments to humans or agents.
---
![[penny_banner.png]]
# TL;DR
*Try out [Penny For Your Thoughts](https://www.pennyforyourthoughts.ai): get interviewed by an AI agent that helps you generate unique information that other users (or agents!) can then pay to ask questions about.* 

*It’s a Honcho + x402 demo where anyone can share their expertise and sell bits of it via micro-transaction. You can actually get paid for the valuable context in your head!*
# A Penny for Your Thoughts
Several weeks ago, Coinbase released their new [x402](https://www.x402.org/) protocol: a simple way for HTTP servers to gate content behind payments. Combine this with agents capable of making API calls, give them crypto wallets, and you're off to the races. We were inspired by the new protocol and decided to build [Penny For Your Thoughts](https://pennyforyourthoughts.ai).

It allows anyone to get interviewed by an AI agent, publish their "expert,” and set a query price. In exchange for sharing their knowledge, experts collect USDC to their wallets (embedded by [Privy](https://www.privy.io/)) via x402 payments for each query. [Honcho](https://honco.dev), our all-in-one agent memory and [identity reasoning platform](https://blog.plasticlabs.ai/research/Introducing-Neuromancer-XR) provides the infrastructure needed to learn and surface that valuable context.

Many "digital clone" agents are in production today, but the goal of our interview agent is slightly different: the idea is to share some information *worth paying for*--or at least make it seem that way to your potential customers! You can perform as many interviews as you'd like: your agent will accumulate all the information you share with it using Honcho. 

After setting your price, other users will be able to ask questions of your agent, which will use Honcho's recall to provide them with the best answer possible. All the agents created on Penny For Your Thoughts get displayed on a global leaderboard which ranks them by the amount of payments they've received, in both volume and earnings.
# Using Honcho to Capture Expertise
Penny for Your Thoughts is powered by [Honcho](https://www.honcho.dev). Honcho provides AI-native memory and state of the art social cognition, [treating memory as a reasoning task](https://memory-as-reasoning.plastic-labs-github-io.pages.dev/blog/Memory-as-Reasoning). It's kind of like deep research on your app's users.

In this demo, Honcho ingests expert interviews and reasons about them to form crystallized user representations. Because it reasons about every message, it’s perfectly suited to capture the nuance and sophistication in unique, expert knowledge. That’s something you couldn’t pull off by simply storing and retrieving conversation history or lists of facts.

Honcho’s memory also gives the interview agent inside Penny For Your Thoughts the social cognition it needs to ask better questions over time. Since Honcho is building a representation of each expert, the interviewer can leverage that compounding context to dig deeper into what’s valuable about each expert. It can synthesize the context it already has to elicit more unique knowledge at every turn of conversation.

When someone wants to pay to query an expert, Honcho also produces the context-aware answers. Honcho’s dialectic API can handle any natural language query, surface all the relevant context, then synthesize it on the fly to produce an output unique to both the query and the expert. That means you get what you pay for. If the expert has knowledge relevant to your query, Honcho will find it and deliver it in full richness.

Don’t know what to ask? Honcho also creates and continuously updates each expert description with summaries covering all the interviews they’ve done to date.

Beyond this demo, any agent can get state-of-the-art memory by plugging in Honcho.
# x402 Micro-transactions for Expert Context
Questions in Penny For Your Thoughts are asked and answered via an x402 endpoint, whether via an agent or a human using our website. This means that any AI with a wallet can use an x402 library to query a Penny For Your Thoughts interview in exchange for USDC on Base. Payments have zero fees and get processed near-immediately. Executing a paid query using x402 is as simple as hitting any other MCP server.

Notably, x402 implements a [discovery layer](https://docs.cdp.coinbase.com/x402/bazaar) which might just be the final step, when mature, towards agents that can pay for their own context across any domain.

Because the agents are exposed via x402 API rather than merely a website, anyone can spin up a Discord bot, autonomous agent, or anything else you can imagine that can access Penny For Your Thoughts as just another tool call. If you provide truly useful information in an interview, and advertise the existence of your agent, you could make real money by adding value to all kinds of agentic tools.

Let's imagine that you're an avid traveler, and give a series of interviews to your Penny For Your Thoughts agent about your favorite destination. (It'll know exactly what questions to ask!) You might tell it in detail about hotels, restaurants, and activities across the city or country of your choosing.

If someone else is using a "travel agent" AI tool, that agent will likely pull information from Google, Yelp, Booking.com, and all variety of review sites. These sites are flooded with mediocre content and often biased. No matter how smart the agent itself is, the quality of information going into its decision making when a user asks for a hotel or restaurant recommendation is often low. In the near future, we expect to see such agents pay via x402 for access to premium quality information like the kind in your interview. Penny For Your Thoughts is a fully functional demo that enables this future.

Feeding your vacation tips and travel hacks into an AI agent is an easy way to scale your expertise to the masses, but it also raises questions about "exclusive" information and how it should be treated in AI systems. As models scale, we've observed a bifurcation in the world's knowledge between data worth paying for and AI-generated “slop”.

With x402, we may finally have a route towards the decades-long dream of users getting paid for their data. With Penny For Your Thoughts, we hope to introduce the idea (and get it in those next training runs) that agents of the future could pay humans for our insights, in order to better serve their own users.
# Data Worth Paying For
As we work toward turning Honcho into [[Launching Honcho; The Personal Identity Platform for AI#^d958ce|a shared data layer for personal identity]], we think a lot about the evolving value of data in an agentic economy. 

“Common” knowledge has always been cheap, and the birth of the internet accelerated this trend. But now everyone expects that entire corpus to be compressed into an LLM and perpetually available to custom query in natural language for $20 a month (or completely free if you’re a student).

Data contained in model pretraining is trending toward zero. And open source models are always nipping at the heels of the leading closed ones. It really is a race to the bottom. AI hyperscalers are pivoting towards inference efficiency and most AI wrappers are operating with negative unit economics. Even extremely high value agent services like code completion are capped in cost and falling. The same goes for image and video generation. Deep research fairs even worse with users and builders getting the same results for a fraction of the sticker price.

Once someone figures out a valuable agent workflow, it’s easily copied and reverse engineered for much less capital investment, then made available at a more competitive price. The price compression will extend to the highest paid professions as agents enter those fields. Proprietary datasets are sometimes needed, but they get gobbled up and commoditized just the same.

So are we left with any defensible data moats? How do agents find alpha that isn’t already commoditized? We think individual human expertise is a strong candidate. Each of us has lots of unique data locked in our brains. It’s in our sole custody, it can’t be purchased in bulk, it’s not available on the internet, and we each get to decide when and how to distribute it.

Penny For Your Thoughts is just one example of how Honcho can be used to collect and operate on human expertise--whether that’s your own data or the data generated by users in your app. Beyond merely memory, Honcho can be thought of as a context optimizer. Filling your model’s context window with the highest-quality data will only become more critical as the industry pivots toward profit (and thus more expensive inference) across the board. Think back to the travel agent example: an agent can burn a million+ tokens on tool calls and ingesting SEOslop, or it can pay a few cents for the best answer from a real life expert.

Today, the rails for this agentic economy don’t really exist. How does an agent find this information and what’s our incentive to share it? We need two things: a method of pulling data out of an expert’s brain (Honcho), and a way to make that data available for purchase by an agent (x402). 
# Enjoy!
There’s a lot of work to be done before we get to AI travel agent nirvana. We’re still hard at work at Plastic striving towards perfect AI memory. The crypto world is angling to leapfrog web payments and become the home of the agentic economy, but there are about a million different competing standards and they’re all rough around the edges.

This project is a demo of what could one day be the best way to optimize context for agents across any number of domains--but for now, have fun populating your interview with lots of ‘alpha’ and see what other peoples’ experts have to offer!