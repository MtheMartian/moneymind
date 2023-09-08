import { useRef, useState, useEffect, MouseEventHandler } from 'react';
import '../css/moneymanager/table.css';
import { TypeCustomTable } from '../types/custom-table-types';

function CustomTableSubCategories(){
  return(
    <div>

    </div>
  )
}


function CustomTableBody(props: {tableCategoryMap: TypeCustomTable["categoryMap"], toggleEdit: boolean}){
  const [showSubCategories, setShowSubCategories] = useState<JSX.Element | null>(null);
  const [categories, setCategories] = useState<TypeCustomTable["categoryEntries"]>([]);
  const [showInsertInputs, setShowInsertInputs] = useState<boolean>(false);

  function deleteButtonHandler(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>){
    const element: HTMLButtonElement = e.currentTarget;
    const key: string | null = element.getAttribute("data-id");

    if(key){
      props.tableCategoryMap.delete(key);
      console.log(...props.tableCategoryMap.entries());
      setCategories(prev => prev = Array.from(props.tableCategoryMap.entries()));
    }
  }

  // Check if map size is > 0 plus sign underneath category, else show inputs.

  function InsertCategory(){
    const categoryInput = useRef<HTMLInputElement>(null);
    const amountInput = useRef<HTMLInputElement>(null);
    const uId: string = uniqueId();

    function addCategoryButtonHandler(){
      props.tableCategoryMap.set(uId, {categoryInput.current!.value, Number(amountInput.current!.value)});
  
      categoryInput.current!.value = amountInput.current!.value = "";
      setShowInsertInputs(prev => prev = false);
      setCategories(prev => prev = Array.from(props.tableCategoryMap.entries()));
    }

    return(
      <div>
        <input type="text" placeholder="Category" ref={categoryInput}/>
        <input type="text" placeholder="Amount" ref={amountInput}/>
        <button onClick={addCategoryButtonHandler}>Add</button>
      </div>
    )
  }

  function uniqueId(): string{
    return Date.now().toString(36) + Math.ceil(Math.random() * 1000000).toString(36);
  }

  useEffect(()=>{
    setCategories(prev => prev = Array.from(props.tableCategoryMap.entries()));

    return()=>{
      setCategories(prev => prev = []);
      setShowInsertInputs(prev => prev = false);
    }

  }, [props.tableCategoryMap, props.toggleEdit])

  function displayInsertInputs(){
    if(!showInsertInputs){
      setShowInsertInputs(prev => prev = true);
    }
    else{
      setShowInsertInputs(prev => prev = false);
    }
  }

  function CategoryCells(props: {category: string, amount: number, uId: string, 
                          tableCategoryMap: TypeCustomTable["categoryMap"]}){
    const [toggleEdit, setToggleEdit] = useState<boolean>(false);
    const categoryInput = useRef<HTMLInputElement>(null);
    const amountInput = useRef<HTMLInputElement>(null);

    function showCellOptions(): void{
      if(!toggleEdit){
        setToggleEdit(prev => prev = true);
      }
      else{
        setToggleEdit(prev => prev = false);
      }
    }

    function editCell(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void{
      const key: string = e.currentTarget.getAttribute("data-id")!;
      const updatedElement: {category: string, totalAmount: number} = {}

      props.tableCategoryMap.set(key, updatedElement);
      showCellOptions();
    }

    useEffect(()=>{
      setToggleEdit(prev => prev = false);
      
      return()=>{
        setToggleEdit(prev => prev = false);
      }
    }, []);

    return(
      <div data-id={props.uId}>
        <div id={props.uId}>
          <div onClick={showCellOptions}>
            <input type="text" defaultValue={props.category} ref={categoryInput} />
            <input type="text" defaultValue={props.amount} ref={amountInput} />
          </div>
          {toggleEdit ? 
          <div>
            <button data-id={props.uId} onClick={deleteButtonHandler}>X</button>
            <button data-id={props.uId} onClick={editCell}>{">"}</button>
          </div>: null}
        </div>
        {showSubCategories}
      </div>
    )
  }

  return(
    <div>
      {props.tableCategoryMap.size < 1 ?  <InsertCategory /> : null}
      {categories.map((category, index) =>
      <div data-id={category[0]}>
        <div id={category[0]}>
          <div onClick={showCellOptions}>
            <input type="text" defaultValue={props.category} ref={categoryInput} />
            <input type="text" defaultValue={props.amount} ref={amountInput} />
          </div>
          {toggleEdit ? 
          <div>
            <button data-id={category[0]} onClick={deleteButtonHandler}>X</button>
            <button data-id={category[0]} onClick={editCell}>{">"}</button>
          </div>: null}
        </div>
        {index + 1 === categories.length ? null : <button onClick={displayInsertInputs}>{"+"}</button>}
        {showSubCategories}
      </div>
      )}
      {showInsertInputs ? <InsertCategory /> : null}
    </div>
  )
}

function CustomTable(){
  // Ref Variables
  const tableCategoryMap = useRef<TypeCustomTable["categoryMap"]>(new Map());
  const subCategoryMap = useRef<TypeCustomTable["subCategoryMap"]>(new Map());

  // States
  const [subCategories, setSubCategories] = useState<TypeCustomTable["subCategoryEntries"]>([]);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);

  // Button Functions
  function editButtonHandler(){
    if(toggleEdit){
      setToggleEdit(prev => prev = false);
    }
    else{
      setToggleEdit(prev => prev = true);
    }
  }

  return(
    <div>
      <div>
        <button onClick={editButtonHandler}>Edit</button>
      </div>
      <CustomTableBody tableCategoryMap={tableCategoryMap.current} toggleEdit={toggleEdit} />
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
