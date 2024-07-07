import { useRef, useEffect } from "react";

type TableMetada = {
  totalAmount: number,
  budget: number,
  userId: string,
  date: number
}

function Band(props: {currTable: TableMetada, maxNum: number}): JSX.Element{
  const bandTotal = useRef<HTMLDivElement>(null);
  const bandGoal = useRef<HTMLDivElement>(null);
  const actualBand = useRef<HTMLDivElement>(null);

  function growBand(): void{
    if(props.currTable.totalAmount >= props.currTable.budget){
      const tempNum: number = props.currTable.totalAmount - props.currTable.budget;

      if(bandTotal.current && bandGoal.current){
        bandTotal.current.style.height = `${(tempNum / props.maxNum) * 100}%`;

        bandGoal.current.style.height = `${(props.currTable.budget / props.maxNum) * 100}%`;
      }
    }
    else{
      const tempNum: number = props.currTable.budget - props.currTable.totalAmount;
    }
  }

  useEffect(()=>{

  }, []);

  return(
    <div ref={actualBand}>
      <div ref={bandTotal}>
        <p>Total</p>
      </div>
      <div ref={bandGoal}>
        <p>Goal</p>
      </div>
    </div>
  )
}

function XAxis(): JSX.Element{
  return(
    <div>
      <p></p>
    </div>
  )
}

function YAxis(): JSX.Element{
  return(
    <div>
      <p></p>
    </div>
  )
}

function Dashboard(): JSX.Element{
  return(
    <div>
      
    </div>
  )
}