import '../components/custom-table/custom-table.css';
import { Stack } from '../../../ts/dsa';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';
import { useState, useEffect } from 'react';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';
import { CustomBST } from '../../../ts/dsa';

const dailyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function DailyTable(){
  const [dailyBST, setDailyBST] = useState<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());
  const [dailySubcategoriesBST, setDailySubcategoriesBST] = useState<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());

  useEffect(() =>{
    
    return()=>{
      setDailyBST(new CustomBST());
      setDailySubcategoriesBST(new CustomBST());
    }
  },[]);


  return(
    <CustomTable title="Daily Manager" tableUse="daily" stack={dailyStack} categoryBST={dailyBST} 
                  subcategoryBST={dailySubcategoriesBST} />
  )
}

export default DailyTable;