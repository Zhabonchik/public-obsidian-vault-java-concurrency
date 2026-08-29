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