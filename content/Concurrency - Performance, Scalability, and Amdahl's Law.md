### Performance and scalability
- **Performance vs. Scalability:**
    
    - _Performance (Latency):_ Focuses on executing a single task faster or minimizing turnaround time ("How fast?").
        
    - _Scalability (Throughput):_ Focuses on increasing overall system capacity when more computing resources are added ("How much work?").
        
- **Multithreading Overhead:**
    
    - Parallelizing code introduces non-negligible overhead: thread creation, JVM stack management, OS context switching, lock synchronization, and cache invalidation across hardware cores.
        
    - These costs can make an individual task run slower (higher latency), even while the overall system handles higher total volume (higher throughput).
        
- **Engineering Trade-offs:**
    
    - Performance tuning is rarely free; it requires sacrificing one quality to improve another.
        
    - Common trade-offs include memory vs. CPU (e.g., caching), code simplicity/safety vs. raw speed, and single-thread latency vs. multi-thread throughput.
        
- **Empirical Measurement:**
    
    - Premature or intuition-based optimization often introduces bugs and complexity without actual speedups.
        
    - Always set clear performance targets, profile realistic workloads, and measure before and after every modification to verify real-world gains.

### Amdahl's law
- **Core Definition:**
    
    - Quantifies the theoretical maximum speedup of a task as a function of the parallelizable workload fraction vs. the non-parallelizable (serial) fraction ($F$) across $N$ processors.
        
    - Formula: $\text{Speedup} \le \frac{1}{F + \frac{1 - F}{N}}$
        
- **The Serial Ceiling:**
    
    - As the number of processors $N$ approaches infinity, maximum speedup approaches $1 / F$.
        
    - If just $10\%$ of an application is strictly sequential ($F = 0.10$), the maximum theoretical speedup is capped at $10\times$, regardless of hardware additions.
        
- **Sources of Seriality in Java:**
    
    - Shared locks (`synchronized` blocks or `ReentrantLock`) that enforce mutual exclusion.
        
    - Task queues (e.g., `BlockingQueue`) where threads contend to retrieve work.
        
    - Shared resources like database connection pools, log files, or common I/O streams.
        
    - Aggregating/combining intermediate results calculated across parallel worker threads.
### Costs introduced by threads
- **Context Switching Costs:**
    
    - Direct OS overhead occurs when saving/restoring thread registers and execution states.
        
    - Indirect hardware overhead occurs as CPU local caches are invalidated, forcing threads to stall while fetching fresh data from RAM.
        
    - Excessive active threads relative to CPU cores cause thread thrashing, harming throughput.
        
- **Memory Barriers & Memory Bus Traffic:**
    
    - Synchronized blocks and `volatile` memory operations inject memory barriers (fence instructions) at the hardware level.
        
    - These barriers force CPU write buffers to flush to main memory and disable instruction reordering optimizations, introducing microsecond-level delays.
        
- **Lock Contention:**
    
    - _Uncontended Locks:_ Optimized heavily by the JVM using fast atomic CPU instructions (like Compare-And-Swap), incurring negligible cost.
        
    - _Contended Locks:_ Force losing threads to block and wait in a queue, triggering full OS context switches and suspending execution.