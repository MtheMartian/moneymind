import { useRef, useState, useEffect, useMemo, SyntheticEvent, ChangeEvent, MouseEventHandler} from 'react';
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

function CustomTableBottom(props: {tableMap: TypeCustomTable["categoryMap"] | null, currUser: typeof user | null,
                            setTableMap: Function}){
  // ******* States ******* //
  const [balance, setBalance] = useState<number>(0);
  const [budgetInputEntered, setBudgetInputEntered] = useState<string>("0");

  // ******* References ******* //
  const budgetInput = useRef<HTMLInputElement>(null);

  // ******* Memo ******* //
  const grandTotal = useMemo<number>(()=>{
    let addThemUp: number = 0;
    if(props.tableMap){
      Array.from(props.tableMap.values()).forEach(entry =>{
        addThemUp += entry.totalAmount;
      });
    }
    return addThemUp;
  }, [props.tableMap]);

  // ******* Functions ******* //
  function amountLeft(): void{
    const remainingBalance: number = Number(budgetInput.current!.value) - grandTotal;
    setBalance(prev => prev = remainingBalance);
  }

  function editInputs(e: ChangeEvent<HTMLInputElement>): void{
    let input: CompositionEvent = e.nativeEvent as CompositionEvent;
    let budgetStr: string = budgetInputEntered;
    const newMap = new Map(props.tableMap!);
    if(input.data === null){
      budgetStr = budgetStr.slice(0, -1);
      setBudgetInputEntered(prev => prev = budgetStr);
    }
    else if(input.data === " " || input.data === ","){
      budgetStr = budgetStr + ".";
      setBudgetInputEntered(prev => prev = budgetStr);
    }
    else{
      budgetStr = budgetStr + input.data;
      setBudgetInputEntered(prev => prev = budgetStr);
    }
    
    amountLeft();
    props.setTableMap(newMap);
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    if(props.currUser){
      setBudgetInputEntered(prev => prev = props.currUser!.budget.toString());
    }

    return()=>{
      setBudgetInputEntered(prev => prev = "0");
    }
  }, [props.currUser])

  useEffect(()=>{
    console.log(budgetInputEntered);
    setBalance(Number(budgetInput.current!.value) - grandTotal);

    return()=>{
      setBalance(prev => prev = 0);
    }
  }, [props.tableMap])

  return(
    <div id="custom-table-bottom">
      <p><span style={{fontWeight: 700}}>Total:</span> {grandTotal}</p>
      <div>
        <label style={{fontWeight: 700}}>Budget:</label>
        <input type="text" inputMode="numeric" pattern='[0-9]*'
                placeholder='Budget' value={budgetInputEntered} 
                ref={budgetInput} onChange={editInputs} />
      </div>
      <p><span style={{fontWeight: 700}}>Balance:</span> {balance}</p>
    </div>
  )
}

function SubCategoryCell(props:{id: string, subCategory: string, amount: number,
                          subCategoryMap: TypeCustomTable["subCategoryMap"] | null, setSubCategoryMap: Function,
                          tableMap: TypeCustomTable["categoryMap"] | null, setTableMap: Function,
                          toggleEdit: boolean}){

  // ******* Button Handlers ******* //
  function deleteButtonHandler(e: SyntheticEvent<HTMLButtonElement, MouseEvent>){
    const id: string = e.currentTarget.getAttribute("data-id")!;

    props.subCategoryMap!.delete(id);
    const newMap = new Map(props.subCategoryMap);
    props.setSubCategoryMap(newMap);
  }
                            
  return(
    <div className={`custom-table-body-cell subcategory-cell ${props.toggleEdit ? null : "disable-hover"}`}>
      <input type="text" value={props.subCategory} disabled={props.toggleEdit ? undefined : true} />
      <input type="number" value={props.amount} disabled={props.toggleEdit ? undefined : true} />
      {props.toggleEdit ? 
      <div className="custom-table-body-cell-options">
        <button data-id={props.id} onClick={deleteButtonHandler} className="custom-table-body-delete-button">
          <img src="./src/assets/manager-icons/delete-48px.svg" alt="delete" className="manager-icons" />
        </button>
      </div> : null}
    </div>
  )
}

