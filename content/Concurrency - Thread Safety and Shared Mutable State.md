### Thread-safety

**A class is thread-safe** if it behaves correctly when accessed by multiple threads regardless of runtime scheduling or interleaving with no additional synchronization required from the caller.

**Stateless objects are always thread-safe.** Because local variables reside exclusively on a thread's private execution stack, concurrent method calls cannot access or corrupt shared state. Referencing other stateless, immutable, or thread-safe objects preserves this guarantee.