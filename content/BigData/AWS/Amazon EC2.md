---
aliases:
  - EC2
---
> Part of [[AWS Cloud Services#AWS Core Services|AWS Core Services]]
##### **Amazon EC2 (Elastic Compute Cloud)**
A web service that provides secure, resizable compute capacity in
the cloud. 
* Designed to make web-scale cloud computing easier for developers.
- Secure, resizable compute capacity (virtual servers).
- Complete control over OS and apps.
	
**Pricing Models**:
- **On-Demand**: Pay for what you use.
- **Spot Instances**: Cheap, temporary, short-life instance, save up to 90%.
- **Reserved**: Lower price for long-term usage.
    
**Features:**
- **Amazon Machin Image (AMI):** 
	- Preconfigured OS image
	- e.g., Linux, maxOS, Windows
- **Instance type**: 
	- Defines CPU, memory, storage, networking capacity
- **Networking**: 
	- [[Amazon VPC|VPC]] and subnets
- **Storage**
- **Security Group(s)**: 
	- Like a firewall, Define access to and from EC2 instance
- **Key pair**: 
	- establish a remote connection (Secure SSH access)

- **Instance Type**:
	-  defines CPU, memory, storage, and network performance.
	  ![[Screenshot 2025-07-23 at 16.52.08.png]]
- **Instance Families** 

| Family Type                       | Use Case<br>              |
| --------------------------------- | ------------------------- |
| General Purpose (M / T / A)       | Web servers               |
| Compute Optimized (C)             | Analytics, gaming         |
| Memory Optimized (R / X)          | High-performance DB       |
| Accelerated Computing (P / G / F) | AI, ML, GPU compute       |
| Storage Optimized (I)             | Big data, NoSQL databases |
