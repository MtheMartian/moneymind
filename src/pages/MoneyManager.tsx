import { useRef, useState, useEffect, MouseEventHandler } from 'react';
import '../css/moneymanager/table.css';
import { TypeCustomTable } from '../types/custom-table-types';

function CustomTableSubCategories(){
  return(
    <div>

    </div>
  )
}


function CustomTableBody(props: {tableCategoryMap: TypeCustomTable["categoryMap"], categoryEntries: TypeCustomTable["categoryEntries"],
                          toggleEdit: boolean, setCategories: Function}){
  const [showSubCategories, setShowSubCategories] = useState<JSX.Element | null>(null);

  function deleteButtonHandler(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>){
    const element: HTMLButtonElement = e.currentTarget;
    const key: string | null = element.getAttribute("data-id");

    if(key){
      props.tableCategoryMap.delete(key);
      console.log(...props.tableCategoryMap.entries());
      props.setCategories(Array.from(props.tableCategoryMap.entries()));
    }
  }

  return(
    <div>
      {props.categoryEntries.map((category, index) =>
        <div data-id={category[0]} key={`cell${index}`}>
          <div id={category[0]}>
            <input type="text" defaultValue={category[1].category} disabled />
            <input type="text" defaultValue={category[1].totalAmount} disabled />
            {props.toggleEdit ? 
            <div>
              <button data-id={category[0]} onClick={deleteButtonHandler}>X</button>
              <button>{">"}</button>
            </div>: null}
          </div>
          {showSubCategories}
        </div>
      )}
    </div>
  )
}

function CustomTable(){
  // Ref Variables
  const tableCategoryMap = useRef<TypeCustomTable["categoryMap"]>(new Map());
  const subCategoryMap = useRef<TypeCustomTable["subCategoryMap"]>(new Map());
  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  // States
  const [categories, setCategories] = useState<TypeCustomTable["categoryEntries"]>([]);
  const [subCategories, setSubCategories] = useState<TypeCustomTable["subCategoryEntries"]>([]);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);

  // Button Functions
  function addCategoryButtonHandler(){
    tableCategoryMap.current.set(`category${tableCategoryMap.current.size}`, 
                                      {category: categoryInput.current!.value, totalAmount: Number(amountInput.current!.value)});

    categoryInput.current!.value = amountInput.current!.value = "";
    setCategories(prev => prev = Array.from(tableCategoryMap.current.entries()));
  }

  function editButtonHandler(){
    if(toggleEdit){
      setToggleEdit(prev => prev = false);
    }
    else{
      setToggleEdit(prev => prev = true);
    }
  }

  useEffect(()=>{
    return()=>{
      setCategories(prev => prev = []);
    }
  }, [])

  return(
    <div>
      <div>
        <input type="text" placeholder="Category" ref={categoryInput}/>
        <input type="text" placeholder="Amount" ref={amountInput}/>
        <button onClick={addCategoryButtonHandler}>Add</button>
        <button onClick={editButtonHandler}>Edit</button>
      </div>
      <CustomTableBody tableCategoryMap={tableCategoryMap.current} categoryEntries={categories} 
                            toggleEdit={toggleEdit} setCategories={setCategories}/>
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
