---
aliases:
  - IAM
---
> Part of [[AWS Cloud Services#AWS Core Services|AWS Core Services]]
##### **Amazon IAM (Identity and Access Management)**
- Manages user access to services.
- Attach permission policies to identities to manage the kind of actions the identity can perform.
	- Identities in Amazon IAM are ***users***, ***groups*** and ***roles***.
- Based on ***least privilege*** principle. 
	* user or entity should only have access to the specific data, resources and applications when you explicitly granted them access.
* example usage:
	* Grant cross-account permissions to upload objects while ensuring that the bucket owner has full control.