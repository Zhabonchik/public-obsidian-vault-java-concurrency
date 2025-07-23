### Systems based on [[MapReduce]]
> Early generation frameworks for big data processing.
* [[Apache Hive]]

### Systems that replace MapReduce
> newer, faster frameworks with different architectures and performance improvements.

**Motivation**: [[MapReduce]] and [[Apache Hive|Hive]] are too slow!
- [[Google Dremel]]
- [[Apache Spark]]
	- Replaces MapReduce with its own engine that works much faster without compromising consistency
	- Architecture not based on Map-reduce but rather on two concepts:
		- RDD (Resilient Distributed Dataset)
		- DAG (Directed Acyclic Graph)
	- Pro’s:
		- Works much faster than MapReduce;
		- fast growing community.
