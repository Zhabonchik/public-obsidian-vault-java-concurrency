### Synchronized collections

As discussed earlier one of the most widely-used technique for making a class thread-safe is to delegate thread-safety to thread-safe objects that hold the sate of the class. For example, to thread-safe collections.

Synchronized collections include Vector, Hashtable and other collections wrapped in Collections.synchronizedXxx. The way they provide thread-safety is basically making all of their methods synchronized. But even with synchronized methods thread-safety is not guaranteed for iteration, navigation and conditional operations (put-if-absent) since they are compound operations.
For example, while iteration we may check if the next element is present, it will be, but right after the check it will be removed by another thread and then we will try to turn to the non-existing element. The solution - explicit client synchronization (**on the collection object itself**).

But synchronizing the whole process of iteration through collection can be costly and cause a big amount of threads blocked waiting to acquire a lock. That is why copying is preferred, but it introduces performance costs (memory allocation, copying overhead). We make a thread-local copy of a collection in a synchronized block and then iterate through it without additional synchronization.

Iterators can throw _ConcurrentModificationException_ if one thread changed the collection while another is processing it but it is not deterministic. It is possible to cause it even in a single-threaded environment by means of modifying a collection not via iterator.
Also you should keep in mind Hidden iterators: when the usage of iterators is not that obvious and is hidden inside some code.

### Concurrent collections

Replacing synchronized collections with concurrent collections can offer dramatic scalability improvements with little risk. The only reason to use synchronized collections is when you need an exclusive lock on the whole collection. Also their iterators are **weakly consistent** and don't throw _ConcurrentModificationException_ and tolerate collection size as approximate since it is a constantly changing value.

synchronized Map -> ConcurrentHashMap
synchronized TreeMap -> ConcurrentSkipListMap
synchronized TreeSet -> ConcurrentSkipListSet
synchronized List -> CopyOnWriteArrayList
synchronized Set -> CopyOnWriteArraySet
synchronized Queue -> ConcurrentLinkedQueue, BlockingQueue

ConcurrentHashMap allows better performance because it does not acquire the exclusive lock for each operation. It uses lock-striping which allows concurrent access of readers and writers.
It is not possible to lock an instance of a ConcurrentHashMap externally via _synchronized(map)_. For this reason ConcurrentMap interface provides the following built-in atomic methods:
```java
putIfAbsent(key, value);

remove(key, value);

replace(key, oldValue, newValue);
```

CopyOnWriteArrayList creates a copy each time a list is modified, so its use-case is when the number of traversals is much bigger than the number of modifications (some event-notification systems).
Iterators for `CopyOnWriteArrayList` hold an immutable reference to the array snapshot created at the moment the iterator was instantiated. Calling `iterator.remove()` throws an `UnsupportedOperationException`.

### Blocking Queues and Producer-consumer pattern

BlockingQueue provides 2 blocking methods: _put_ and _take_. If the queue is full, _put_ blocks the thread. Similarly if the queue is empty, the _take_ method blocks the thread. Such queues are called **Bounded**.

Bounded queues are a powerful resource management tool for building reliable applications: they make your program more robust to overload by throttling activities that threaten to produce more work than can be handled.
Bounded queues are widely used in a concurrent producer-consumer pattern.

**`SynchronousQueue` (Direct Handoff):** A zero-capacity queue where a `put()` call blocks until another thread executes a `take()` (and vice versa). It hands off work directly without storing elements, reducing handoff latency when consumer capacity is readily available.

 **Work Stealing & `Deque`:** Chapter 5.3 introduces `BlockingDeque` and the **Work Stealing** pattern. Unlike standard producer-consumer where all workers share a single queue, every consumer thread has its own `Deque`. If a worker exhausts its own queue, it "steals" tasks from the tail of another worker's `Deque`, significantly reducing lock contention.

 **Serial Thread Confinement:** Transferring a mutable object through a `BlockingQueue` safely hands off ownership from the producer to the consumer thread. As long as the producer releases all references to the object after enqueuing it, publication is thread-safe without further explicit locking.