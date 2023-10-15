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
function partition(low: number, high: number, arr: number[]): number{
  let idx: number = -1;
  const pivot: number = arr[high];

  for(let i: number = low; i < high; i++){
    if(arr[i] <= pivot){
      idx++;
    }
    else{
      const temp: number = arr[i];
      arr[i] = arr[high];
      arr[high] = temp;
    }
  }

  idx++;
  const temp: number = arr[high];
  arr[high] = arr[idx];
  arr[idx] = temp;

  return idx;
}

function quickSortHelper(low: number, high: number, arr: number[]): number[]{
  const numArr: number[] = arr;

  if(low >= high){
    return numArr;
  }

  const pivot: number = partition(low, high, arr);

  quickSortHelper(low, pivot - 1, numArr);
  quickSortHelper(pivot + 1, high, numArr);

  return numArr;
}

function quickSort(arr: number[]): number[]{
  return quickSortHelper(0, arr.length - 1, arr);
}