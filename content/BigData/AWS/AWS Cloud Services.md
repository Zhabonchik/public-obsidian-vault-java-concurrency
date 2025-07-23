[[Cloud Computing]]
## AWS Overview
- over 175+ services
- **Pay-as-you-go** pricing    
- **No upfront costs**
- **Ideal for experimentation**
- **Access to cutting-edge tools and scalability**
##### **Region**
- A physical location worldwide with multiple data centers.
##### **Availability Zone (AZ)**
- Logical group of one or more data centers within a region.
- Physically isolated (up to 100 km apart).
- Designed for **high availability and fault tolerance**.
##### **Edge Location**
- are physical sites dispersed across the globe
- Part of Amazon’s CDN (content delivery network).
- Distributes services/data closer to users to reduce latency.
##### **Planning for Failure (Resiliency)**
- **Storage**:
	* S3 service is designed for failure.
	* Each file is copied to every [[AWS Cloud Services#**Availability Zone (AZ)**|AZ]] in the region. Thus you always have three copies of your file.
	
- **Compute**: 
	- The owner is responsible to manually distribute resources across multiple [[AWS Cloud Services#**Availability Zone (AZ)**|AZ]]s.
	- If one fails the others still operate.
	
- **Databases**: 
	- The owner can configure DB deployment in multiple [[AWS Cloud Services#**Availability Zone (AZ)**|AZ]]s to keep redundancy.

##### **Benefits of AWS Global Infrastructure**
- High performance
- Low latency
- High availability
- Scalability
- Unlimited capacity (horizontally scalable)
- Built-in security and monitoring
- Confidential
- Reliable
- Low Cost
##### Shared Responsibility of Security
![[Screenshot 2025-07-23 at 14.20.31.png]]

## AWS Core Services
##### Networking
* [[Amazon VPC]]
##### Security & Identity
- [[Amazon IAM]]
##### Compute
- [[Amazon EC2]]
- [[Amazon Lambda]]
##### Storage
- **Instance Store:** 
	- Specified by instance type. Data is stored on the same server as the [[Amazon EC2|EC2]] instance. It is removed when the instance is terminated.
- [[Amazon EBS]]
- [[Amazon S3]]
##### Databases
- Relational
	- [[Amazon RDS]]
	- Amazon Redshift
	- Amazon Aurora
	
- Non-Relational
	- [[Amazon DynamoDB]]
	- Amazon ElastiCache
	- Amazon Neptune
	
- Alternatively:
	- you can install a DB of your choice in an [[Amazon EC2|EC2]] instance and not use one provided by AWS. In that case, you take all responsibility of the security and management of your DB.

## AWS Pricing Models
##### Principles:
- **Pay-as-you-go** (only pay for usage)
- **Reserved pricing** (discounted with commitment)
- **Volume discount** (pay less when you use more)
##### Free Tier Options:
- **Always free** (e.g., 1M free Lambda calls)
- **12-months free** (introductory offer)
- **Trial services**

### **Billing Examples:**
- [[Amazon EC2|EC2]]: Pay for runtime only.

- [[Amazon S3|S3]]: Pay for
    - Storage volume
    - Requests (PUT/GET)
    - Data transfer

- [[Amazon Lambda|Lambda]]: Pay for
    - Number of requests
    - Execution time

