A **synchronizer** is an object that coordinates the control flow of threads based on its state.

**Latch** is a synchronizer that acts like a gate. It makes a thread wait until the 'gate' is open and then permits the thread to continue its execution. Once the 'gate' is open, it is never closed.
CountDownLatch is a widely-used example of a Latch. It can be initialized with an integer value and open the gate only when its value reaches 0. There are 2 methods: latch.await() -> puts the current thread in a waiting state, and latch.countDown() -> decreases the counter by 1.

```java
public long timeTasks(int nThreads, final Runnable task)
	throws (InterruptedException) {
	final CountDownLatch startGate = new CountDownLatch(1);
	final CountDownLatch endGate = new CountDownLatch(nThreads);
	
	for (int i = 0; i < nThreads; ++i) {
		Thread t = new Thread() {
			public void run() {
				try {
					startGate.await();
					try {
						task.run();
					} finally {
						endGate.countDown();
					}
				} catch (InterruptedException ignored) {}
			}
		};
		t.start();
	}
	
	long startTime = System.nanoTime();
	startGate.countDown();
	endGate.await();
	long finishTime = System.nanoTime();
	
	return finishTime - startTime;
}
```

**FutureTask** is an implementation of Future interface. It consumes Callable and its method get() either returns the result if it is already present or waits for the task to be completed and then returns it or throws an ExecutionException, which should be unwrapped and processed or rethrown since the initial exception has been wrapped into it.

**Semaphore** is used to control the amount of threads accessing the resource simultaneously. If the resource is acquired by the maximum number of threads allowed, other threads will be blocked until the resource is released. 2 methods are _semaphore.acquire()_ and _semaphore.release()_.

**Barriers** are a major synchronizer similar to latches. The difference between latches and barriers:
- **Latches** wait for _events_ (counter reaches 0) and are _one-time use_ (cannot be reset).
- **Barriers** make threads wait for _other threads_ at a designated barrier point until everyone arrives, and are _reusable_ (cyclic).