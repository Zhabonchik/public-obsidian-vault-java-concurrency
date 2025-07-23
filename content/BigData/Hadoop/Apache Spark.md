---
aliases:
  - Spark
---
> [[Hadoop Eccosystem|Systems based on MapReduce]]

## Apache Spark
> Apache Spark is a **fast**, **general-purpose**, **open-source** cluster computing system designed for large-scale data processing.

##### Key Characteristics:
- **Unified analytics engine** – supports batch, streaming, SQL, machine learning, and graph processing.
- **In-memory computation** – stores intermediate results in RAM (vs. Hadoop which writes to disk).
- **Fault tolerant** and scalable.

##### Benefits of Spark Over [[Hadoop]] [[MapReduce]]

| **Feature**         | **Spark**                                                                 | **Hadoop MapReduce**                   |
| ------------------- | ------------------------------------------------------------------------- | -------------------------------------- |
| **Performance**     | Up to **100x faster** (in-memory operations)                              | Disk-based, slower                     |
| **Ease of use**     | High-level APIs in Python, Java, Scala, R                                 | Java-based, verbose programming        |
| **Generality**      | Unified engine for batch, stream, ML, graph                               | Focused on batch processing            |
| **Fault tolerance** | Efficient recovery via lineage                                            | Slower fault recovery via re-execution |
| **Runs Everywhere** | Runs on [[Hadoop]], Apache Mesos, Kubernetes, Standalone or in the cloud. |                                        |

##### How is Spark Fault Tolerant?
> Resilient Distributed Datasets ([[RDD]]s)

- Restricted form of distributed shared memory
- Immutable, partitioned collections of records
- Recompute lost partitions on failure
- No cost if nothing fails

![[Screenshot 2025-07-23 at 19.17.31.png|500]]

- **Lineage Graph**
	- Each [[RDD]] keeps track of how it was derived. If a node fails, Spark **recomputes only the lost partition** from the original transformations.
	
##### Writing Spark Code in Python
{% raw %}
```
# Spark Context Initialization
from pyspark import SparkConf, SparkContext

conf = SparkConf().setAppName("MyApp").setMaster("local")
sc = SparkContext(conf=conf)

# Create RDDs:
# 1. From a Python list
data = [1, 2, 3, 4, 5]
distData = sc.parallelize(data)

# 2. From a file
distFile = sc.textFile("data.txt")
distFile = sc.textFile("folder/*.txt")
```
{% endraw %}

##### **RDD Transformations (Lazy)**
These create a new RDD from an existing one.

| map(func)         | Apply function to each element               |
| ----------------- | -------------------------------------------- |
| filter(func)      | Keep elements where func returns True        |
| flatMap(func)     | Like map, but flattens results               |
| union(otherRDD)   | Union of two RDDs                            |
| distinct()        | Remove duplicates                            |
| reduceByKey(func) | Combine values for each key (key-value RDDs) |
| sortByKey()       | Sort by keys                                 |
| join(otherRDD)    | Join two key-value RDDs                      |
| repartition(n)    | Re-distribute RDD to n partitions            |
Transformations are **lazy** – they only execute when an action is triggered.