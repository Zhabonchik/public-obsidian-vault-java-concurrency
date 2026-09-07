There are 3 ways to reduce lock contention:
1. Reduce the duration for which locks are acquired
2. Reduce the frequency with which the locks are requested
3. Replace exclusive locks with coordination mechanisms that permit greater concurrency

- **Narrowing Lock Scope:**
    
    - Move operations that do not require synchronization (such as I/O, heavy computations, or independent variable allocations) out of synchronized blocks.
        
    - Shortening lock hold times directly shrinks the serial fraction ($F$) under Amdahl's Law, enabling better scaling across higher CPU core counts.
        
- **Lock Granularity:**
    
    - _Lock Splitting:_ Replacing a single lock that guards multiple independent state variables with separate locks for each variable.
        
    - _Lock Striping:_ Splitting a single large data structure into discrete partitions or stripes, each guarded by its own independent lock (e.g., `ConcurrentHashMap`).
        
- **Alternative Concurrency Strategies:**
    
    - _Read-Write Locks (`ReadWriteLock`):_ Allow multiple reader threads to access shared data concurrently without blocking each other, enforcing exclusive mutual exclusion only when a thread modifies data. (WriteLock waits for all threads to finish reading and then blocks resource for writing)
        
    - _Atomic Variables & Lock-Free Structures:_ Use optimistic hardware-level instructions (CAS / Compare-And-Swap) to update variables, avoiding lock contention and OS-level thread blocking entirely.