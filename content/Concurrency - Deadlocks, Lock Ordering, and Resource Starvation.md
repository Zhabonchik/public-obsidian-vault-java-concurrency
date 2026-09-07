- **1. Basic Lock-Ordering Deadlocks**
    
    - _Definition:_ Occurs when two or more threads hold locks while waiting for locks held by each other (Thread A holds Lock A, wants Lock B; Thread B holds Lock B, wants Lock A).
        
    - _Fundamental Rule:_ Lock-ordering deadlocks are impossible if every thread across the entire application acquires locks in the exact same global order.
        
- **2. Dynamic Lock-Ordering Deadlocks**
    
    - _Cause:_ Arises when lock order depends on runtime parameters (e.g., `transferMoney(from, to)`). Thread 1 executing `(A, B)` locks `A` then `B`; Thread 2 executing `(B, A)` locks `B` then `A`.
        
    - _Why Internal Sync Fails:_ Synchronizing on arguments sequentially inside the method fails because argument order changes dynamically per invocation.
        
- **3. Inducing Lock Order (Tie-Breaking)**
    
    - _Hash Code Ordering:_ Enforce a global lock hierarchy using an immutable property like `System.identityHashCode(object)`. Always lock the lower hash value first.
        
    - _Tie-Breaker Lock:_ Use a shared fallback lock to serialize lock acquisition whenever two distinct objects produce identical hash codes.
        
- **4. Deadlocks Between Cooperating Objects**
    
    - _Alien Methods:_ Any method in another class, overridable method, or callback whose internal locking behavior is unknown.
        
    - _Hidden Dependencies:_ Calling alien methods inside a synchronized block implicitly chains locks (`Lock A` $\rightarrow$ `Lock B`). If another class invokes `Lock B` $\rightarrow$ `Lock A`, a dynamic deadlock occurs despite both classes appearing safe individually.
        
- **5. Open Calls as a Defense**
    
    - _Pattern:_ Execute alien method calls entirely outside synchronized blocks. Copy required state locally, exit the synchronized block, and then execute the external call.
        
    - _Benefits:_ Prevents multi-lock acquisition chains (eliminating deadlock risk) and reduces lock duration (maximizing scalability).

**Livelock, Starvation & Timed Locks**

Threads can fail to make progress even without being trapped in a traditional blocked state.

- **Starvation:** Caused when threads are perpetually denied CPU time or lock access. Avoid using `Thread.setPriority()` as a fix—OS thread scheduler mappings are platform-dependent and unreliable.
    
- **Livelock:** Occurs when active (`RUNNABLE`) threads constantly react to one another in an infinite retry loop without doing real work. Introduce **randomized backoff delays** to break lockstep execution.
    
- **Timed Locks:** Replace intrinsic `synchronized` blocks with `ReentrantLock.tryLock(timeout)`. If a thread fails to acquire the lock before timing out, it can safely release any held locks, back off, and recover gracefully.
    

**Diagnostics & Lock Responsiveness**

- **Thread Dumps:** Generating a dump (`jstack` or `kill -3`) exposes stack traces, thread states, and held monitors for every thread. The JVM automatically parses intrinsic lock dependencies and highlights active deadlocks.
    
- **Lock Duration:** Never execute blocking I/O or heavy computations inside synchronized blocks. Long lock holds queue up dependent threads, causing severe latency spikes and thread pool exhaustion.