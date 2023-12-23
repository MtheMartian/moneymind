import {Queue} from './dsa';

class RequestQueue{
  myQueue: Queue<{requestFunction: Function, resolve: Function, reject: Function}>;
  isProcessing: boolean;

  constructor(){
    this.myQueue = new Queue();
    this.isProcessing = false;
  }

  private async startProcessing(): Promise<void>{
    this.isProcessing = true;

    while(this.myQueue.length > 0){
      const {requestFunction, resolve, reject} = this.myQueue.dequeue()!.value;

      try{
        const result: Function = await requestFunction();
        resolve(result);
      }
      catch(error){
        reject(error);
      }
    }

    this.isProcessing = false;
  }

  async enqueueRequest(requestFunction: Function): Promise<unknown>{
    return new Promise(async (resolve, reject) =>{
      this.myQueue.enqueue({requestFunction, resolve, reject});

      if(!this.isProcessing){
        await this.startProcessing();
      }
    })
  }
}