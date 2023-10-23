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

// ******* QuickSort ******* //
function partition(low: number, high: number, arr: number[], sort: string): number{
  let idx: number = -1;
  const pivot: number = arr[high];

  for(let i: number = low; i < high; i++){
    if(sort !== "desc"){
      if(arr[i] <= pivot){
        idx++;
      }
      else{
        const temp: number = arr[i];
        arr[i] = arr[high];
        arr[high] = temp;
      }
    }
    else{
      if(arr[i] >= pivot){
        idx++;
      }
      else{
        const temp: number = arr[i];
        arr[i] = arr[high];
        arr[high] = temp;
      }
    }
  }

  idx++;
  const temp: number = arr[high];
  arr[high] = arr[idx];
  arr[idx] = temp;

  return idx;
}

function quickSortHelper(low: number, high: number, arr: number[], sort: string): number[]{
  const numArr: number[] = arr;

  if(low >= high){
    return numArr;
  }

  const pivot: number = partition(low, high, arr, sort);

  quickSortHelper(low, pivot - 1, numArr, sort);
  quickSortHelper(pivot + 1, high, numArr, sort);

  return numArr;
}

export function quickSort(arr: number[], sort: string): number[]{
  return quickSortHelper(0, arr.length - 1, arr, sort);
}

// ******* Binary Search Tree ******* //
class BSTNode<T>{
  value: number;
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;
  item: T;
  id: string;

  constructor(item: T, value: number, id: string){
    this.value = value;
    this.item = item;
    this.right = null;
    this.left = null;
    this.id = id;
  }
}

class CustomBST<T>{
  length: number;
  root: BSTNode<T> | null;

  constructor(){
    this.length = 0;
    this.root = null;
  }

  private organize(node: BSTNode<T>): void{
    if(!this.root){
      return;
    }

    let currentNode: BSTNode<T> | null = this.root;
    const stack = new Stack<BSTNode<T>>();

    while(currentNode){
      stack.insert(currentNode);

      if(node.value > currentNode.value){
        currentNode = currentNode.right;
      }
      else{
        currentNode = currentNode.left;
      }
    }

    currentNode = stack.pop()!;

    if(node.value > currentNode.value){
      currentNode.right = node;
    }
    else{
      currentNode.left = node;
    }
  }

  insert(value: number, item: T, id: string): void{
    const newNode: BSTNode<T> = new BSTNode(item, value, id);
    this.length++;

    if(!this.root){
      this.root = newNode;
      return;
    }

    this.organize(newNode);
  }

  traverse(order: string): BSTNode<T>[]{
    if(!this.root){
      console.log("There's nothing to traverse!");
      return [];
    }

    const stack = new Stack<BSTNode<T>>();
    let currentNode: BSTNode<T> | null = this.root;
    const nodes: BSTNode<T>[] = [];

    while(stack.length > 0 || currentNode){

      while(currentNode){
        stack.insert(currentNode);
        if(order === "desc"){
          currentNode = currentNode.right;
        }
        else{
          currentNode = currentNode.left;
        }  
      }

      currentNode = stack.pop()!;
      nodes.push(currentNode);
      if(order === "desc"){
        currentNode = currentNode.left;
      }
      else{
        currentNode = currentNode.right
      }
    }

    return nodes;
  }

  private returnParentChildNodes(id: string): BSTNode<T>[] | null{
    const stack = new Stack<BSTNode<T>>();
    let currentNode: BSTNode<T> | null = this.root;
    const parentChildNodes: any[] = [null, null];

    while(stack.length > 0 || currentNode){

      while(currentNode){
        stack.insert(currentNode);
        currentNode = currentNode.left;
      }

      currentNode = stack.pop()!;
      
      if(currentNode){
        if(currentNode.id === id && stack.length > 0){
          const parentNode: BSTNode<T> = stack.pop()!;
          parentChildNodes[0] = parentNode;
          parentChildNodes[1] = currentNode;
          return parentChildNodes;
        }
        else if(currentNode.id === id && stack.length === 0){
          parentChildNodes[0] = currentNode;
          return parentChildNodes;
        }
      }

      currentNode = currentNode.right
    }

    return null;
  }

  remove(id: string): void{
    if(!this.root){
      console.log("Nothing to remove!");
      return;
    }

    const parentChildNodes = this.returnParentChildNodes(id);

    if(parentChildNodes){
      this.length--;
      const [parent, child] = parentChildNodes;
      
      if(!child && parent){

        if(parent.left && !parent.right){
          this.root = parent.left;
          return;
        }
        else if(!parent.left && parent.right){
          this.root = parent.right;
          return;
        }
        else if(parent.left && parent.right){
          this.root = parent.left;
          this.organize(parent.right);
          return;
        }
        else{
          this.root = null;
          return;
        }
      }
      else if(child && parent){

        if(child.value <= parent.value){
          if(child.left && !child.right){
            parent.left = child.left;
            return;
          }
          else if(!child.left && child.right){
            parent.left = null;
            this.organize(child.right);
            return;
          }
          else if(child.left && child.right){
            parent.left = child.left;
            this.organize(child.right);
            return;
          }
          else{
            parent.left = null;
            return;
          }
        }
        else{
          if(child.left && !child.right){
            parent.right = null;
            this.organize(child.left);
            return;
          }
          else if(!child.left && child.right){
            parent.right = child.right;
            return;
          }
          else if(child.left && child.right){
            parent.right = child.right;
            this.organize(child.left);
            return;
          }
          else{
            parent.right = null;
            return;
          }
        }
      }
    }

    console.log("Unable to find the item.");
  }
}