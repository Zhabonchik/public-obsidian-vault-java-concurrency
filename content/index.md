---
title: "Java Concurrency — Map of Content"
author: Brian Goetz & Modern Java Community
tags:
  - book/java-concurrency
  - java
  - concurrency
  - moc
reading_status: in-progress
---

# ⚡ Java Concurrency (Goetz + Modern Java) — Index & MOC

> *"Writing thread-safe code is, at its core, about managing access to state, and in particular to shared, mutable state."* — Brian Goetz

Welcome to the central hub for **Java Concurrency**. This map bridges foundational principles from *Java Concurrency in Practice* with modern features up to Java 21+ (Virtual Threads, Structured Concurrency, and Scoped Values).

---

## 📊 Reading Progress Tracker
- [ ] **Progress**: 0 / 40 topics completed
- **Current Focus**: Thread Safety & Shared State

---

## 🗂️ Map of Content by Concurrency Domain

### 1. 🛡️ Thread Safety & Fundamentals (JCIP Part I)
*Managing shared mutable state, atomicity, locking, and immutability.*
- [ ] [[Concurrency - Thread Safety and Shared Mutable State]]
- [ ] [[Concurrency - Atomicity, Race Conditions, and Compound Actions]]
- [ ] [[Concurrency - Intrinsic Locks and Synchronized Blocks]]
- [ ] [[Concurrency - Visibility, Volatile Variables, and Memory Piggybacking]]
- [ ] [[Concurrency - Safely Publishing Objects and Escape Analysis]]
- [ ] [[Concurrency - Thread-Safe Object Design]]

### 2. 🧩 Building Concurrent Applications (JCIP Part II)
*Thread-safe collections, building blocks, and task execution frameworks.*
- [ ] [[Concurrency - Synchronized vs Concurrent Collections (ConcurrentHashMap)]]
- [ ] [[Concurrency - Synchronizers (CountDownLatch, CyclicBarrier, Semaphore, Phaser)]]
- [ ] [[Concurrency - Building a Scalable Result Cache]]
- [ ] [[Concurrency - Executor Framework and Thread Pools]]
- [ ] [[Concurrency - Task Cancellation, Interruption, and Poison Pills]]
- [ ] [[Concurrency - JVM Thread Lifecycle and Clean Pool Shutdown]]

### 3. 🚨 Liveness, Performance & Testing (JCIP Part III)
*Preventing deadlocks, tuning throughput, and testing concurrent code.*
- [ ] [[Concurrency - Deadlocks, Lock Ordering, and Resource Starvation]]
- [ ] [[Concurrency - Performance, Scalability, and Amdahl's Law]]
- [ ] [[Concurrency - Reducing Lock Contention (Lock Splitting & Striping)]]
- [ ] [[Concurrency - Testing Concurrent Code for Correctness and Performance]]

### 4. 🔬 Advanced Concurrency & Low-Level Mechanics (JCIP Part IV)
*Explicit locks, atomic variables, non-blocking algorithms, and the JMM.*
- [ ] [[Concurrency - ReentrantLock and Condition Objects]]
- [ ] [[Concurrency - ReadWriteLock and StampedLock]]
- [ ] [[Concurrency - Atomic Variables and Hardware CAS Operations]]
- [ ] [[Concurrency - Non-blocking Data Structures and Lock-Free Algorithms]]
- [ ] [[Concurrency - The Java Memory Model (JMM) and Happens-Before Guarantee]]

### 5. 🚀 Asynchronous & Reactive Java (Java 8 - 11)
*Moving away from blocking threads with non-blocking futures and pipelines.*
- [ ] [[Concurrency - CompletableFuture and Asynchronous Pipelines]]
- [ ] [[Concurrency - Exception Handling in Asynchronous Workflows]]
- [ ] [[Concurrency - Reactive Streams Specification and Flow API]]

### 6. 🧵 Modern Threading & Loom (Java 21+)
*Lightweight concurrency, structured lifetime management, and thread-local alternatives.*
- [ ] [[Concurrency - Platform Threads vs Virtual Threads (Project Loom)]]
- [ ] [[Concurrency - Pinning Virtual Threads (Monitors vs ReentrantLock)]]
- [ ] [[Concurrency - Structured Concurrency (StructuredTaskScope)]]
- [ ] [[Concurrency - Scoped Values as Lightweight Thread-Locals]]

---

## 🧠 Master Syntheses & Architecture Patterns
*Cross-cutting design patterns and architectural references.*

* [[Concurrency Anti-Patterns and Pitfalls Checklist]]
* [[Choosing the Right Concurrency Abstraction (Decision Tree)]]
* [[Virtual Threads Migration Guide for Legacy Applications]]