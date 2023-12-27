import '../components/custom-table/custom-table.css';
import { Stack, CustomBST, BSTNode } from '../../../ts/dsa';
import { RequestQueue } from '../../../ts/general-classes';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';
import { useEffect, useState, useRef } from 'react';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';

const monthlyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function MonthlyTable(){
  const asyncQueue: RequestQueue = new RequestQueue();
  const monthlyBST = useRef<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());
  const monthlySubcategoriesBST = useRef<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());

  const [successfulRequest, setSuccessfulRequest] = useState<boolean>(false);

  useEffect(()=>{
    async function retrieveDataFromDB(): Promise<void>{
      const response: Response = await fetch("https://localhost:7158/api/tables");

      if(response.ok){
        const returnedData: {} = await response.json();

        console.log(returnedData);

        for(let i: number = 0; i < Object.entries(returnedData).length; i++){
          const currentItem: TypeCustomTable["customTableEntry"] = Object.entries<TypeCustomTable["customTableEntry"]>(returnedData)[i][1];

          if(currentItem.isCategory){
            monthlyBST.current.insert([0, 0, 0], currentItem, Object.entries(returnedData)[i][0], 0); 
          }
          else{
            monthlySubcategoriesBST.current.insert([0, 0, 0], currentItem, Object.entries(returnedData)[i][0], 0); 
          }
        }

        monthlyBST.current.traverse("desc").forEach(node =>{
          console.log(`Category: ${node.item.linkId}`);
        })

        monthlySubcategoriesBST.current.traverse("desc").forEach(node =>{
          console.log(`Subcategories: ${node.item.linkId}`);
        })

        setSuccessfulRequest(prev => prev = true);
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