##### HDFS ([[Hadoop]] Distributed File System)
Stores huge files (Typical file size GB-TB) across multiple machines.
- Breaks files into **blocks** (typically 128 MB).
- **Replicates** blocks (default 3 copies) for fault tolerance.
- Access using POSIX API.

##### HDFS design principles
* **Immutable**: **write-once, read-many**
* **No Failures**: Disk or node failure does not affect file system
* **File Size Unlimited**: Up to 512 yottabytes (2^63 X 64MB)
* **File Num Limited**: 1048576 files in a directory
* **Prefer bigger files**: Big files provide better performance

##### HDFS File Formats
- Text/CSV - No schema, no metadata
- Json Records - metadata is stored with data
- Avro Files - schema independent of data
- Sequence Files - binary files (used as intermediate storage in M/R)
- RC Files - Record Columnar files
- ORC Files - Optimized RC files. Compress better
- Parquet Files - Yet another RC file

##### HDFS Command Line
```
# List files
hadoop fs -ls /path

# Make directory
hadoop fs -mkdir /user/hadoop

# Print file
hadoop fs -cat /file

# Upload file
hadoop fs -copyFromLocal file.txt hdfs://...
```

#### HDFS Architecture – Main Components
##### **1.** NameNode (Master Node)
- **Stores metadata** about the filesystem:
    - Filenames
    - Directory structure
    - Block locations
    - Permissions
    
- It **does not store the actual data**. 
- There is **one active NameNode** per cluster.

##### **2.** DataNodes (Worker Nodes)
- Store the **actual data blocks** of files.
- Send **heartbeat** messages to the NameNode to report that they are alive.
- When a file is written, it’s split into blocks and distributed across many DataNodes.
- DataNodes also **replicate** blocks (typically 3 copies) to provide **fault tolerance**.

#### File Read / Write
**When a file is written:**
1. The client contacts the **NameNode** to ask: “Where should I write the blocks?”
2. The NameNode responds with a list of **DataNodes** to use.
3. The client sends the blocks of the file to those DataNodes.
4. Blocks are **replicated** automatically across different nodes for redundancy.

**When a file is read:**
1. The client contacts the **NameNode** to get the list of DataNodes storing the required blocks.
2. The client reads the blocks **directly** from the DataNodes.