Introduction to cloud computing concepts relevant for Big Data.
##### traditional software deployment process:
1. **Coding**
2. **Compiling** – turning source code into executable files.
3. **Installing** – putting the software on computers.

##### Clustered Software
Introduces three related architectures:

1. **Redundant Servers** – multiple servers running the same service for fault-tolerance.
    - E.g., several identical web servers.
    
2. **Micro-services** – the system is broken into **small, independent services** that communicate with each other.
    - Each handles a specific function.
    
3. **Clustered Computing** – a large task is **split into sub-tasks** running on **multiple nodes**.
    - Used in Big Data systems like **NoSQL databases**.

##### Scaling a Software System
Two ways to handle growing demand:
- **Scale Up**: Make one machine stronger
	- When running out of resources we can add: *Memory*, *CPU*, *Disk*, *Network Bandwidth*
	- Can become expensive or reach hardware limits.
	
- **Scale Out**: Add more machines to share the work.
	- Add **redundant servers** or use **cluster computing**.
	- Each server can be **standalone** (like a web server), or part of a **coordinated system** (like a NoSQL cluster).
	- More fault-tolerant and scalable than vertical scaling.

- Tradeoff:
    - **Scale-up** is simpler but has limits.
    - **Scale-out** is more flexible and resilient but more complex.

##### Selling Your Service
- **Install** - Software as installation
	- e.g., Microsoft's office package

- Saas - Software as a Service
	- No need to install, just log in and use.
	- e.g., Google Docs, Zoom, Dropbox.\
	 
- Common SaaS pricing models:
1. **Per-user** – Pay per person.
2. **Tiered** – Fixed price for different feature levels.
3. **Usage-based** – Pay for what you use (e.g., storage, API calls).

##### Deployment Models
Where you run your software:
- **On-Premises**: Your own machines or rented servers (or VM’s).
- **Cloud**: Run on virtual machines (VMs) from a cloud provider (e.g., AWS, Azure, GCP).

##### Cloud Deployment Options
When deploying to the cloud, you have options:
1. **Vanilla Node**: Raw VM – you install everything.
2. **Cloud VM**: VM with pre-installed software.
3. **Managed Service**: Cloud provider handles setup, scaling, updates (e.g., [[Amazon RDS|AWS RDS]], Google BigQuery).

> Next [[Cloud Computing]]