---
aliases:
  - VPC
---

> Part of [[AWS Cloud Services#AWS Core Services|AWS Core Services]]
##### **Amazon VPC (Virtual Private Cloud)**
An logically **isolated network** within AWS for your resources.
- Create a ***public-facing*** subnet for your web servers which have access to the internet.
- Create a ***private-facing*** subnet with no internet access for your backend system
	- e.g., databases, application servers
- Enables fine-grained control over traffic with both a public and  a private subnet. 