function SubCategory(props: {tableMap: TypeCustomTable["categoryMap"] | null, 
                      subCategoryMap: TypeCustomTable["subCategoryMap"] | null, 
                      setSubCategoryMap: Function, toggleEdit: boolean, categoryId: string | null,
                      setTableMap: Function}){
                        
 // ******* States ******* //
  const [categorySelected, setCategorySelected] = useState<string | null>(null);
  const [addSubCategoryForm, setAddSubCategoryForm] = useState<boolean>(false);

  // ******* References ******* //
  const subCategoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

   // ******* Memo ******* //
   const subCategories = useMemo<TypeCustomTable["subCategoryEntries"]>(()=>{
    return props.subCategoryMap ? Array.from(props.subCategoryMap.entries()) : [];
  }, [props.subCategoryMap]);
  
  // ******* Button Handlers ******* //
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
    setAddSubCategoryForm(prev => prev = false);
  }

  function displayAddSubCategoryForm(): void{
    if(addSubCategoryForm){
      setAddSubCategoryForm(prev => prev = false);
    }
    else{
      setAddSubCategoryForm(prev => prev = true);
    }
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    if(props.categoryId){
      const currentCategory: string = props.tableMap!.get(props.categoryId)!.category;
      setCategorySelected(prev => prev = currentCategory);
    }

    return()=>{
      setCategorySelected(prev => prev = null);
    }
  }, [props.categoryId]);

  return(
    <div id="custom-table-body-subcategory">
      <div id="custom-table-body-subcategory-header">
        {categorySelected ? <h2>{`${categorySelected}'s Subcategories`}</h2> : null}
        {categorySelected ? 
        <button className="manager-buttons" onClick={displayAddSubCategoryForm}>Add Entry</button> 
        : null}
      </div>
      {addSubCategoryForm ? 
      <div className="overlay">
        <div id="add-subcategory-form">
          <p>Add Entry</p>
          <div>
            <label>Entry</label>
            <input type="text" placeholder="SubCategory" ref={subCategoryInput}/>
          </div>
          <div>
            <label>Amount</label>
            <input type="number" placeholder="Amount" ref={amountInput}/>
          </div>
          <div>
            <button onClick={addButtonHandler}>Add</button>
            <button onClick={displayAddSubCategoryForm}>Cancel</button>
          </div>
        </div>
      </div> : null}
      <div id="custom-table-body-subcategory-content">
        {categorySelected ? null : <p>Select a category to view/add subcategories...</p>}
        {subCategories.length === 0 && categorySelected ? <p>Empty</p> : null}
        {subCategories.map(subCategory =>
          subCategory[1].categoryId === props.categoryId ? 
          <SubCategoryCell id={subCategory[0]} subCategory={subCategory[1].subCategory} amount={subCategory[1].amount}
                          subCategoryMap={props.subCategoryMap} setSubCategoryMap={props.setSubCategoryMap}
                          toggleEdit={props.toggleEdit} tableMap={props.tableMap} setTableMap={props.setTableMap}
                          key={subCategory[0]}/> : null
        )}
      </div>
    </div>
  )
}

function CustomTableBodyCell(props:{id: string, category: string, amount: number,
                              toggleEdit: boolean, tableMap: TypeCustomTable["categoryMap"] | null,
                              setTableMap: Function, currentUser: typeof user | null, 
                              displaySubCategories: MouseEventHandler<HTMLDivElement>}){

   // ******* Functions ******* //                              
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

   // ******* Button Handlers ******* //
  function editEntryHandler(e: ChangeEvent<HTMLInputElement>){
    if(e.nativeEvent === null){
      e.currentTarget.value = "poop";
    }
    console.log(e.nativeEvent);
  }

  function deleteButtonHandler(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void{
    const id: string = e.currentTarget.getAttribute("data-id")!
    props.tableMap!.delete(id);
    const newTableMap = new Map(props.tableMap);
    props.setTableMap(newTableMap);
  }

  return(
    <div data-id={props.id} className="custom-table-body-cell non-subcategory-cell clickable " 
          style={props.currentUser ? {boxShadow: highlightCell(props.amount)} : undefined}
            onClick={props.toggleEdit ? undefined : props.displaySubCategories}>
      <input type="text"value={props.category} disabled={props.toggleEdit ? undefined : true} />
      <input type="number" value={props.amount} 
              disabled={props.toggleEdit ? undefined : true} onChange={editEntryHandler} />
      {props.toggleEdit ? 
        <div className="custom-table-body-cell-options">
          <button data-id={props.id} onClick={deleteButtonHandler} className="custom-table-body-delete-button">
            <img src="./src/assets/manager-icons/delete-48px.svg" alt="delete" className="manager-icons" />
          </button>
        </div> : null}
    </div>
  )
}

function CustomTableBody(props: {tableMap: TypeCustomTable["categoryMap"] | null, 
                          toggleEdit: boolean, setTableMap: Function, currentUser: typeof user | null}){

   // ******* States ******* //
  const [subCategoryMap, setSubCategoryMap] = useState<TypeCustomTable["subCategoryMap"] | null>(null);

   // ******* References ******* //
  const categoryId = useRef<string | null>(null);

   // ******* Memo ******* //
  const categories = useMemo<TypeCustomTable["categoryEntries"]>(()=>{
    return props.tableMap ? Array.from(props.tableMap!.entries()) : [];
  }, [props.tableMap]);

   // ******* Button Handlers ******* //
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
      <div id="custom-table-body-content">
        <div id="custom-table-body-cells">
          <div id="custom-table-body-sections">
            <p>Category</p>
            <p>Amount</p>
            <p>Initial Amount</p>
            <p>Last Updated</p>
          </div>
          {categories.map((category) =>
            <CustomTableBodyCell id={category[0]} category={category[1].category} amount={category[1].totalAmount}
            currentUser={props.currentUser} tableMap={props.tableMap} setTableMap={props.setTableMap}
            displaySubCategories={displaySubcategories} toggleEdit={props.toggleEdit} key={category[0]} />
          )}
        </div>
        <SubCategory tableMap={props.tableMap} toggleEdit={props.toggleEdit} 
                      categoryId={categoryId.current} setSubCategoryMap={setSubCategoryMap}
                      subCategoryMap={subCategoryMap} setTableMap={props.setTableMap}/>
      </div>
    </div>
  );
}


function CustomTable(){
  // ******* States ******* //
  const [tableMap, setTableMap] = useState<TypeCustomTable["categoryMap"] | null>(null);
  const [toggleInsert, setToggleInsert] = useState<boolean>(false);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<typeof user | null>(null);

  // ******* References ******* //
  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  // ******* Button Handlers ******* //
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

  // ******* UseEffects ******* //
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

  return(
    <div id="custom-table">
      <div id="custom-table-title">
        <h1>Money Manager</h1>
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
      <CustomTableBottom tableMap={tableMap} currUser={currentUser} setTableMap={setTableMap}/>
    </div>
  )
}

export default CustomTable