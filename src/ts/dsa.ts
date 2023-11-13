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

  items(): MyNode<T>[]{
    let currentNode: MyNode<T> | null = this.head;
    const nodes: MyNode<T>[] = [];
    while(currentNode){
      nodes.push(currentNode);
      currentNode = currentNode.prev;
    }

    return nodes;
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

/**
 * @property value (0: Date, 1: Category/Subcategory, 2: Amount, 3: LastUpdated)
 */
// ******* Binary Search Tree ******* //
export class BSTNode<T>{
  value: number[];
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;
  item: T;
  id: string;

  constructor(item: T, value: number[], id: string){
    this.value = value;
    this.item = item;
    this.right = null;
    this.left = null;
    this.id = id;
  }
}

export class CustomBST<T>{
  length: number;
  root: BSTNode<T> | null;

  constructor(){
    this.length = 0;
    this.root = null;
  }

  private organize(node: BSTNode<T>, idx: number): void{
    if(!this.root){
      return;
    }

    let currentNode: BSTNode<T> | null = this.root;
    const stack = new Stack<BSTNode<T>>();

    while(currentNode){
      stack.insert(currentNode);

      if(node.value[idx] > currentNode.value[idx]){
        currentNode = currentNode.right;
      }
      else{
        currentNode = currentNode.left;
      }
    }

    currentNode = stack.pop()!;

    if(node.value[idx] > currentNode.value[idx]){
      currentNode.right = node;
    }
    else{
      currentNode.left = node;
    }
  }

    /**
 * @param idx (0: Date, 1: Category/Subcategory, 2: Amount, 3: LastUpdated)
 */
  insert(value: number[], item: T, id: string, idx: number): void{
    const newNode: BSTNode<T> = new BSTNode(item, value, id);
    this.length++;

    if(!this.root){
      this.root = newNode;
      return;
    }

    this.organize(newNode, idx);
  }

  /**
   * Traverses the binary search tree and returns an array of nodes.
   * @param order - The traversal order ("asc" for ascending, "desc" for descending).
   * @returns An array of nodes in the specified order.
  */
  traverse(order: string): BSTNode<T>[]{
    if(!this.root){
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

  private returnParentChildNodes(id: string): {parentNode: BSTNode<T> | null, childNode: BSTNode<T> | null}{
    const stack = new Stack<BSTNode<T>>();
    let currentNode: BSTNode<T> | null = this.root;
    const parentChildNodes: {parentNode: BSTNode<T> | null, childNode: BSTNode<T> | null} = 
    {
      parentNode: null,
      childNode: null
    };


    const nodes: BSTNode<T>[] = [];
    // Keep track of currentNode index in nodes array using idx variable.
    let nodeIdx: number = -1;

    while(stack.length > 0 || currentNode){

      while(currentNode){
        stack.insert(currentNode);
        nodes.push(currentNode);
        nodeIdx++;
        currentNode = currentNode.left;
      }

      currentNode = stack.pop()!;
      
      if(currentNode && currentNode.id === id){
        // Use nodeIdx variable to get the correct nodes (parent and child (currentNode));
        // Ternary operations are pretty self explinatory.
        const parentNodeIdx: number = nodeIdx - 1;

        parentChildNodes.parentNode = parentNodeIdx < 0 ? nodes[nodeIdx] : nodes[parentNodeIdx];
        parentChildNodes.childNode = nodeIdx === 0 ? null : nodes[nodeIdx];

        return parentChildNodes;
      }

      nodeIdx--;

      currentNode = currentNode.right
    }

    return parentChildNodes;
  }

  /**
   * Returns requested item.
   * @param id - The ID of the node.
   * @returns Item or null (if not found).
   */
  retrieve(id: string): BSTNode<T> | null{
    const stack = new Stack<BSTNode<T>>();
    let currentNode: BSTNode<T> | null = this.root;

    while(stack.length > 0 || currentNode){

      while(currentNode){
        stack.insert(currentNode);
        currentNode = currentNode.left;
      }

      currentNode = stack.pop()!;
      
      if(currentNode){
        if(currentNode.id === id){
          return currentNode;
        }
      }

      currentNode = currentNode.right
    }

    return null;
  }

  /**
   * Update item.
   * If item can't be found, it will be created.
   * @param idx (0: Date, 1: Category/Subcategory, 2: Amount, 3: LastUpdated)
  */
  update(id: string, item: T, value: number[], idx: number): void{
    const stack = new Stack<BSTNode<T>>();
    let currentNode: BSTNode<T> | null = this.root;

    while(stack.length > 0 || currentNode){

      while(currentNode){
        stack.insert(currentNode);
        currentNode = currentNode.left;
      }

      currentNode = stack.pop()!;
      
      if(currentNode){
        if(currentNode.id === id){
          currentNode.item = item;
          currentNode.value = value;
          return;
        }
      }

      currentNode = currentNode.right
    }

    this.insert(value, item, id, idx);
  }

  /**
   * Remove node.
   * @param idx (0: Date, 1: Category/Subcategory, 2: Amount, 3: LastUpdated)
  */
  remove(id: string, idx: number): void{
    if(!this.root){
      console.log("Nothing to remove!");
      return;
    }

    const parentChildNodes = this.returnParentChildNodes(id);
    console.log(parentChildNodes);

    if(parentChildNodes){
      this.length--;
      const child = parentChildNodes.childNode;
      const parent = parentChildNodes.parentNode;
      
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
          this.organize(parent.right, idx);
          return;
        }
        else{
          this.root = null;
          return;
        }
      }
      else if(child && parent){

        if(child.value[idx] <= parent.value[idx]){
          if(child.left && !child.right){
            parent.left = child.left;
            return;
          }
          else if(!child.left && child.right){
            parent.left = null;
            this.organize(child.right, idx);
            return;
          }
          else if(child.left && child.right){
            parent.left = child.left;
            this.organize(child.right, idx);
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
            this.organize(child.left, idx);
            return;
          }
          else if(!child.left && child.right){
            parent.right = child.right;
            return;
          }
          else if(child.left && child.right){
            parent.right = child.right;
            this.organize(child.left, idx);
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

  clear(): void{
    this.root = null;
  }

  /**
   * @param idx (0: Date, 1: Category/Subcategory, 2: Amount, 3: LastUpdated)
  */
  reconstruct(nodes: BSTNode<T>[], idx: number): void{
    const newNodes: BSTNode<T>[] = [];

    nodes.forEach(node =>{
      newNodes.push(new BSTNode<T>(node.item, node.value, node.id));
    });

    this.clear();

    newNodes.forEach(node =>{
      this.insert(node.value, node.item, node.id, idx);
    });

    console.log(this.traverse("asc"));
  }
}