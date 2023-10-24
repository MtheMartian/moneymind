import '../components/custom-table/custom-table.css';
import { Stack, CustomBST } from '../../../ts/dsa';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';
import { useEffect, useState } from 'react';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';

const monthlyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function MonthlyTable(){
  const [monthlyTable, setMonthlyTable] = useState<TypeCustomTable["categoryMap"] | null>(null);
  const [subcategories, setSubcategories] = useState<TypeCustomTable["subCategoryMap"] | null>(null);

  useEffect(()=>{
    const retrievedCategories = sessionStorage.getItem("linkMap");
    if(retrievedCategories){
      const newMap = new Map();
      const categoryArr: TypeCustomTable["categoryEntries"] = Array.from(JSON.parse(retrievedCategories));

      categoryArr.forEach(category=>{
        newMap.set(category[0], category[1]);
      });

      setMonthlyTable(prev => prev = newMap);
    }
    else{
      setMonthlyTable(prev => prev = new Map());
    }

    setSubcategories(prev => prev = new Map());

    return()=>{
      setMonthlyTable(prev => prev = null);
      setSubcategories(prev => prev = null);
    }
  }, [])
  return(
    <CustomTable title="Monthly Manager" tableUse="monthly" stack={monthlyStack} currentSubcategories={subcategories}
                  currentTable={monthlyTable} />
  )
}

export default MonthlyTable;