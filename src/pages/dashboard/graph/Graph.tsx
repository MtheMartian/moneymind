import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

type TableMetada = {
  totalAmount: number,
  budget: number,
  userId: string,
  month: number,
  year: number
}

function Band(props: {currTable: TableMetada, maxNum: number}): JSX.Element{
  const bandTotal = useRef<HTMLDivElement>(null);
  const bandGoal = useRef<HTMLDivElement>(null);
  const actualBand = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(bandTotal.current && bandGoal.current){
      if(props.currTable.totalAmount >= props.currTable.budget){
        const tempNum: number = props.currTable.totalAmount - props.currTable.budget;

        bandTotal.current.style.height = `${(tempNum / props.maxNum) * 100}%`;
  
        bandGoal.current.style.height = `${(props.currTable.budget / props.maxNum) * 100}%`;
      }
      else{
        const tempNum: number = props.currTable.budget - props.currTable.totalAmount;
        
        bandTotal.current.style.height = `${(props.currTable.totalAmount / props.maxNum) * 100}%`;
        bandGoal.current.style.height = `${(tempNum / props.maxNum) * 100}%`;
      }
    }
  }, []);

  return(
    <div ref={actualBand}>
      <div ref={bandTotal}>
        <p>Total</p>
        <p>{props.currTable.totalAmount}</p>
      </div>
      <div ref={bandGoal}>
        <p>Goal</p>
        <p>{props.currTable.budget}</p>
      </div>
    </div>
  )
}

function XAxis(props: {currYearTables: TableMetada[]}): JSX.Element{
  return(
    <div>
      {props.currYearTables.map((table, idx) =>
        <Link to=''>
          {table.month}
        </Link>
      )}
    </div>
  )
}

function YAxis(props: {currYearTables: TableMetada[]}): JSX.Element{
  return(
    <div>
      {props.currYearTables.map((table, idx) =>
        <p>
          {table.totalAmount}
        </p>
      )}
    </div>
  )
}

function Graph(): JSX.Element{
  return(
    <div>
      
    </div>
  )
}