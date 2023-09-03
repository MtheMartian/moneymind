import { useRef, useState } from 'react';
import '../css/moneymanager/table.css';

function EditTableCategory(props: {tableCategoryKey: string, tableMap: Map<string, {title: string, amount: number}>}){
  const tableCategoryMap = useRef<Map<string, {title: string, amount: number}[]>>(new Map());
  function categoryDeleteButtonHandler(): void{
    props.tableMap.delete(props.tableCategoryKey);
  }

  return(
    <div>
      <div>
        <div>
          <input type="text" defaultValue={props.tableMap.get(props.tableCategoryKey)!.title} />
          <input type="text" defaultValue={props.tableMap.get(props.tableCategoryKey)!.amount} />
          <button>X</button>
          <button>Edit</button>
        </div>
      </div>
    </div>
  )
}

function CustomTableTop(props: {tableMap: Map<string, {title: string, amount: number}>, setTableBody: Function}){
  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  function addButtonHandler(): void{
    props.tableMap.set(`cell${props.tableMap.size}`, {title: categoryInput.current!.value,
                                                        amount: Number(amountInput.current!.value)});
    props.setTableBody(setTableBody());
  }

  function setTableBody(): JSX.Element{
    const entries: [string, {title: string, amount: number}][] = Array.from(props.tableMap.entries());
    return(
      <div>
        {entries.map((cell, index) =>
          <div id={cell[0]} key={`${index}cell`}>
            <p>{cell[1].title}</p>
            <p>{cell[1].amount}</p>
          </div>
        )}
      </div>
    )
  }

  return(
    <div>
      <div>
        <button>Daily</button>
        <button>Weekly</button>
        <button>Monthly</button>
        <button>Yearly</button>
      </div>
      <div>
        <input type="text" placeholder="Title" ref={categoryInput}/>
        <input type="text" placeholder="Amount" ref={amountInput}/>
        <button onClick={addButtonHandler}>Add</button>
      </div>
    </div>
  )
}

function CustomTableBottom(){
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

function CustomTable() {
  const tableMap = useRef<Map<string, {title: string, amount: number}>>(new Map());
  const [tableBody, setTableBody] = useState<JSX.Element | null>(null);

  return (
    <div>
      <CustomTableTop tableMap={tableMap.current} setTableBody={setTableBody} />
      <div>
        <span>Category</span>
        <span>Amount</span>
      </div>
      {tableBody ? tableBody : <div>loading...</div>}
    </div>
  )
}

function MoneyManager(){
  return(
    <main>
      <CustomTable />
    </main>
  )
}

export default MoneyManager
