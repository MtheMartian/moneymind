import {useEffect, useState} from 'react';
import { TableMetadata } from '../../components/custom-table/custom-table-types';
import { TypeCustomTable } from '../../components/custom-table/custom-table-types';

function Dashboard(): JSX.Element{
  const mockTableMetadata: TableMetadata = {
    totalAmount: 1000000,
    budget: 1500000,
    userId: "testId1",
    month: 7,
    year: 2024,
    tableId: "testTableId1"
  }
  const [currentMonth, setCurrentMonth] = useState<TableMetadata | null>(null);
  const [currentMonthTableEntries, setCurrentMonthTableEntries] = useState<TypeCustomTable["customTableEntry"][]>([]);

  const months: string[] = ["January", "February", "March", "April", "May",
                            "June", "July", "August", "September", "October",
                            "November", "December"];

  useEffect(()=>{
    setCurrentMonth(mockTableMetadata);
  }, [])

  return(
    <div>
      <p>
        {`${months[currentMonth!.month - 1]} ${currentMonth!.year} - Summary`}
      </p>
      <p>
        {`Budget: ${currentMonth!.budget}`}
      </p>
      <p>
        {`Total Cost: ${currentMonth!.totalAmount}`}
      </p>
      <ol>
        {currentMonthTableEntries.map(entry =>
          <li>{`${entry.entryName} -> ${(entry.entryAmount / currentMonth!.totalAmount) * 100}%`}</li>
        )}
      </ol>
    </div>
  )
}