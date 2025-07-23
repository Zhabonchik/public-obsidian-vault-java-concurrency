## RDD (Resilient Distributed Dataset)
>RDD is an immutable (read only) distributed collection of objects.
>
>Dataset in RDD is divided into logical partitions, which may be computed on different nodes of the cluster

![[Screenshot 2025-07-23 at 19.08.40.png|600]]
##### **Key Properties:**
- Distributed: Automatically split across cluster nodes.
- Lazy Evaluation: Transformations aren’t executed until an action is called.
- Fault-tolerant: Can **recompute lost partitions** using lineage graph.
- Parallel: Operates concurrently across cluster cores.
##### Data Sharing 
> In [[Hadoop]] [[MapReduce]]
![[Screenshot 2025-07-23 at 19.11.44.png|500]]

> In [[Apache Spark|Spark]]
![[Screenshot 2025-07-23 at 19.12.57.png|500]]
>10-100x faster than network and disk!


