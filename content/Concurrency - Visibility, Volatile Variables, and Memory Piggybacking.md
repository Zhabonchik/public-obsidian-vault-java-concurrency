Always apply appropriate synchronization whenever a **mutable** data is shared among threads.
If there is a sequence of operations they can be reordered by a compiler for better optimization. This needs to be taken into account when another thread may try to get the results of those operations.

Stale data can cause bugs, infinite loops and invalid state of a program, that is why if there are read-write operations they should be synchronized. Synchronization of reading-writing the same variable by several threads must be performed with acquiring lock on the same object (for example, class itself).

Also it's necessary to remember that operations on non-volatile 64-bit variables are not atomic. They are updated in 2 32-bit parts and thus when 1 thread updates and the other reads the same ``long`` variable the first 32 bits may be new, while the last 32 bits can still be stale for the reading thread.

For a synchronized block it's guaranteed that if a thread A and a thread B enter the same synchronized block (on the same object M) sequentially, then all the changes visible to A before it's unlock on M are visible to thread B after the lock on M (Figure 3.1). (**Happens-before consistency**)

![[Visibility guarantees for synchronization.png|581]]

An alternative to synchronized blocks are ``volatile variables``. They guarantee that changes to the variable are visible to all threads. Volatile variables are preferred for simple status or completion flags. The ``volatile`` variable can be use only when the following 3 rules are satisfied:
- Any update of a variable is not related to it's previous state or you can guarantee that only one thread always updates its value;
- This variable does not participate in invariants with other state variables; and
- Locking is not required for any other reason while the variable is being accessed.

Visibility vs Atomicity:
- **Synchronization/Locking:** Guarantees both **atomicity** (mutual exclusion) and **visibility**.
- **Volatile variables:** Guarantee **visibility** (and instruction reordering bounds) only, **not** atomicity.