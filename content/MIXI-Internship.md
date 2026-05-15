---
title: My Internship Experience at MIXI
date: 2026-04-11
tags:
  - internship
---

# My Internship Experience at MIXI

![image](/media/IMG_0370.JPG)

## Introduction

In January 2026, I joined MIXI through its Dive into MIXI internship program and worked on the DAD team, where I contributed to iOS development for FamilyAlbum (Mitene in Japanese). This was my first internship and my first experience working in a real product team. Because most of my previous development experience had been in solo projects or small teams of three or four people, I quickly realized that contributing in this environment required much more than technical ability alone.

## Learning to Work in a Real Team

### Professional Communication in Japanese

I grew up in Brazil and had already studied Japanese to a level that was enough for university life in Japan. At École 42 Tokyo, I also became familiar with programming terms and code reviews in Japanese. Even so, I soon realized that communicating in a professional team environment required something different. At first, I sometimes spent too much time trying to perfect my Slack messages, and when I relied too heavily on AI, the final wording sometimes felt slightly different from what I actually wanted to say. Through those experiences, I realized that writing a polished message was not the most important thing. What mattered first was understanding the issue clearly myself and knowing what I wanted to communicate. After that, I started using AI more carefully: not to write messages for me, but to help me organize my thoughts and learn common patterns of formal workplace communication. Through that process, I realized that professional Japanese communication was not something I could fully learn at school or university, because it depended on the language, expectations, and etiquette used inside an actual Japanese company.

### Becoming More Proactive

During my first few weeks at MIXI, most of my time went into onboarding: reading documents, watching compliance videos, and setting up my development environment. As I began working on actual tasks, I gained a clearer understanding of what was necessary to move work forward, including access to tools such as Figma and AWS, as well as test devices. Through this process, I learned the importance of identifying those needs early, requesting them through the proper channels, and coordinating directly with the people involved. This experience taught me that moving work forward requires not only implementation, but also proactively recognizing gaps and resolving them through communication.

### Navigating a Large Codebase

Before joining MIXI, most of my development experience came from personal projects built with SwiftUI and MVVM. Although I had studied some of the basics of Clean Architecture beforehand, this internship was my first time seeing those ideas applied in a large production codebase. What made it difficult at first was not only the architecture itself, but also understanding how the project was actually structured and where I should look when working on a task. To deal with that, I started using tools more intentionally: I used Claude Code to help me locate relevant parts of the codebase, and I relied heavily on Xcode’s search, bookmarks, and debugger to trace how different parts were connected. Over time, I learned that navigating a large codebase was less about understanding everything at once and more about building a practical mental map of where relevant logic lived.

### Learning to Work Out Loud

One thing I appreciated early on was that this internship felt like real development work rather than a short workshop. Because I was working in a large production codebase, my first instinct was to try to understand its architecture as a whole. I used tools like Claude Code to help explain unfamiliar structures, but I soon realized that trying to fully understand the entire codebase would take far longer than the internship itself. My mentor told me that even full-time engineers were not familiar with every part of the codebase, and hearing that was a major shift for me, because in my personal projects I was used to understanding everything myself. After that, I changed my approach. Instead of trying to understand the whole system first, I began by describing the specific problem I was working on, thinking through a plan, and using AI tools to help me locate the parts of the codebase that were most likely relevant. From there, I had to judge whether the suggestion was coherent, share both the AI output and my own reasoning with teammates, and only then move forward with implementation. This helped me learn one of the most important habits of the internship: working out loud. Over time, I started sharing what I was planning to do in chat before acting, so that I could get feedback from my teammates earlier and reduce misunderstandings.

### Asking Better Questions

At the beginning, I noticed that some of the questions I asked were already answered in the team’s Notion pages. That made me reflect on how I was asking for help. I learned that asking a good question is not only about getting an answer quickly, but also about showing that I had first organized the situation for myself. My mentor made this especially clear to me: if I could not explain the problem clearly, other people would not be able to help me effectively. After that, before asking for help, I tried to clarify what the problem was, what I had already checked, and exactly where I was still stuck.

## Working Environment

### Choosing to Go to the Office

Most of my team worked remotely, but I still decided to go to the office every day. One reason was that, whenever I had the chance to speak with people in person, I found it much easier to express myself than through written messages alone. Going to the office also gave me more opportunities to build relationships beyond my immediate tasks. Through one-on-one conversations and lunches or dinners with teammates, I gradually felt less distance between myself and the people around me, which made communication feel more natural over time.

### The Office Environment

