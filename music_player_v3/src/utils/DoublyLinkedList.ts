export class Node<T> {
  value: T;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class DoublyLinkedList<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  current: Node<T> | null;
  size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.size = 0;
  }

  append(value: T): void {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = this.tail = this.current = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  prepend(value: T): void {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = this.tail = this.current = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
      if (!this.current) this.current = newNode;
    }
    this.size++;
  }

  insertAt(index: number, value: T): void {
    if (index <= 0) return this.prepend(value);
    if (index >= this.size) return this.append(value);

    const newNode = new Node(value);
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    newNode.prev = current!.prev;
    newNode.next = current;
    current!.prev!.next = newNode;
    current!.prev = newNode;
    this.size++;
  }

  remove(value: T): boolean {
    let current = this.head;
    while (current) {
      if (current.value === value) {
        if (current === this.current) {
          this.current = current.next || current.prev;
        }

        if (current.prev) current.prev.next = current.next;
        else this.head = current.next;

        if (current.next) current.next.prev = current.prev;
        else this.tail = current.prev;

        this.size--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  next(): T | null {
    if (this.current?.next) {
      this.current = this.current.next;
      return this.current.value;
    }
    return null;
  }

  previous(): T | null {
    if (this.current?.prev) {
      this.current = this.current.prev;
      return this.current.value;
    }
    return null;
  }

  getCurrent(): T | null {
    return this.current?.value || null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  search(predicate: (value: T) => boolean): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      if (predicate(current.value)) {
        result.push(current.value);
      }
      current = current.next;
    }
    return result;
  }

  reorder(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= this.size || toIndex >= this.size) {
      return;
    }

    // Convertir a array, reordenar y reconstruir la lista
    const items = this.toArray();
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);

    // Reconstruir la lista
    this.head = null;
    this.tail = null;
    this.current = null;
    this.size = 0;

    items.forEach((item, index) => {
      this.append(item);
      // Mantener el current en el mismo elemento
      if (fromIndex === index) {
        this.current = this.tail;
      }
    });
  }
}

