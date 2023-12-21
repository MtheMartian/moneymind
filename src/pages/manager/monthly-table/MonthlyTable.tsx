import '../components/custom-table/custom-table.css';
import { Stack, CustomBST, BSTNode } from '../../../ts/dsa';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';
import { useEffect, useState } from 'react';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';

const monthlyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function MonthlyTable(){
  const monthlyBST: CustomBST<TypeCustomTable["customTableEntry"]> = new CustomBST();
  const monthlySubcategoriesBST: CustomBST<TypeCustomTable["customTableEntry"]> = new CustomBST();

  const [successfulRequest, setSuccessfulRequest] = useState<boolean>(false);

  useEffect(()=>{
    async function retrieveDataFromDB(): Promise<void>{
      try{
        const response: Response = await fetch("https://localhost:7158/api/tables");

      if(response.ok){
        const returnedData: {} = await response.json();

        for(let i: number = 0; i < Object.entries(returnedData).length; i++){
          const currentItem: TypeCustomTable["customTableEntry"] = Object.entries<TypeCustomTable["customTableEntry"]>(returnedData)[i][1];

          if(currentItem.isCategory){
            monthlyBST.insert([0, 0, 0], currentItem, Object.entries(returnedData)[i][0], 0); 
          }
          else{
            monthlySubcategoriesBST.insert([0, 0, 0], currentItem, Object.entries(returnedData)[i][0], 0); 
          }
        }

        setSuccessfulRequest(prev => prev = true);
      }
      else{
        console.error("Something went wrong! Data not retrieved!");
        setSuccessfulRequest(prev => prev = false);
        setTimeout(retrieveDataFromDB, 3000);
      }
      }
      catch(err){
        console.error(`Oops! ${err}`);
        setTimeout(retrieveDataFromDB, 3000);
      }
    }

    retrieveDataFromDB();

    return()=>{
      setSuccessfulRequest(prev => prev = false);
    }
  }, []);

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