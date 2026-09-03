**Task** is an abstract, discreet unit of work. Tasks should represent independent units of work, agnostic of execution mechanism.
### Executing tasks in threads
The first approach is the sequential one. We can process tasks one by one which is pretty easy but can take a lot of time since subsequent requests won't be processed unless the current one is processed (in case of http requests).

Second approach is creating a new thread per each task. It brings the following features:
- Main thread does not shift from accepting requests to processing them
- All requests are processed in parallel which speeds up the response
- Tasks must be constructed to be processed concurrently

Disadvantages:
- If the amount of created threads is bigger than the amount of processors, other threads will be idle and spend significant CPU time for *context switching*
- Thread creation/teardown overhead
- There is a limited amount of threads that can be created, after that an OutOfMemoryError can be thrown
- There is a point in the amount of threads up to which the processing will be sped up, but after crossing the point the performance will degrade

### Executor framework
The better alternative for creating a thread per task is utilizing the **Executor Framework**.
*Executor* interface provides a single *execute(Runnable r)* method that consumes and executes the task. It has several implementations and you can provide a custom-one for your needs.

Executors allow you to seamlessly change execution policies depending on your needs. An **execution policy** specifies the "what, were, when and how" of task execution, including:
- In what thread will tasks be executed?
- In what order should tasks be executed (FIFO, LIFO, priority order)?
- How many tasks may execute concurrently?
- How many tasks may be queued pending execution?
- If a task has to be rejected because the system is overloaded, which task should be selected as the victim, and how should the application be notified?
- What actions should be taken before or after executing a task?

**ThreadPools** are homogenous pools of worker threads. They can be utilized to manage the worker threads together with Executor interface. Common static factory methods for creation thread pools include: *newFixedThreadPool*, *newCachedThreadPool*, *newSingleThreadExecutor*.
**FixedThreadPool** tries to support the fixed amount of worker threads, creating new ones only as replacements for died threads. It uses an unbounded `LinkedBlockingQueue`. If tasks arrive faster than workers can process them, the queue grows indefinitely until the JVM runs out of memory
**CachedThreadPool** can increase the amount of working threads during a high load and decrease when the load is low.

Since JVM can exit only after all (non-daemon) threads are have been terminated, it is important to shut it down. *ExecutorService* extends the *Executor* interface and adds the corresponding methods. The ExecutorService can be shut down gracefully (not accepting new tasks, but waiting for running to finish) or abruptly. It can be in 3 states: **running**, **shutting down** and **terminated**.
- `shutdownNow()` cancels running tasks via `Thread.interrupt()`, ignores pending tasks in the queue, and **returns a `List<Runnable>`** of those unstarted tasks so you can log or preserve them.
- Shutdown calls are asynchronous; `ExecutorService.awaitTermination()` is necessary if the calling thread must block and wait for worker completion up to a specified timeout.

**Core Tasks & Lifecycle Abstractions**
- **`Callable<V>` vs. `Runnable`:** `Callable` returns a value and throws checked exceptions, whereas `Runnable` returns `void` and cannot throw checked exceptions.
- **`Future<V>`:** Manages the lifecycle of an asynchronous task (`cancel`, `isDone`, `get`). Calling `get()` blocks until task completion and rethrows task exceptions wrapped in `ExecutionException`.

**Completion & Result Management**
- **`ExecutorCompletionService`:** Combines an `Executor` with a `BlockingQueue` to process completed tasks in **completion order** (`take()`) rather than submission order, avoiding idle waiting on slower tasks.
- **Timed Execution:** `Future.get(timeout, unit)` prevents tasks from blocking callers indefinitely. When a timeout occurs (`TimeoutException`), tasks must be explicitly cancelled (`Future.cancel(true)`) to free system resources.

**Limitations of Parallelism**
- **Heterogeneous Tasks:** Splitting a process into a few unequal, distinct tasks (e.g., rendering text while downloading all images) yields limited performance gains due to execution time imbalance.
- **Homogeneous Tasks:** Real scalability requires decomposing large workloads into many small, independent, identical tasks that can be executed evenly across worker threads.

The formula for a pool size:
![[Pool size formula.png]]

### Configuring ThreadPoolExecutor
- `corePoolSize` defines the target size, the implementation will try to maintain this amount of threads even if there are no tasks or unless the work queue is full;
- `maximumPoolSize` defines the upper bound on how many threads can be active at once;
- `keepAliveTime` - if a thread is idle for more than this parameter, then it becomes a candidate for reaping and can be terminated of the current amount of threads is bigger than the `corePoolSize`;

### Managing queued tasks
There are 3 approaches to task queuing: unbounded, bounded and synchronous.
- For `newFixedThreadPool` and `newSingleThreadPool` use an unbounded `LinkedBlockingQueue`. A queue will grow unlimited if tasks keep coming faster than they are processed by threads.
- Using bounded queues such as `ArrayBlockingQueue`, bounded `LinkedBlockingQueue` or `PriorityBlockingQueue` allows you to avoid resource exhaustion but you have to think what to do with new tasks when the queue is full.
- It is possible to use `SynchronousQueue` to bypass queuing entirely and submit tasks to threads directly. If there is no available thread and the pool size is smaller than the maxim, then a new thread is created, otherwise the task is rejected. `newCachedThreadPool` uses `SynchronousQueue`. It is a practical choice when a pool size is inbounded or rejection policy is acceptable.

The **newCachedThreadPool** factory is a good default choice for an Executor, providing better queuing performance than a fixed thread pool. **A fixed size thread pool** is a good choice when you need to limit the number of concurrent tasks for resource‐management purposes, as in a server application that accepts requests from network clients and would otherwise be vulnerable to overload.

### Saturation policies
Saturation policies determine how a `ThreadPoolExecutor` handles newly submitted tasks when its bounded queue is full, all threads are busy, or the executor is shutting down. You configure these policies by passing a `RejectedExecutionHandler` to the executor.

**Built-In Saturation Policies**

| **Policy**                  | **Behavior**                                                                         | **Primary Use Case / Trade-off**                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **AbortPolicy** _(Default)_ | Throws `RejectedExecutionException`.                                                 | Forces the caller to catch and handle the submission failure explicitly.                                                    |
| **CallerRunsPolicy**        | The submitting thread executes the task itself instead of running it asynchronously. | Creates natural backpressure; slows down the task producer so worker threads can catch up.                                  |
| **DiscardPolicy**           | Silently drops the newly submitted task with no notification.                        | Best for non-critical tasks (e.g., metrics collection, logging) where dropped data is acceptable.                           |
| **DiscardOldestPolicy**     | Drops the oldest task in the queue to make room for the newly submitted task.        | Useful when newer tasks render older ones obsolete. _Avoid using with priority queues_, as it drops highest-priority tasks. |

**Custom Bounded Submissions**
If none of the default policies fit, you can implement a custom `RejectedExecutionHandler`. A common technique described in the book is using a `Semaphore` or calling `queue.put()` to force the producer thread to block until room opens up in the queue, achieving backpressure without running tasks directly on the caller thread.

### Thread factories
Executors use thread factories to create new threads. It is a good practice to pass the custom ThreadFactory to an executor to create custom threads with name, logger, UncaughtExceptionHandler and so on. Also it is possible to configure an Executor after its creation through setters.