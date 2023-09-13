import { useRef, useState, useEffect, useMemo} from 'react';
import '../css/moneymanager/table.css';
import { TypeCustomTable } from '../types/custom-table-types';

function uniqueId(): string{
  return Date.now().toString(36) + Math.ceil(Math.random() * 1000000).toString(36);
}

function CustomTableBody(props: {tableMap: TypeCustomTable["categoryMap"] | null, 
                          toggleEdit: boolean}){
  const [categories, setCategories] = useState<TypeCustomTable["categoryEntries"]>([]);

  useEffect(()=>{
    setCategories(Array.from(props.tableMap?.entries() || []));

    return()=>{
      setCategories(prev => prev = []);
    }
  }, [props.tableMap])

  function deleteButtonHandler(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void{
    const id: string = e.currentTarget.getAttribute("data-id")!
    props.tableMap!.delete(id);
    console.log(...props.tableMap!.entries());
    setCategories(prev => prev.filter(category => category[0] !== id));
  }

  return(
    <div id="custom-table-body">
      {categories.map((category, index) =>
        <div data-id={category[0]} key={index}>
          <input type="text" defaultValue={category[1].category} disabled />
          <input type="text" defaultValue={category[1].totalAmount} disabled />
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

  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    setTableMap(prev => prev = new Map<string, {category: string, totalAmount: number}>());

    return()=>{
      setTableMap(prev => prev = null);
    }
  }, [])

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
      <CustomTableBody tableMap={tableMap} toggleEdit={toggleEdit} />
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
