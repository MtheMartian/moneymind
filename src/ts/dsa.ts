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
class BSTNode<T, V>{
  value: T;
  item: V;
  left: BSTNode<T, V> | null;
  right: BSTNode<T, V> | null;

  constructor(value: T, item: V){
    this.value = value;
    this.item = item;
    this.left = null;
    this.right = null;
  }
}

class BST<V>{
  length: number;
  root: BSTNode<number, V> | null;

  constructor(){
    this.length = 0;
    this.root = null;
  }

   traverse(sortType: string): BSTNode<number, V>[]{
    const stack: Stack<BSTNode<number, V>> = new Stack();
    const nodes: BSTNode<number, V>[] = [];

    if(!this.root){
      console.log("BST is empty!");
      return [];
    }

    let currentNode: BSTNode<number, V> | null = this.root;
    while(stack.length > 0 || currentNode){

      while(currentNode){
        stack.insert(currentNode);
        if(sortType === "desc"){
          currentNode = currentNode.right;
        }
        else{
          currentNode = currentNode.left;
        }
      }

      currentNode = stack.pop()!;
      nodes.push(currentNode);
      if(sortType === "desc"){
        currentNode = currentNode.left;
      }
      else{
        currentNode = currentNode.right;
      }
    }
    return nodes;
  }

  private organize(node: BSTNode<number, V>): void{
    let currentNode = this.root;
    const stack: Stack<BSTNode<number, V>> = new Stack();

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

  insert(value: number, item: V): void{
    const newNode: BSTNode<number, V> = new BSTNode(value, item);
    this.length++;

    if(!this.root){
      this.root = newNode;
      return;
    }

    this.organize(newNode);
  }

  private returnNodeAndparent(item: V): BSTNode<number, V>[]{
    const stack: Stack<BSTNode<number, V>> = new Stack();
    const nodes: BSTNode<number, V>[] = Array(2).fill(null);

    let currentNode: BSTNode<number, V> | null = this.root;
    while(stack.length > 0 || currentNode){

      while(currentNode){
        stack.insert(currentNode);
        currentNode = currentNode.left;
      }

      currentNode = stack.pop()!;
      if(currentNode.item === item){
        nodes[1] = currentNode;

        const parentNode = stack.pop();
        
        if(parentNode){
          nodes[0] = parentNode;
        }

        break;
      }
      currentNode = currentNode.right;
    }

    return nodes;
  }

  
  findOne(item: V): BSTNode<number, V>{
    const nodes: BSTNode<number, V>[] = this.traverse("asc");
    return nodes[0];
  }

  remove(item: V): void{
    if(!this.root){
      console.log("BST is empty!");
      return;
    }

    const retrievedNodes = this.returnNodeAndparent(item);

    if(!retrievedNodes[0] && !retrievedNodes[1]){
      console.log("Could not find the item.");
      return;
    }

    

  }
}