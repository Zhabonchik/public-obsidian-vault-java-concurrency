A programming model for processing big data in parallel.
- Distributed processing - Job is run in parallel on several nodes
- Run the process where the data is!
-  Horizontal Scalability

- **Map** step: transform input
	- Transform, Filter, Calculate
	- Local data
	- e.g., count 1 per word
	
- **Combine** step: Reorganization of map output.
	- Shuffle, Sort, Group
	
- **Reduce** step: Aggregate / Sum the groups 
	- e.g., sum word counts
	
MapReduce **runs code where the data is**, saving data transfer time.

![[Screenshot 2025-07-23 at 13.00.20.png]]
##### Example:
From the sentence:
> “how many cookies could a good cook cook if a good cook could cook cookies”

Steps:
1. **Map**:
    - Each word becomes a pair like ("cook", 1)
2. **Shuffle**:
    - Group by word
3. **Reduce**:
    - Add up counts → ("cook", 4)

![[Screenshot 2025-07-23 at 13.01.20.png]]