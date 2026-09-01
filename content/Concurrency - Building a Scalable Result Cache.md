```java
public class Memoizer<A, V> implements Computable<A, V> {
    private final ConcurrentMap<A, Future<V>> cache = new ConcurrentHashMap<>();
    private final Computable<A, V> c;

    public Memoizer(Computable<A, V> c) {
        this.c = c;
    }

    @Override
    public V compute(final A arg) throws InterruptedException {
        while (true) {
            Future<V> f = cache.get(arg);
            if (f == null) {
                Callable<V> eval = new Callable<V>() {
                    @Override
                    public V call() throws InterruptedException {
                        return c.compute(arg);
                    }
                };
                FutureTask<V> ft = new FutureTask<>(eval);
                f = cache.putIfAbsent(arg, ft);
                if (f == null) {
                    f = ft;
                    ft.run();
                }
            }
            try {
                return f.get();
            } catch (CancellationException e) {
                cache.remove(arg, f);
            } catch (ExecutionException e) {
                throw launderThrowable(e.getCause());
            }
        }
    }
}
```

The `Memoizer` is a thread-safe, scalable cache wrapper that turns an expensive function (`Computable<A, V>`) into a cached calculation. It prevents duplicate computation of identical inputs across concurrent threads.

**Key Execution Steps**:
- **Caching Futures Instead of Values:** The map stores `Future<V>` instead of finished results (`V`). This allows a thread to register its _intent_ to calculate a key immediately, forcing subsequent threads requesting the same key to wait on the running computation rather than starting a duplicate execution.
- **Atomic Task Registration (`putIfAbsent`):** Checks if a computation is already in progress. If `putIfAbsent` returns `null`, the calling thread succeeded in registering its `FutureTask` and executes `ft.run()`. If it returns an existing `Future`, the calling thread skips computation and reuses the existing `Future`.
- **Blocking Retrieval (`f.get()`):** Every thread requesting key `arg` calls `f.get()`. If computation is ongoing, the thread blocks until completion.
- **Eviction & Recovery (`while (true)` + Catch Block):** If `f.get()` fails due to a `CancellationException`, the bad `Future` is removed atomically via `cache.remove(arg, f)`. The `while(true)` loop automatically restarts execution to attempt a fresh calculation.
- **Exception Unwrapping:** Catches `ExecutionException` and delegates to a utility (`launderThrowable`) to rethrow the actual underlying unchecked exception, `Error`, or checked exception cause.