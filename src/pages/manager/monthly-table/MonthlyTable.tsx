import '../components/custom-table/custom-table.css';
import { Stack, CustomBST } from '../../../ts/dsa';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';
import { useEffect, useState } from 'react';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';

const monthlyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function MonthlyTable(){
  const [monthlyBST, setMonthlyBST] = useState<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());
  const [monthlySubcategoriesBST, setMonthlySubcategoriesBST] = useState<CustomBST<TypeCustomTable["customTableEntry"]>>(new CustomBST());

  return(
    <CustomTable title="Monthly Manager" tableUse="monthly" stack={monthlyStack} categoryBST={monthlyBST}
                  subcategoryBST={monthlySubcategoriesBST} />
  )
}

export default MonthlyTable;