import { useRef, useState, useEffect, useMemo, 
  SyntheticEvent, ChangeEvent, MouseEventHandler, useCallback} from 'react';
import '../custom-table/custom-table.css';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';
import { user } from '../../../data/user';
import { editInputs, uniqueId } from '../manager';
import { Stack } from '../../../ts/dsa';
import '../manager.css';
import CustomTable from '../components/custom-table/CustomTable';
import { oldData } from '../components/custom-table/custom-table';

const dailyStack: Stack<typeof oldData> = new Stack<typeof oldData>();

function DailyTable(){
  return(
    <CustomTable title="Daily Manager" tableUse="daily" stack={dailyStack} />
  )
}