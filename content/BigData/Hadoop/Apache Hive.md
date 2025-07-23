---
aliases:
  - Hive
---
> [[Hadoop Eccosystem|Systems based on MapReduce]]

### Apache Hive
##### **Key Features**
- Developed by **Apache**.
- General SQL-like syntax for querying [[HDFS]] or other large databases
- Translates SQL queries into one or more [[MapReduce]] jobs.
- Maps data in [[HDFS]] into virtual [[RDBMS]]-like tables.
- **Pro**:
	- Convenient for **data analytics** uses SQL.
* **Con**:
	* Quite slow in response time

##### **Hive Data Model**
**Structure**
- **Physical**: Data stored in [[HDFS]] blocks across nodes.
- **Virtual Table**: Defined with schema using metadata.
- **Partitions**: Logical splits of data to speed up queries.

**Metadata**
- Hive stores metadatain DB
- Map physical files to tables. 
- Map fields (columns) to line structures in raw data.

![[Screenshot 2025-07-23 at 18.25.32.png]]

**Hive Architecture**
![[Screenshot 2025-07-23 at 18.27.30.png|]]

##### Hive Usage
{% raw %}
```
#Start a hive shell:
$hive

#create hive table:
hive> CREATE TABLE mta (id BIGINT, name STRING, startdate TIMESTAMP, email STRING)

#Show all tables:
hive> SHOW TABLES;

#Add a new column to the table:
hive> ALTER TABLE mta ADD COLUMNS (description STRING);

#Load HDFS data file into the table:
hive> LOAD DATA INPATH '/home/hadoop/mta_users' OVERWRITE INTO TABLE mta;

#Query employees that work more than a year:
hive> SELECT name FROM mta WHERE (unix_timestamp() - startdate > 365 * 24 * 60 * 60);

#Execute command without shell
$hive -e 'SELECT name FROM mta;'

#Execute script from file
$hive -f hive_script.txt
```
{% endraw %}