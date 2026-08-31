**Publication** means making an object available outside its current scope (e.g., returning it from a non-private method, storing it in a public field, or passing it to an alien method).
**Escape** occurs when an object is published unintentionally or improperly, exposing internal state.
**Alien Methods** are methods whose implementation is outside the class's control (e.g., overridable methods, listeners, or external library methods). Passing an object reference to an alien method must be treated as publishing it.

**The `this` Escape Hazard & Safe Construction**
- **`this` Escape:** Publishing an object reference before its constructor finishes (e.g., registering an inner class listener or starting a thread _inside_ a constructor). This allows other threads to observe a partially constructed, inconsistent object.
- **Safe Construction Pattern:** Never allow the `this` reference to escape during construction. Use a `private` constructor combined with a `public static` factory method to ensure object initialization completes fully before starting threads or registering listeners.

```java
public class SafeListener {

	private final EventListener listener;

	private SafeListener() {
		listener = new EventListener() {
			public void onEvent(Event e) {
				doSomething(e);
			}
		}
	}
	
	public static SafeListener newInstance(EventSource source) {
		SafeListener safe = new SafeListener();
		source.registerListener(safe.listener);
		return safe;
	}

}
```

_Stack confinement_ is a special case of thread confinement in which an object can only be reached through local variables. Using a non-thread-safe object in a within-thread object is still thread-safe since thread-local objects are stored in a stack within that thread. Just make sure those objects do not escape.
Another alternative of thread confinement is a _ThreadLocal_ object. It stores the copy of a value for each thread that uses it.

Immutable objects can't be modified, so they can also be considered thread-safe. (final fields don't guarantee immutability if they reference mutable objects)
Whenever a group of related data items must be acted on atomically, consider creating an immutable holder class for them. And then an object of this class can be stored in a volatile variable.

### Safe publication
**Immutability Requirements.** An object is immutable if its state cannot be modified after creation, all fields are `final`, and `this` did not escape during construction. Immutable objects can be safely accessed by any thread without synchronization, regardless of how they are published.

**Safe Publication Idioms.** To safely publish a reference to a mutable or effectively immutable object, you must use one of the following mechanisms:
- Initializing an object reference from a **static initializer** (guaranteed by JVM class loading).
- Storing the reference in a **`volatile` field** or `AtomicReference`.
- Storing the reference in a **`final` field** of a properly constructed object.
- Storing the reference in a field **guarded by a lock** (including thread-safe collections like `ConcurrentHashMap` or synchronized wrappers).

**Sharing Policies**
- **Effectively Immutable Objects:** Technically mutable objects whose state will not be modified after publication. They only require safe publication; no further synchronization is required for thread-safe reads.
- **Mutable Objects:** Must be safely published **and** either be internally thread-safe or guarded by a lock for every subsequent access.
