import {Queue} from './dsa';

export class RequestQueue{
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
      let retries: number = 3; 

      while(retries > 0){
        try{
          const result: Function = await requestFunction();
          resolve(result);
          break;
        }
        catch(error){
          retries--;
          console.error(`Something went wrong with the request! ${error}`);
          reject(error);
        }
      }

      if(retries <= 0){
        reject(new Error("Max retries reached!"));
      }
    }

    this.isProcessing = false;
  }

  async enqueueRequest(requestFunction: Function): Promise<Response>{
    return new Promise<Response>(async (resolve, reject) =>{
      this.myQueue.enqueue({requestFunction, resolve, reject});

      if(!this.isProcessing){
        await this.startProcessing();
      }
    })
  }
}