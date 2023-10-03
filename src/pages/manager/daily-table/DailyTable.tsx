import '../components/custom-table/custom-table.css';
import { Stack } from '../../../ts/dsa';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';
import { useEffect, useState } from 'react';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';

const dailyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function DailyTable(){
  const [dailyTable, setDailyTable] = useState<TypeCustomTable["categoryMap"] | null>(null);
  const [subcategories, setSubcategories] = useState<TypeCustomTable["subCategoryMap"] | null>(null);

  useEffect(()=>{
    setDailyTable(prev => prev = new Map());
    setSubcategories(prev => prev = new Map());

    return()=>{
      setDailyTable(prev => prev = null);
      setSubcategories(prev => prev = null);
    }
  }, [])

  return(
    <CustomTable title="Daily Manager" tableUse="daily" stack={dailyStack} currentTable={dailyTable} 
                  currentSubcategories={subcategories} />
  )
}

export default DailyTable;