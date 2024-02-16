import '../components/custom-table/custom-table.css';
import { Stack, CustomBST, BSTNode } from '../../../ts/dsa';
import { RequestQueue } from '../../../ts/general-classes';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';
import { useEffect, useState, useRef, useMemo } from 'react';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';
import { currentURLSearchParams, getEntriesRequest } from '../manager';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStates } from '../../../redux/store';

const monthlyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function MonthlyTable(){
  const asyncQueue: RequestQueue = new RequestQueue();
  const todaysDate = useRef<Date>(new Date(Date.now()));
  const [monthlyBST, setMonthlyBST] = useState<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());
  const [monthlySubcategoriesBST, setMonthlySubcategoriesBST] = useState<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());
  const currentURL = useRef<URLSearchParams>(new URL(window.location.href).searchParams);

  const dispatch = useDispatch();
  const redirected = useSelector((state: ReduxStates["defaultState"]) => state.monthlyTableState);

  const [successfulRequest, setSuccessfulRequest] = useState<boolean>(false);

  let isMounted: boolean = true;

  function returnURLWithSearchParams(): string{
    
    if(currentURL.current.has("id")){
      const tempStr = currentURL.current.get("id");
      
      if(tempStr && tempStr !== ""){
        return `https://localhost:7158/api/tables/entry?id=${tempStr}`;
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
        console.log(tempStr);
        currMonth = Number(tempStr);
      }
    }

    return `https://localhost:7158/api/tables/period?year=${currYear}&month=${currMonth}`;
  }

  useEffect(()=>{
    console.log("MonthlyTable component mounted");
    console.log(`Prop Status: ${!redirected ? "NULL" : redirected }`);

    async function retrieveDataFromDB(): Promise<void>{
     try{
        const requestURL: string = returnURLWithSearchParams();
        console.log("Fetching data from:", requestURL);
        const returnedData: TypeCustomTable["customTableEntry"][] = await getEntriesRequest(requestURL);
        console.log("Data fetched successfully:", returnedData);

        if(returnedData.length === 0){
          setSuccessfulRequest(prev => prev = true);
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

        setMonthlyBST(prev => prev = newMonthlyBST);
        setMonthlySubcategoriesBST(prev => prev = newMonthlySubCategoryBST);
        setSuccessfulRequest(prev => prev = true);
     }
     catch(err){
      console.error(`Couldn't fetch the data! ${err}`);
     }
    }

    asyncQueue.enqueueRequest(retrieveDataFromDB);

    return()=>{
      currentURL.current = new URL(window.location.href).searchParams;
      setMonthlyBST(prev => prev = new CustomBST<TypeCustomTable["customTableEntry"]>());
      setMonthlySubcategoriesBST(prev => prev = new CustomBST<TypeCustomTable["customTableEntry"]>());
      setSuccessfulRequest(prev => prev = false);
      console.log("MonthlyTable component unmounted");
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