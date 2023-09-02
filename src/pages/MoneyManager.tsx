import { useRef, useState } from 'react';



function TableTop(){
  function addButtonHandler(): void{
    
  }

  return(
    <div>
      <input type="text" placeholder="Title" />
      <input type="text" placeholder="Amount" />
      <button>Add</button>
    </div>
  )
}

function TableBottom(){
  return(
    <div>
      <label>Total:</label>
      <span>Total</span>
      <label>Budget:</label>
      <input type="text" placeholder="Budget" />
      <label>Left:</label>
      <span>Left</span>
    </div>
  )
}

function Table() {
  const tableMap = useRef<Map<string, {title: string, amount: number}>>(new Map());
  const [table, setTable] = useState<[string, {title: string, amount: number}][]>([]);

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={1}>Title</th>
          <th colSpan={1}>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        </tr>
      </tbody>
    </table>
  )
}

function MoneyManager(){
  return(
    <main>

    </main>
  )
}

export default MoneyManager
