
Operation is considered to be **atomic** if it is single and not divisible. Incrementing integer value (count++) is not atomic since it requires 3 atomic operations: read-update-write.

Race condition vs Data race:
- **Race Condition:** A flaw in execution logic where correctness depends on the relative timing or interleaving of threads by the runtime (e.g., two threads getting different instances from `getInstance()`).
- **Data Race:** Occurs when a thread reads a non-final field while another thread is writing to it without synchronization. You can have a race condition without a data race, and vice versa.
```java
public class Singleton {
	
	private static Singleton INSTANCE = null;
	
	public static Singleton getInstance() {
		
		if (INSTANCE == null) {
			INSTANCE = new Singleton();
		}
		
		return INSTANCE;
	}
}
```
In the example above if threads A and B try to get instance of the class at the same time, they might return different objects (at first A will create one and return, then B will do the same).

Read-modify-write and check-then-act operations are compound, not atomic, that is why they are prone to race conditions. 

Adding state variables:
- **Single State Variable:** If a class goes from stateless to holding **a single thread-safe variable** (like `AtomicLong`), it remains completely thread-safe.
- **Multiple State Variables:** If you add **multiple** state variables, using atomic objects for each is **not** sufficient if those variables are dependent on one another. Updating two independent `AtomicLong` fields sequentially leaves a gap between updates where the combined state is inconsistent.
```java
public class Servlet {

	private final AtomicLong counter = new AtomicLong(0);

	public long getCount() { return counter.get(); }

	public void serve() {
		...
		counter.incrementAndGet();
		...
	}

}
```