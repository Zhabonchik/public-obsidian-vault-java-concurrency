### Synchronized collections

As discussed earlier one of the most widely-used technique for making a class thread-safe is to delegate thread-safety to thread-safe objects that hold the sate of the class. For example, to thread-safe collections.

Synchronized collections include Vector, Hashtable and other collections wrapped in Collections.synchronizedXxx. The way they provide thread-safety is basically making all of their methods synchronized. But even with synchronized methods thread-safety is not guaranteed for iteration, navigation and conditional operations (put-if-absent) since they are compound operations.
For example, while iteration we may check if the next element is present, it will be, but right after the check it will be removed by another thread and then we will try to turn to the non-existing element. The solution - explicit client synchronization (**on the collection object itself**).

But synchronizing the whole process of iteration through collection can be costly and cause a big amount of threads blocked waiting to acquire a lock. That is why copying is preferred, but it introduces performance costs (memory allocation, copying overhead). We make a thread-local copy of a collection in a synchronized block and then iterate through it without additional synchronization.

Iterators can throw _ConcurrentModificationException_ if one thread changed the collection while another is processing it but it is not deterministic. It is possible to cause it even in a single-threaded environment by means of modifying a collection not via iterator.
Also you should keep in mind Hidden iterators: when the usage of iterators is not that obvious and is hidden inside some code.