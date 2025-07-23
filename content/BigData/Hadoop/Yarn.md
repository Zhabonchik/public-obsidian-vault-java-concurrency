**YARN (Yet Another Resource Negotiator)** 
is [[Hadoop]]’s cluster resource management system
- Multiple jobs running simultaneously
- Multiple jobs use same resources (disk, CPU, memory)
- Assign resources to jobs and tasks exclusively

##### YARN is in charge of:
1. Allocates Resources
2. Schedules Jobs
	- allocate priorities to jobs by policies:
		FIFO scheduler, Fair scheduler, Capacity scheduler

##### Components:
- **ResourceManager**
	- oversees resource allocation across the cluster
	
- **NodeManager**
	- Each node in the cluster runs a NodeManager.
	- This component manages the execution of containers on its node.
	
- **ApplicationMaster**
	- manages the lifecycle of applications.
	- handles job scheduling and monitors progress.
	
- **Resource Container**
	- a logical bundle of resources (e.g., CPU, Memory) that is allocated by the ResourceManager

![[Screenshot 2025-07-23 at 13.29.37.png]]

##### YARN ecosystem
Yarn can run other applications beside Hadoop [[MapReduce]], that can
integrate to the Hadoop ecosystem:
• Apache Storm (Data Streaming engine)
• [[Apache Spark]] (Data Batch and streaming engine)
• Apache Solr (Search platform)