import { useRef, useEffect } from "react";

type TableMetada = {
  totalAmount: number,
  budget: number,
  userId: string,
  date: number
}

function Band(props: {currTable: TableMetada}): JSX.Element{
  const bandTotal = useRef<HTMLDivElement>(null);
  const bandGoal = useRef<HTMLDivElement>(null);

  function growBand(): void{
    if(props.currTable.totalAmount >= props.currTable.budget){
      
    }
  }

  useEffect(()=>{

  }, []);

  return(
    <div>
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