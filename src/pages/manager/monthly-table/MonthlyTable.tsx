import '../components/custom-table/custom-table.css';
import { Stack } from '../../../ts/dsa';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';

const monthlyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function MonthlyTable(){
  return(
    <CustomTable title="Monthly Manager" tableUse="monthly" stack={monthlyStack} />
  )
}

export default MonthlyTable;