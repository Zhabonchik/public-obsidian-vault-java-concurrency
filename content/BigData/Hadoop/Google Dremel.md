> [[Hadoop Eccosystem|Systems based on MapReduce]]

**Key Ideas**
• Leverages columnar file format
• Optimized for SQL performance

**Concepts**
- Tree-based **query execution**. 
- Efficient scanning and aggregation of **nested columnar data**.
### Columnare data format
> Illustration of what columnar storage is all about:
> given a 3 columns:
![[Screenshot 2025-07-23 at 18.42.46.png|170]]
> In a row-oriented storage, the data is laid out one row at a time as follows:
![[Screenshot 2025-07-23 at 18.45.25.png|500]]
> Whereas in a column-oriented storage, it is laid out one column at a time:
![[Screenshot 2025-07-23 at 18.46.55.png|500]]

**Nested data in columnar format**
![[Screenshot 2025-07-23 at 18.50.10.png]]![[Screenshot 2025-07-23 at 18.50.16.png]]

### Frameworks inspired by Google Dremel
• Apache Dril (MapR)
• Apache Impala (Cloudera)
• Apache Tez (Hortonworks)
• Presto (Facebook)

