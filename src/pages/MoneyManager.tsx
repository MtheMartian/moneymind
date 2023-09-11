import { useRef, useState, useEffect} from 'react';
import '../css/moneymanager/table.css';
import { TypeCustomTable } from '../types/custom-table-types';

function uniqueId(): string{
  return Date.now().toString(36) + Math.ceil(Math.random() * 1000000).toString(36);
}

function CustomTableCell(props: {categoryKey: string, tableCategoryMap: TypeCustomTable["categoryMap"]}){
  const category = useRef<{category: string, totalAmount: number}>(props.tableCategoryMap.get(props.categoryKey)!);
  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  return(
    <div data-id={props.categoryKey}>
      <div>
        <input type="text" defaultValue={category.current.category} ref={categoryInput} />
        <input type="text" defaultValue={category.current.totalAmount} ref={amountInput} />
      </div>
    </div>
  )
}

function CustomTableBody(props: {tableCategoryMap: TypeCustomTable["categoryMap"]}){
  const [categoryKeys, setCategoryKeys] = useState<string[]>([]);

  useEffect(()=>{
    setCategoryKeys(prev => prev = Array.from(props.tableCategoryMap.keys()));
    console.log(...props.tableCategoryMap.keys());

    return()=>{
      setCategoryKeys(prev => prev = []);
    }

  }, [props.tableCategoryMap])

  return(
    <div>
      {categoryKeys.map((categoryKey , index) =>
        <CustomTableCell categoryKey={categoryKey} tableCategoryMap={props.tableCategoryMap} />
      )}
    </div>
  )
}

function CustomTable(){
  // Ref Variables
  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  // States
  const [tableCategoryMap, setTableCategoryMap] = useState<TypeCustomTable["categoryMap"]>(new Map());
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [toggleEntry, setToggleEntry] = useState<boolean>(false);

  // Button Functions
  function editButtonHandler(){
    if(toggleEdit){
      setToggleEdit(prev => prev = false);
    }
    else{
      setToggleEdit(prev => prev = true);
    }
  }

  function addEntryToggle(): void{
    if(toggleEntry){
      setToggleEntry(prev => prev = false);
    }
    else{
      setToggleEntry(prev => prev = true);
    }
  }

  function addEntryButtonHandler(): void{
    const uId: string = uniqueId();
    tableCategoryMap.set(uId, {category: categoryInput.current!.value, totalAmount: Number(amountInput.current!.value)});
    addEntryToggle();
    console.log(...tableCategoryMap.values());
    setTableCategoryMap(prev => prev = tableCategoryMap);
  }

  return(
    <div>
      <div id="custom-table-header">
      {!toggleEntry ? <button onClick={addEntryToggle}>Add Entry</button> : 
        <div>
          <input type="text" placeholder="Category" ref={categoryInput} />
          <input type="number" placeholder="Amount" ref={amountInput} />
          <button onClick={addEntryButtonHandler}>{">"}</button>
          <button onClick={addEntryToggle}>Cancel</button>
        </div>
      }
    </div>
      <CustomTableBody tableCategoryMap={tableCategoryMap} />
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
