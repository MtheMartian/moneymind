import { useRef, useState, useEffect, useMemo} from 'react';
import './custom-table.css';
import { TypeCustomTable } from '../../../types/custom-table-types';
import { user } from '../../../data/user';

function uniqueId(): string{
  const prefix: string = "uniqueId-";
  const timeStamp: string = Date.now().toString(36);
  let counter: number = 0;
  return `${prefix}${timeStamp}-${counter++}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
}

function CustomTableBottom(props: {tableMap: TypeCustomTable["categoryMap"] | null, currUser: typeof user | null}){
  const budgetInput = useRef<HTMLInputElement>(null);
  const [balance, setBalance] = useState<number>(0);
  const grandTotal = useMemo<number>(()=>{
    let addThemUp: number = 0;
    if(props.tableMap){
      Array.from(props.tableMap.values()).forEach(entry =>{
        addThemUp += entry.totalAmount;
      });
    }
    return addThemUp;
  }, [props.tableMap]);

  useEffect(()=>{
    setBalance(Number(budgetInput.current!.value) - grandTotal);

    return()=>{
      setBalance(prev => prev = 0);
    }
  }, [props.tableMap])

  function amountLeft(): void{
    const remainingBalance: number = Number(budgetInput.current!.value) - grandTotal;
    setBalance(prev => prev = remainingBalance);
  }

  return(
    <div id="custom-table-bottom">
      <p>Total: {grandTotal}</p>
      <input type="number" placeholder='Budget' defaultValue={props.currUser?.budget} ref={budgetInput} onChange={amountLeft}/>
      <p>Balance: {balance}</p>
    </div>
  )
}

function CustomTableBody(props: {tableMap: TypeCustomTable["categoryMap"] | null, 
                          toggleEdit: boolean, setTableMap: Function, currentUser: typeof user | null}){

  const categories = useMemo<TypeCustomTable["categoryEntries"]>(()=>{
    return props.tableMap ? Array.from(props.tableMap!.entries()) : [];
  }, [props.tableMap]);

  function deleteButtonHandler(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void{
    const id: string = e.currentTarget.getAttribute("data-id")!
    props.tableMap!.delete(id);
    const newTableMap = new Map(props.tableMap);
    props.setTableMap(newTableMap);
  }

  function highlightCell(amount: number): string{
    const budget: number = props.currentUser!.budget;
    if(amount >= budget * 0.2 && amount < budget * 0.5){
      return "inset 1px 1px 10px rgba(255, 255, 0, 0.77)";
    }
    else if(amount >= budget * 0.5){
      return "inset 1px 1px 5px rgba(255, 0, 0, 0.77)";
    }

    return "";
  }

  return(
    <div id="custom-table-body">
      {categories.map((category) =>
        <div data-id={category[0]} key={category[0]}>
          <div className="custom-table-body-cells" style={props.currentUser ? {boxShadow: highlightCell(category[1].totalAmount)} : undefined}>
            <input type="text" defaultValue={category[1].category} disabled={props.toggleEdit ? undefined : true} />
            <input type="text" defaultValue={category[1].totalAmount} disabled={props.toggleEdit ? undefined : true} />
          </div>
          {props.toggleEdit ? 
          <div>
            <button data-id={category[0]} onClick={deleteButtonHandler}>X</button>
          </div> : null}
        </div>
      )}
    </div>
  );
}


function CustomTable(){
  const [tableMap, setTableMap] = useState<TypeCustomTable["categoryMap"] | null>(null);
  const [toggleInsert, setToggleInsert] = useState<boolean>(false);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<typeof user | null>(null);

  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    setTableMap(prev => prev = new Map<string, {category: string, totalAmount: number}>());

    return()=>{
      setTableMap(prev => prev = null);
    }
  }, [])

  useEffect(()=>{
    setCurrentUser(prev => prev = user);

    return()=>{
      setCurrentUser(prev => prev = null);
    }
  },[])

  function displayInsert(): void{
    if(toggleInsert){
      setToggleInsert(prev => prev = false);
    }
    else{
      setToggleInsert(prev => prev = true);
    }
  }

  function displayEditOptions(){
    if(toggleEdit){
      setToggleEdit(prev => prev = false);
    }
    else{
      setToggleEdit(prev => prev = true);
    }
  }

  function insertButtonHandler(): void{
    const uId: string = uniqueId();
    const newTableMap: TypeCustomTable["categoryMap"] = new Map(tableMap);
    newTableMap.set(uId, {category: categoryInput.current!.value, totalAmount: Number(amountInput.current!.value)});
    setTableMap(newTableMap);
    displayInsert();
  }

  return(
    <div id="custom-table">
      <div id="custom-table-menu">
        <button onClick={displayEditOptions}>Edit</button>
        {toggleInsert ? 
        <div id="custom-table-insert">
          <input type="text" placeholder="Category" ref={categoryInput} />
          <input type="number" placeholder="Amount" ref={amountInput} />
          <div id="custom-table-insert-options">
            <button onClick={insertButtonHandler}>{">"}</button>
            <button onClick={displayInsert}>Cancel</button>
          </div>
        </div> :
        <button onClick={displayInsert}>Insert</button>}
      </div>
      <CustomTableBody tableMap={tableMap} toggleEdit={toggleEdit} setTableMap={setTableMap} currentUser={currentUser}/>
      <CustomTableBottom tableMap={tableMap} currUser={currentUser}/>
    </div>
  )
}

export default CustomTable