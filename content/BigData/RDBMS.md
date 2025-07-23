[[Database Overview]]
##### What is an RDBMS?
**Relational Database Management System**:
- Data is stored in **tables**:
    - **Rows** = records
    - **Columns** = fields
    
- Each table has:
    - **Indexes** for fast searching
    - **Relationships** with other tables (via keys)

##### Relational model - Keys and Indexes
Ability to find record(s) quickly
- Operations become efficient:
    - **Find by key** → O(log n)
    - **Fetch record by ID** → O(1)
  
Indexes = sorted references to data locations → like a book index.

##### Relational model - Operations
Relational databases support **CRUD**:
- **C**reate
- **R**ead
- **U**pdate
- **D**elete

Each operation uses both:
- The **index** (to locate data)
- The **data** itself (to read/write)

##### Relational model - Transactional
Relational databases guarantee **transaction safety** with ACID:
- **A**tomicity – all or nothing
- **C**onsistency – valid data only
- **I**solation – no interference from other transactions
- **D**urability – survives crashes

* Examples:
	- Transferring money, Posting a tweet
	- Both must either **succeed completely** or **fail completely**.

Transactions guarantee data validity despite errors & failures

##### Relational model - SQL
**SQL** is the language used to talk to relational databases.
- **S**tandard
- **Q**uery
- **L**anguage

- All RDBMSs use it (MySQL, PostgreSQL, Oracle, etc.)

#####  Pros and Cons of RDBMS
**Pros:**
- Structured data
- ACID transactions
- Powerful SQL
- Fast (for small/medium size)

**Cons**:
- Doesn’t scale well (single machine or SPOF = Single Point of Failure)
- Becomes **slow** with **big data**
- **Less fault tolerant**
- Not designed for **massive, distributed systems**
