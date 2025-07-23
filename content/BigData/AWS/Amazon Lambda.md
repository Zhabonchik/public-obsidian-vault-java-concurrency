---
aliases:
  - Lambda
---
> Part of [[AWS Cloud Services#AWS Core Services|AWS Core Services]]
##### **AWS Lambda (a serverless compute service)**
- Run backend code without provisioning servers.
- Event-driven: triggered by events (e.g., file upload).
- Languages: Python, Node.js, Java, C#, Go, Ruby.
- Automatically scales with demand.

**Work flow**
![[Screenshot 2025-07-23 at 17.51.04.png|600]]

**Example Use Case:**
- You can configure Lambda function to perform an action when an event occurs. For example, when an image is stored in Bucket-A, an event invokes the Lambda function to process the image to a new format and store it in Bucket-B
  ![[Screenshot 2025-07-23 at 17.52.39.png|400]]