Another reason I enjoyed going to the office was the environment itself. The office made it easy to balance communication and focused work depending on what I needed that day. When I wanted to concentrate deeply on a task, I could use the Deep Zone, a dark room designed for quiet, focused work. At the same time, the building had convenience stores, coffee shops, and restaurants, which made it easy to spend the whole day there. The view over Tokyo from Shibuya Scramble Square also made the office feel like a special place to work.

![image](/media/IMG_1856.jpg)

## Growing Through Team Workflow

### Defining My Goals

I also had weekly one-on-one meetings with HR, and those conversations helped me clarify what I wanted from my first internship. More than simply completing assigned tasks, I wanted to experience what it really meant to be part of a development team and to learn how people collaborate throughout the full workflow of a task. For me, that included communicating dynamically on Slack in formal Japanese, discussing work in person, understanding how tasks were assigned and planned, sharing my approach with teammates, implementing while receiving feedback, and then responding during code review. That was one of the most valuable parts of the internship, because it was something I could not have learned in the same way outside of a real team environment.

### Becoming More Active in Scrum

One pivotal moment came during my second month, when I took the Agile and Scrum training. Before that, I attended the team’s Scrum-related meetings, but I did not yet clearly understand the purpose of each one, and I sometimes mixed up sprint reviews, retrospectives, planning, and refinement. The training helped me see how those meetings fit together as part of the team’s overall workflow. I began to understand more clearly which meetings were for reflecting on the last sprint, which were for planning the next one, and which were for refining backlog items and specifications. Once I could see that full picture, I started to think about those meetings differently. They were not only places for me to observe and learn, but also places where even small comments could help the team improve. Because of that, I began participating more actively: I shared ideas about some use cases for Live Activities on iOS, offered UI suggestions on one of the screens, and wrote more thoughtful reflections in retrospectives about what had gone well, what had not gone well, and what I wanted to improve in the next sprint. That change made me feel less like an intern who was only observing and more like someone who was starting to contribute more proactively as part of the team.

## Tasks I Worked On

### Limiting a Feature by Country

One of the tasks I worked on was contributing to an unreleased feature by limiting its availability to specific countries. Because the task was related to country-based restrictions and legal considerations, I knew I needed to verify it carefully rather than treat it as a simple logic change. I based the implementation on the task requirements and then traced through the relevant files to identify every place where the feature’s behavior depended on location. What made this difficult was not only changing the logic itself, but making sure the restriction was applied consistently throughout the feature. Because it was also my first time writing tests in Swift, I had to think carefully about which cases to cover: supported countries, unsupported countries, and cases where the user’s country could not be retrieved. I also verified the behavior on a real device and debugged the implementation when needed. During code review, I received feedback that calling the location API multiple times was inefficient, so I added a cache with a TTL to avoid unnecessary requests. After several rounds of review on both syntax and logic, I also tried to make QA’s work easier by clearly explaining what I had changed and which cases I wanted them to verify. That task taught me that even a small change in product behavior needs careful thinking about consistency, performance, and verification, especially in a product used across many countries.

### Migrating a Legacy Library

Another task I worked on was replacing an old sheet presentation library after it broke on iOS 26. The goal was to migrate the affected screens to a native iOS solution. What helped me at the start was that another engineer had already opened a pull request fixing one of the sheets, so I used that implementation as a reference to understand the direction the team wanted to take. At the same time, the remaining sheets could not be migrated by simply copying that approach. Some of them contained scrollable content, which meant I had to think more carefully about how their size and presentation should be handled with the native implementation. Because this kind of change could not be fully verified through automated tests, I recorded videos of the screens before and after the migration, included them in my pull request, and then asked QA to confirm that the behavior still matched. Working through that process taught me that migration work is not just about replacing old code with new code, but about understanding the behavior of each screen and finding reliable ways to verify that nothing important was lost.

### A Small UI Refactor

I also worked on a small UI refactor in which I changed a description field to display only one line with an ellipsis instead of showing the full text. The purpose was to align that screen with the design of a similar screen that already used the same behavior. Although it was a small change, it left an impression on me because it showed that even a tiny UI difference can affect the overall consistency of the product. It reminded me that UI work in a product team is not only about making one screen look right, but also about thinking about how the app feels as a whole.

## Conclusion

More than anything, this internship changed the way I think about software development. Before joining MIXI, I focused mainly on implementation, but through this experience I learned that contributing in a real team also means communicating clearly, asking good questions, sharing your thinking, and moving work forward proactively. I also learned that I do not need to understand everything at once in order to contribute. What matters more is being able to prioritize, find the right information, and improve through feedback. Looking back, the most valuable part of the internship was learning how to become a more proactive and collaborative teammate in a real development team.
