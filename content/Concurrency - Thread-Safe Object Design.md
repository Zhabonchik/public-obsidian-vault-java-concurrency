The design process for a thread‐safe class should include these three basic elements:
• Identify the variables that form the object's state;
• Identify the invariants that constrain the state variables;
• Establish a policy for managing concurrent access to the object's state.

You cannot ensure thread safety without understanding an object's invariants and post‐conditions. Constraints on the valid values or state transitions for state variables can create atomicity and encapsulation requirements.

Encapsulating data within an object confines access to the data to the object's methods, making it easier to ensure that the data is always accessed with the appropriate lock held.

In the code below the object's state is stored in a HashSet, which is not thread-safe itself, but it is encapsulated and it can be interacted only through the methods that acquire lock.
```java
@ThreadSafe
public class PersonSet {

	@GuardedBy("this")
	private final Set<Person> mySet = new HashSet<Person>();

	public synchronized void addPerson(Person p) {
		mySet.add(p);
	}

	public synchronized boolean containsPerson(Person p) {
		return mySet.contains(p);
	}

}
```

Java private monitor pattern uses private lock object so that client could not acquire lock on it, below is the example of the pattern:
```java
public class PrivateLock {

	private final Object myLock = new Object();
	
	@GuardedBy("myLock") Widget widget;
	
	void someMethod() {
		synchronized(myLock) {
		// Access or modify the state of widget
		}
	}

}
```

Another approach is to delegate thread-safety to a thread-safe state variable (ConcurrentHashMap...). If a class is composed of multiple independent thread‐safe state variables and has no operations that have any invalid state transitions, then it can delegate thread safety to the underlying state variables.

If a state variable is thread‐safe, does not participate in any invariants that constrain its value, and has no prohibited state transitions for any of its operations, then it can safely be published.

The recommended way to add synchronization to existing classes is to add it through composition (client should modify the underlying list only through our class, not hold a reference to it).
```java
@ThreadSafe

public class ImprovedList<T> implements List<T> {

	private final List<T> list;
	
	public ImprovedList(List<T> list) { this.list = list; }
	
	public synchronized boolean putIfAbsent(T x) {
		boolean contains = list.contains(x);
		if (!contains)
			list.add(x);
		return !contains;
	}
	
	public synchronized void clear() { list.clear(); }
	// ... similarly delegate other List methods

}
```


Excercise:
```java
package org.example.Chapters2To4;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ThreadSafe
public class BoundedEventTracker {

    private final int maxCapacity;

    @GuardedBy("this")
    private int totalProcessedCount = 0;

    @GuardedBy("this")
    private final Map<String, EventDetails> events;

    private BoundedEventTracker(int maxCapacity) {
        this.maxCapacity = maxCapacity;
        this.events = new HashMap<>(maxCapacity);
    }

    public static BoundedEventTracker create(int maxCapacity) {
        return new BoundedEventTracker(maxCapacity);
    }

    public synchronized boolean registerEvent(String eventId, String payload) {
        boolean exists = events.containsKey(eventId);
        
        // Reject only if it's a NEW key and capacity is reached
        if (!exists && events.size() >= maxCapacity) {
            return false;
        }

        events.put(eventId, new EventDetails(eventId, payload, Instant.now()));

        if (!exists) {
            totalProcessedCount++;
        }
        return true;
    }

    public synchronized EventDetails getEvent(String eventId) {
        return events.get(eventId);
    }

    public synchronized List<EventDetails> getActiveEvents() {
        return List.copyOf(events.values());
    }

    public synchronized TrackerStats getStats() {
        return new TrackerStats(events.size(), maxCapacity, totalProcessedCount);
    }
}

@Immutable
public record EventDetails(
        String eventId,
        String payload,
        Instant timestamp
) {}

@Immutable
public record TrackerStats(
        int currentSize,
        int maxCapacity,
        int totalProcessedCount
) {}
```