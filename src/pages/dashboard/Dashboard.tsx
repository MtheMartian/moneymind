import {useEffect, useState, useMemo} from 'react';
import { Link } from 'react-router-dom';
import { TableMetadata } from '../../components/custom-table/custom-table-types';
import { TypeCustomTable } from '../../components/custom-table/custom-table-types';
import './dashboard.css';
import '../manager/manager.css';

function Dashboard(): JSX.Element{
  const mockTableMetadata: TableMetadata = {
    totalAmount: 1000000,
    budget: 1500000,
    userId: "testId1",
    month: 7,
    year: 2024,
    tableId: "testTableId1",
    entries: 100
  }
  const [currentMonth, setCurrentMonth] = useState<TableMetadata | null>(null);
  const [currentMonthTableEntries, setCurrentMonthTableEntries] = useState<TypeCustomTable["customTableEntry"][]>([]);

  const months: string[] = ["January", "February", "March", "April", "May",
                            "June", "July", "August", "September", "October",
                            "November", "December"];

  const overviewItems = useMemo<{subtitle:string, value: string}[]>(()=>{
    let tempTablemetadataArr: {subtitle:string, value: string}[] = [];
    if(!currentMonth) return tempTablemetadataArr;

    tempTablemetadataArr = [{subtitle: "Budget", value: String(mockTableMetadata.budget)},
      {subtitle: "Total Cost", value: String(mockTableMetadata.totalAmount)},
      {subtitle: "Entries", value: String(mockTableMetadata.entries)}
    ];

    return tempTablemetadataArr;
    
  }, [currentMonth]);

  useEffect(()=>{
    setCurrentMonth(mockTableMetadata);
  }, [])

  return(
    <div id="overview">
      {currentMonth ? 
      <>
      <Link to="">
        <h2>
          {`${months[currentMonth.month - 1]} ${currentMonth.year} - Summary`}
        </h2>
      </Link>
      <div id="overview-grid">
        {overviewItems.map((item, idx)=> 
          <div key={`overview-item-key${idx}`}>
            <h3 className="overview-subtitles">{item.subtitle}</h3>
            <p>{item.value}</p>
          </div>
        )}
        <div>Compared to other months (function)</div>
        <div>Compared to last month</div>
        <div>{currentMonth!.totalAmount - currentMonth.budget}</div>
      </div>
      <ol>
        {currentMonthTableEntries.map((entry, idx) =>
          idx <= 4 ? <li>{`${entry.entryName} -> ${(entry.entryAmount / currentMonth.totalAmount) * 100}%`}</li> : null
        )}
      </ol>
      </> : null}
    </div>
  )
}

export default Dashboard;