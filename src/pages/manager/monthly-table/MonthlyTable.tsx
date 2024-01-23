import '../components/custom-table/custom-table.css';
import { Stack, CustomBST, BSTNode } from '../../../ts/dsa';
import { RequestQueue } from '../../../ts/general-classes';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';
import { useEffect, useState, useRef } from 'react';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';
import { getEntriesRequest } from '../manager';

const monthlyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function MonthlyTable(){
  const asyncQueue: RequestQueue = new RequestQueue();
  const todaysDate = useRef<Date>(new Date(Date.now()));
  const monthlyBST = useRef<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());
  const monthlySubcategoriesBST = useRef<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());
  const currentURL = useRef<URLSearchParams>(new URL(window.location.href).searchParams);

  const [successfulRequest, setSuccessfulRequest] = useState<boolean>(false);

  function returnURLWithSearchParams(): string{

    if(currentURL.current.has("id")){
      const tempStr = currentURL.current.get("id");
      
      if(tempStr && tempStr !== ""){
        return `https://localhost:7158/api/tables/entry?id=${tempStr}`;
      } 
    }

    let currYear: number = todaysDate.current.getUTCFullYear();
    let currMonth: number = todaysDate.current.getUTCMonth();

    if(currentURL.current.has("year")){
      const tempStr = currentURL.current.get("year");

      if(tempStr && Number.isInteger(tempStr)){
        currYear = Number(tempStr);
      }
    }

    if(currentURL.current.has("month")){
      const tempStr = currentURL.current.get("month");

      if(tempStr && Number.isInteger(tempStr)){
        currMonth = Number(tempStr);
      }
    }

    return `https://localhost:7158/api/tables/period?year=${currYear}&month=${currMonth}`;
  }

  useEffect(()=>{
    async function retrieveDataFromDB(): Promise<void>{
     try{
        const requestURL: string = returnURLWithSearchParams();
        const returnedData: TypeCustomTable["customTableEntry"][] = await getEntriesRequest(requestURL);

        if(returnedData.length === 0){
          return;
        }

        console.log(returnedData);

        for(let i: number = 0; i < returnedData.length; i++){
          const currentItem: TypeCustomTable["customTableEntry"] = returnedData[i];

          if(currentItem.isCategory){
            monthlyBST.current.insert([0, 0, 0], currentItem, Object.entries(returnedData)[i][0], 0); 
          }
          else{
            monthlySubcategoriesBST.current.insert([0, 0, 0], currentItem, Object.entries(returnedData)[i][0], 0); 
          }
        }

        monthlyBST.current.traverse("desc").forEach(node =>{
          console.log(`Category: ${node.item.linkID}`);
        })

        monthlySubcategoriesBST.current.traverse("desc").forEach(node =>{
          console.log(`Subcategories: ${node.item.linkID}`);
        })

        setSuccessfulRequest(prev => prev = true);
     }
     catch(err){
      console.error(`Couldn't fetch the data! ${err}`);
     }
    }

    asyncQueue.enqueueRequest(retrieveDataFromDB);

    return()=>{
      setSuccessfulRequest(prev => prev = false);
    }
  }, []);

  return(
    <>
      {successfulRequest ? 
        <CustomTable title="Monthly Manager" tableUse="monthly" stack={monthlyStack} categoryBST={monthlyBST.current}
        subcategoryBST={monthlySubcategoriesBST.current} /> : <div>Loading...</div>
      }
    </>
  )
}

export default MonthlyTable;