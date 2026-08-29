
If we add a second state thread-safe variable it won't guarantee thread-safety of the class. Because if there are 2 variables and they are interconnected, then they must be updated atomically, otherwise there can be a timing when 1 of them is updated, the second one is not, which results in race condition.

One of the locking mechanism is an intrinsic locking mechanism - **synchronized block**. An intrinsic lock is the underlying lock mechanism built into every Java object, while a `synchronized` block is the Java language syntax used to acquire and release that lock.
```java
// synchronized block with an object as a lock
synchronized (obj) {
	...
}

// synchronized method, in this case 'this' acts a lock
// for static methods it is Class itself (Widget.class)

public synchronized void service(...) {
	...
}
```
All the code that is executed inside the ``synchronized`` block can be treated as a single operation like in transactions. Other threads can't observe the holding thread in a middle state.
A thread acquires lock when it enters the ``synchronized`` block and releases lock when it leaves the block of code. Other threads are either in ``waiting`` or ``blocked`` state.

Using big ``synchronized`` blocks is not the best approach and causes performance issues. They must be as small as possible and not involve heavy I/O operations.

**Reentrancy** means that locks are acquired on a per-thread rather then a per-invocation basis (if a thread that already owns the lock asks for it again, it will be permitted, other threads will be blocked, if they ask for a lock, while it is owned by the current thread).

Each reentrant lock has a count of owning threads and an owning thread. When the lock is released its count = 0. When a thread acquires a lock, the lock's count is increased and the current thread is set as the owning one. When it tries to reacquire the lock, the count is increased. When the lock is released, the count is decreased and the lock is ready to be acquired if the count = 0.

Otherwise the following code would call a deadlock:
```java
public class Widget {
	
	public synchronized void doSmth() {
		...
	}
}

public class ChildWidget extends Widget {

	@Override
	public synchronized void doSmth() {
		...
		super.doSmth();
	}

}
```