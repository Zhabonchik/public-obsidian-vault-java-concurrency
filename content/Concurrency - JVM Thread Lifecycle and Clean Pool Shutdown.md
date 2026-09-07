Non-daemon threads dictate JVM lifespan, while thread pools require explicit lifecycle management via `ExecutorService` to prevent application hangs or state corruption.

  

**JVM Thread Lifecycle**

  

- **User (Non-Daemon) Threads:** The JVM continues running as long as at least one non-daemon thread is alive. Worker threads in pools are non-daemon by default.
    
      
    
- **Daemon Threads:** Intended for background maintenance (e.g., garbage collection). When the last non-daemon thread terminates, the JVM halts immediately—killing daemon threads instantly without executing `finally` blocks or unwinding stacks.
    
      
    
- **Shutdown Hooks:** Registered via `Runtime.getRuntime().addShutdownHook()`. These threads run concurrently during JVM teardown (triggered by SIGINT/Ctrl+C or `System.exit()`). They must be thread-safe, fast, and avoid relying on services that might already be shutting down.
    
      
    
- **Uncaught Exceptions:** If an unhandled runtime exception kills a thread, `Thread.UncaughtExceptionHandler` allows you to log the failure, clean up resources, or replace dead pool threads before termination.
    
      
    

**ExecutorService Lifecycle States**

  

- **Running:** Initial state; accepts new tasks and processes the queue.
    
      
    
- **Shutting Down:** Initiated by `shutdown()`. Refuses new submissions (throwing `RejectedExecutionException`), but allows already-submitted and queued tasks to complete.
    
      
    
- **Terminated:** Reached after all tasks complete and all pool threads exit. `isTerminated()` returns `true`.
    
      
    

**Two-Phase Clean Shutdown Pattern**

  

Because pool threads keep the JVM alive, you must cleanly drain or halt them before exiting. JCIP recommends the standard two-phase idiom:

  

```java
void shutdownAndAwaitTermination(ExecutorService pool) {
    pool.shutdown(); // Stop accepting new tasks
    try {
        if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
            pool.shutdownNow(); // Cancel active tasks via Thread.interrupt()
            if (!pool.awaitTermination(30, TimeUnit.SECONDS))
                System.err.println("Pool did not terminate");
        }
    } catch (InterruptedException ie) {
        pool.shutdownNow(); // Re-interrupt current thread if interrupted while waiting
        Thread.currentThread().interrupt();
    }
}
```

_Note:_ `shutdownNow()` returns a `List<Runnable>` of tasks that were queued but never started, allowing you to log or re-queue them during emergency recovery.

  

**Modern Context (Post-JCIP)**

  

Since Java 19, `ExecutorService` implements `AutoCloseable`. Wrapping a pool in a `try-with-resources` block automatically calls `close()`, which executes a variant of `shutdown()` and waits for tasks to finish without needing explicit boilerplate.