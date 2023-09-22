import { useRef, useState, useEffect, useMemo, SyntheticEvent} from 'react';
import './custom-table.css';
import '../manager.css';
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

function SubCategory(props: {tableMap: TypeCustomTable["categoryMap"] | null, 
                      subCategoryMap: TypeCustomTable["subCategoryMap"] | null, 
                      setSubCategoryMap: Function, toggleEdit: boolean, categoryId: string | null,
                      setTableMap: Function}){

  const subCategoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  const subCategories = useMemo<TypeCustomTable["subCategoryEntries"]>(()=>{
    return props.subCategoryMap ? Array.from(props.subCategoryMap.entries()) : [];
  }, [props.subCategoryMap]);

  function addButtonHandler(){
    const uId: string = uniqueId();
    props.subCategoryMap!.set(uId, {subCategory: subCategoryInput.current!.value,
                                    amount: Number(amountInput.current!.value), 
                                    categoryId: props.categoryId!});
    const currentCategory = props.tableMap!.get(props.categoryId!)!;                               

    const newMap = new Map(props.subCategoryMap);
    props.setSubCategoryMap(newMap);
    props.tableMap!.set(props.categoryId!, {...currentCategory, totalAmount: currentCategory.totalAmount += Number(amountInput.current!.value)});
    const updatedCategoryMap = new Map(props.tableMap);
    props.setTableMap(updatedCategoryMap);
  }

  const [categorySelected, setCategorySelected] = useState<boolean>(false);

  useEffect(()=>{
    if(props.categoryId){
      setCategorySelected(prev => prev = true);
    }

    return()=>{
      setCategorySelected(prev => prev = false);
    }
  }, [props.categoryId]);

  function deleteButtonHandler(e: SyntheticEvent<HTMLButtonElement, MouseEvent>){
    const id: string = e.currentTarget.getAttribute("data-id")!;

    props.subCategoryMap!.delete(id);
    const newMap = new Map(props.subCategoryMap);
    props.setSubCategoryMap(newMap);
  }

  return(
    <div>
      {props.toggleEdit ? 
        <div>
          <input type="text" placeholder="Subcategory" ref={subCategoryInput}/>
          <input type="number" placeholder="Amount" ref={amountInput}/>
          <button onClick={addButtonHandler}>Add</button>
        </div> : null}
      <div>
        {categorySelected ? null : <p>Select a category to view/add subcategories...</p>}
        {subCategories.map(subCategory =>
          subCategory[1].categoryId === props.categoryId ? 
          <div data-id={subCategory[0]} key={subCategory[0]}>
          <div>
            <input type="text" defaultValue={subCategory[1].subCategory} disabled={props.toggleEdit ? undefined : true} />
            <input type="number" defaultValue={subCategory[1].amount} disabled={props.toggleEdit ? undefined : true} />
          </div>
          {props.toggleEdit ? 
          <div>
            <button data-id={subCategory[0]} onClick={deleteButtonHandler} className="custom-table-body-delete-button">
              <img src="./src/assets/manager-icons/delete-48px.svg" alt="delete" className="manager-icons" />
            </button>
          </div> : null}
        </div> : null
        )}
      </div>
    </div>
  )
}

function CustomTableBody(props: {tableMap: TypeCustomTable["categoryMap"] | null, 
                          toggleEdit: boolean, setTableMap: Function, currentUser: typeof user | null}){

  const [subCategoryMap, setSubCategoryMap] = useState<TypeCustomTable["subCategoryMap"] | null>(null);

  const categories = useMemo<TypeCustomTable["categoryEntries"]>(()=>{
    return props.tableMap ? Array.from(props.tableMap!.entries()) : [];
  }, [props.tableMap]);

  const categoryId = useRef<string | null>(null);

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


  function displaySubcategories(e: SyntheticEvent<HTMLDivElement, MouseEvent>){
    categoryId.current = e.currentTarget.getAttribute("data-id")!;
    const newMap: TypeCustomTable["subCategoryMap"] = new Map();
    console.log("I ran!");
    setSubCategoryMap(prev => prev = newMap);
  }


  return(
    <div id="custom-table-body">
      <div id="custom-table-body-header">
        <div id="custom-table-body-search-container">
          <img src="./src/assets/manager-icons/search-48px.svg" alt="search" className="manager-icons" />
          <input type="text" placeholder="Search..." />
        </div>
        <button id="custom-table-body-export-button">
          <img src="./src/assets/manager-icons/export-48px.svg" alt="export" className="manager-icons" />
          <p>Export</p>
        </button>
      </div>
      <div id="custom-table-body-sections">
        <p>Category</p>
        <p>Amount</p>
      </div>
      <div id="custom-table-body-cells">
      {categories.map((category) =>
        <div className="custom-table-body-entry" key={category[0]}>
          <div data-id={category[0]} className="custom-table-body-cell" style={props.currentUser ? {boxShadow: highlightCell(category[1].totalAmount)} : undefined}
              onClick={displaySubcategories}>
            <input type="text" defaultValue={category[1].category} disabled={props.toggleEdit ? undefined : true} />
            <input type="number" defaultValue={category[1].totalAmount} disabled={props.toggleEdit ? undefined : true} />
          </div>
          {props.toggleEdit ? 
          <div>
            <button data-id={category[0]} onClick={deleteButtonHandler} className="custom-table-body-delete-button">
              <img src="./src/assets/manager-icons/delete-48px.svg" alt="delete" className="manager-icons" />
            </button>
          </div> : null}
        </div>
      )}
      </div>
      <SubCategory tableMap={props.tableMap} toggleEdit={props.toggleEdit} 
                    categoryId={categoryId.current} setSubCategoryMap={setSubCategoryMap}
                    subCategoryMap={subCategoryMap} setTableMap={props.setTableMap}/>
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
      <div id="custom-table-title">
        <h2>Money Manager</h2>
        <div id="custom-table-menu">
          <button onClick={displayEditOptions} className="manager-buttons">Edit</button>
          {toggleInsert ? 
          <div id="custom-table-insert">
            <input type="text" placeholder="Category" ref={categoryInput} />
            <input type="number" placeholder="Amount" ref={amountInput} />
            <div id="custom-table-insert-options">
              <button onClick={insertButtonHandler} className="manager-buttons">Add</button>
              <button onClick={displayInsert} className="manager-buttons">Cancel</button>
            </div>
          </div> :
          <button onClick={displayInsert} className="manager-buttons">Insert</button>}
        </div>
      </div>
      <CustomTableBody tableMap={tableMap} toggleEdit={toggleEdit} setTableMap={setTableMap} currentUser={currentUser}/>
      <CustomTableBottom tableMap={tableMap} currUser={currentUser}/>
    </div>
  )
}

export default CustomTable