This is a temporary generated summary, must be replaced by a new one in future.

**Cooperative Task Cancellation & Interruption**
- **Forced Termination Danger:** Deprecated methods like `Thread.stop()` release all locked monitors instantly, leaving shared data in an inconsistent state.
- **Interruption Protocol:** Calling `thread.interrupt()` sets the thread's interrupt status bit. Blocking methods (like `Thread.sleep()` or `BlockingQueue.take()`) respond to this flag by clearing it and throwing `InterruptedException`.
- **Handling `InterruptedException`:** You must never swallow an `InterruptedException` silently. Either propagate the exception up the call stack or restore the interrupt flag by calling `Thread.currentThread().interrupt()` so caller code knows cancellation was requested.

**Stopping Thread-Based Services**
- **Lifecycle Ownership:** Threads belong to the service that created them (e.g., an `ExecutorService`). External code should request service shutdown rather than interrupting individual threads directly.
- **Poison Pills:** A simple cancellation pattern for Producer-Consumer designs: producers place a recognizable "poison pill" object into the queue. When consumers read this specific object, they cleanly stop processing.

**Abnormal Termination & JVM Exit**
- **Uncaught Exception Handlers:** Unhandled `RuntimeExceptions` cause threads to die silently without notifying the main application. Attaching a `Thread.UncaughtExceptionHandler` allows you to log crashes, clean up, or replace dead threads.
- **Daemon Threads:** Threads marked as daemon (`thread.setDaemon(true)`) exit abruptly when all non-daemon threads complete. Never perform resource cleanup or disk I/O in daemon threads.
- **Shutdown Hooks:** Registered unstarted threads (`Runtime.addShutdownHook`) that the JVM executes concurrently during a graceful exit to release persistent resources (locks, database connections, temp files).