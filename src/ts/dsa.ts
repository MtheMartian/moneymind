// ******* Stack ******* //
class MyNode<T>{
  value: T;
  prev: MyNode<T> | null;
  next: MyNode<T> | null;

  constructor(value: T){
    this.prev = null;
    this.next = null;
    this.value = value;
  }
}

export class Stack<T>{
  head: MyNode<T> | null;
  tail: MyNode<T> | null;
  length: number;

  constructor(){
    this.head = this.tail = null;
    this.length = 0;
  }

  insert(value: T): void{
    this.length++;
    const node: MyNode<T> = new MyNode<T>(value);

    if(this.head){
      const tmpNode = this.head;
      tmpNode.next = node;
      node.prev = tmpNode;
      this.head = node;
    }
    else{
      this.head = node;
      this.tail = node;
    }  
  }

  pop(): T | null{
    if(this.head){
      this.length--;
      const tmpNode = this.head;
      this.head = tmpNode.prev;

      if(this.head){
        this.head.next = null;
      }
      else{
        this.tail = null;
      }
  
      tmpNode.prev = null;
      return tmpNode.value;
    }
    else{
      console.error("Stack is empty.");
      return null;
    }
  }

  clear(): void{
    this.length = 0;
    this.head = this.tail = null;
  }
}

// ******* Binary Search Tree (BST) ******* //
class BSTNode<T>{
  value: T;
  item: [];
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;

  constructor(value: T, item: []){
    this.value = value;
    this.item = item;
    this.left = null;
    this.right = null;
  }
}

class BST{
  length: number;
  root: BSTNode<number> | null;

  constructor(){
    this.length = 0;
    this.root = null;
  }

  private traverse(): BSTNode<number>[]{
    const stack: Stack<BSTNode<number>> = new Stack();

    if(this.root){
      stack.insert(this.root);
    }
    else{
      console.log("BST is empty!");
      return [];
    }

    let currentNode: BSTNode<number> | null = this.root;
    while(stack.length > 0){
      currentNode = stack.pop();

      while(currentNode){
        stack.insert(currentNode);
        currentNode = currentNode.left;
      }

    }
    return [];
  }

  private organizer(node: BSTNode<number>): void{
    let currentNode = this.root;
    const stack: Stack<BSTNode<number>> = new Stack();

    while(currentNode){
      stack.insert(currentNode);
      if(node.value <= currentNode.value){
        currentNode = currentNode.left;
      }
      else{
        currentNode = currentNode.right;
      }
    }

    const parentNode = stack.pop();

    if(parentNode){
      if(node.value <= parentNode.value){
        parentNode.left = node;
      }
      else{
        parentNode.right = node;
      }
    }
  }
}