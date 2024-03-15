import '../components/custom-table/custom-table.css';
import { Stack, CustomBST} from '../../../ts/dsa';
import { RequestQueue } from '../../../ts/general-classes';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';
import { useEffect, useState, useRef } from 'react';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';
import { getEntriesRequest, prefixURLTables } from '../manager';
import { useSelector } from 'react-redux';
import { ReduxStates } from '../../../redux/store';

function MonthlyTable(){
  // ******* General ******* //
  const asyncQueue: RequestQueue = new RequestQueue();
  const monthlyStack: Stack<typeof oldData> = new Stack<typeof oldData>();
  
  // ******* States ******* //
  const [monthlySubcategoriesBST, setMonthlySubcategoriesBST] = useState<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());
  const [monthlyBST, setMonthlyBST] = useState<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());
  const [successfulRequest, setSuccessfulRequest] = useState<boolean>(false);
  const redirected = useSelector((state: ReduxStates["defaultState"]) => state.monthlyTableState);
  
  // ******* References ******* //
  const todaysDate = useRef<Date>(new Date(Date.now()));
  const currentURL = useRef<URLSearchParams>(new URL(window.location.href).searchParams);

  // ******* Functions ******* //
  function returnURLWithSearchParams(): string{
    
    if(currentURL.current.has("id")){
      const tempStr = currentURL.current.get("id");
      
      if(tempStr && tempStr !== ""){
        return `${prefixURLTables}/entry?id=${tempStr}`;
      } 
    }

    let currYear: number = todaysDate.current.getUTCFullYear();
    let currMonth: number = todaysDate.current.getUTCMonth() + 1;

    if(currentURL.current.has("year")){
      const tempStr = currentURL.current.get("year");

      if(tempStr && Number.isInteger(Number(tempStr))){
        currYear = Number(tempStr);
      }
    }

    if(currentURL.current.has("month")){
      const tempStr = currentURL.current.get("month");

      if(tempStr && Number.isInteger(Number(tempStr))){
        currMonth = Number(tempStr);
      }
    }

    return `${prefixURLTables}/period?year=${currYear}&month=${currMonth}`;
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    async function retrieveDataFromDB(): Promise<void>{
     try{
        const requestURL: string = returnURLWithSearchParams();
        const returnedData: TypeCustomTable["customTableEntry"][] = await getEntriesRequest(requestURL);

        if(returnedData.length === 0){
          setSuccessfulRequest(true);
          return;
        }

        const newMonthlyBST: CustomBST<TypeCustomTable["customTableEntry"]> = new CustomBST();
        const newMonthlySubCategoryBST: CustomBST<TypeCustomTable["customTableEntry"]> = new CustomBST();

        for(let i: number = 0; i < returnedData.length; i++){
          const currentItem: TypeCustomTable["customTableEntry"] = returnedData[i];

          if(currentItem.isCategory){
            newMonthlyBST.insert([0, 0, 0], currentItem, currentItem.id, 0); 
          }
          else{
            newMonthlySubCategoryBST.insert([0, 0, 0], currentItem, Object.entries(returnedData)[i][0], 0); 
          }
        }

        setMonthlyBST(newMonthlyBST);
        setMonthlySubcategoriesBST(newMonthlySubCategoryBST);
        setSuccessfulRequest(true);
     }
     catch(err){
      console.error(`Couldn't fetch the data! ${err}`);
     }
    }

    asyncQueue.enqueueRequest(retrieveDataFromDB);

    return()=>{
      currentURL.current = new URL(window.location.href).searchParams;
      setMonthlyBST(new CustomBST<TypeCustomTable["customTableEntry"]>());
      setMonthlySubcategoriesBST(new CustomBST<TypeCustomTable["customTableEntry"]>());
      setSuccessfulRequest(false);
    }
  }, [redirected]);

  return(
    <>
      {successfulRequest ? 
        <CustomTable title="Monthly Manager" tableUse="monthly" stack={monthlyStack} categoryBST={monthlyBST}
        subcategoryBST={monthlySubcategoriesBST} /> : <div>Loading...</div>
      }
    </>
  )
}

export default MonthlyTable;