import { useRef, useState, useEffect, useMemo, 
        SyntheticEvent, ChangeEvent, MouseEventHandler, useCallback} from 'react';
import './custom-table.css';
import '../manager.css';
import { TypeCustomTable } from '../../../types/custom-table-types';
import { user } from '../../../data/user';
import { editInputs } from '../manager';

function uniqueId(): string{
  const prefix: string = "uniqueId-";
  const timeStamp: string = Date.now().toString(36);
  let counter: number = 0;
  return `${prefix}${timeStamp}-${counter++}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
}

let oldData: {oldTableMap: TypeCustomTable["categoryMap"], oldSubMap: TypeCustomTable["subCategoryMap"], 
              oldUserData: typeof user} = {
  oldTableMap: new Map(),
  oldSubMap: new Map(),
  oldUserData: {...user}
}

let tempBudget: number = 0;

function CustomTableBottom(props: {tableMap: TypeCustomTable["categoryMap"] | null, budget: number,
                            toggleEdit: boolean, subcategoryMap: TypeCustomTable["subCategoryMap"] | null}){

  // ******* States ******* //
  const [balance, setBalance] = useState<number>(0);
  const [budgetInputValue, setBudgetInputValue] = useState<string>(String(props.budget));

  // ******* References ******* //
  const budgetInput = useRef<HTMLInputElement>(null);

  // ******* Callbacks ******* //
  

  // ******* Memo ******* //
  const grandTotal = useMemo<number>(()=>{
    let addThemUp: number = 0;
    if(props.tableMap && props.subcategoryMap){
      Array.from(props.tableMap.values()).forEach(entry =>{
        addThemUp += entry.totalAmount;
      });

      Array.from(props.subcategoryMap.values()).forEach(entry =>{
        addThemUp += entry.amount;
      });
    }
    return addThemUp;
  }, [props.tableMap, props.subcategoryMap]);

  // ******* Input Handlers ******* //
  function updateInput(e: ChangeEvent<HTMLInputElement>): void{
    const inputs: string = editInputs(e, budgetInputValue, "number");
    tempBudget = Number(inputs);
    setBudgetInputValue(prev => prev = inputs);
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    setBudgetInputValue(prev => prev = String(props.budget));

    return()=>{
      setBudgetInputValue(prev => prev = "0");
    }
  },[props.budget])

  useEffect(()=>{
    const remaining: number = Number(budgetInputValue) - grandTotal;
    setBalance(prev => prev = remaining);

    return()=>{
      setBalance(prev => prev = 0);
    }
  }, [budgetInputValue, props.tableMap, props.subcategoryMap])

  return(
    <div id="custom-table-bottom">
      <p><span style={{fontWeight: 700}}>Total:</span> {grandTotal}</p>
      <div>
        <label style={{fontWeight: 700}}>Budget:</label>
        <input type="text" inputMode="numeric" pattern='[0-9]*'
                placeholder='Budget' value={budgetInputValue} 
                  ref={budgetInput} onChange={updateInput} 
                    disabled={props.toggleEdit ? undefined : true}/>
      </div>
      <p><span style={{fontWeight: 700}}>Balance:</span> {balance}</p>
    </div>
  )
}

function SubCategoryCell(props:{id: string, subcategory: string, amount: number,
                          subcategoryMap: TypeCustomTable["subCategoryMap"] | null, setSubcategoryMap: Function,
                          tableMap: TypeCustomTable["categoryMap"] | null, setTableMap: Function,
                          toggleEdit: boolean}){

  // ******* States ******* //
  const [subcategoryValue, setSubcategoryValue] = useState<string>(props.subcategory);
  const [amountValue, setAmountValue] = useState<string>(String(props.amount));

  // ******* Functions ******* //
  function updateSubcategoryMap(){
    const newMap = new Map(props.subcategoryMap);
    props.setSubcategoryMap(newMap);
  }

  // ******* Input Handlers ******* //
  function amountUpdate(e: ChangeEvent<HTMLInputElement>): void{
    const inputs: string = editInputs(e, amountValue, "number");
    const currSubcategory = props.subcategoryMap!.get(props.id)!;
    props.subcategoryMap!.set(props.id, {...currSubcategory, amount: Number(inputs)});
    setAmountValue(prev => prev = inputs);
    console.log(...props.subcategoryMap?.values()!);
  }

  function subcategoryUpdate(e: ChangeEvent<HTMLInputElement>): void{
    const inputs: string = editInputs(e, subcategoryValue, "string");
    const currSubcategory = props.subcategoryMap!.get(props.id)!;
    props.subcategoryMap!.set(props.id, {...currSubcategory, subCategory: inputs});
    setSubcategoryValue(prev => prev = inputs);
  }

  // ******* Button Handlers ******* //
  function deleteButtonHandler(e: SyntheticEvent<HTMLButtonElement, MouseEvent>){
    const id: string = e.currentTarget.getAttribute("data-id")!;

    props.subcategoryMap!.delete(id);
    updateSubcategoryMap();
  }
                            
  return(
    <div className={`custom-table-body-cell subcategory-cell ${props.toggleEdit ? null : "disable-hover"}`}>
      <input type="text" value={subcategoryValue} 
              disabled={props.toggleEdit ? undefined : true} onChange={subcategoryUpdate} />
      <input type="text" inputMode="numeric" pattern='[0-9]*' value={amountValue}
              disabled={props.toggleEdit ? undefined : true} onChange={amountUpdate} />
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
                      subcategoryMap: TypeCustomTable["subCategoryMap"] | null, 
                      setSubcategoryMap: Function, toggleEdit: boolean, categoryId: string | null,
                      setTableMap: Function}){
                        
 // ******* States ******* //
  const [addSubcategoryForm, setAddSubCategoryForm] = useState<boolean>(false);

  // ******* References ******* //
  const subCategoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

   // ******* Memo ******* //
   const subCategories = useMemo<TypeCustomTable["subCategoryEntries"]>(()=>{
    return props.subcategoryMap ? Array.from(props.subcategoryMap.entries()) : [];
  }, [props.subcategoryMap]);

  const categorySelected = useMemo<string | null>(()=>{
    return props.categoryId ? props.tableMap!.get(props.categoryId)!.category : null;
  }, [props.categoryId]);
  
  // ******* Button Handlers ******* //
  function addButtonHandler(){
    const uId: string = uniqueId();
    props.subcategoryMap!.set(uId, {subCategory: subCategoryInput.current!.value,
                                    amount: Number(amountInput.current!.value), 
                                    categoryId: props.categoryId!});                              

    const newMap = new Map(props.subcategoryMap);
    props.setSubcategoryMap(newMap);
    setAddSubCategoryForm(prev => prev = false);
  }

  function displayAddSubCategoryForm(): void{
    if(addSubcategoryForm){
      setAddSubCategoryForm(prev => prev = false);
    }
    else{
      setAddSubCategoryForm(prev => prev = true);
    }
  }

  return(
    <div id="custom-table-body-subcategory">
      <div id="custom-table-body-subcategory-header">
        {categorySelected ? <h2>{`${categorySelected}'s Subcategories`}</h2> : null}
        {categorySelected ? 
        <button className="manager-buttons" onClick={displayAddSubCategoryForm}>Add Entry</button> 
        : null}
      </div>
      {addSubcategoryForm ? 
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
        {props.categoryId ? null : <p>Select a category to view/add subcategories...</p>}
        {subCategories.length === 0 && props.categoryId ? <p>Empty</p> : null}
        {subCategories.map(subCategory =>
          subCategory[1].categoryId === props.categoryId ? 
          <SubCategoryCell id={subCategory[0]} subcategory={subCategory[1].subCategory} amount={subCategory[1].amount}
                          subcategoryMap={props.subcategoryMap} setSubcategoryMap={props.setSubcategoryMap}
                          toggleEdit={props.toggleEdit} tableMap={props.tableMap} setTableMap={props.setTableMap}
                          key={subCategory[0]}/> : null
        )}
      </div>
    </div>
  )
}

function CustomTableBodyCell(props:{id: string, category: string, amount: number,
                              toggleEdit: boolean, tableMap: TypeCustomTable["categoryMap"] | null,
                              setTableMap: Function, budget: number, 
                              displaySubCategories: MouseEventHandler<HTMLDivElement>}){
 
  // ******* States ******* //                             
  const [amountValue, setAmountValue] = useState<string>("0");
  const [categoryValue, setCategoryValue] = useState<string>("");                            

   // ******* Functions ******* //                              
  function highlightCell(amount: number): string{
    const budget: number = props.budget;
    if(amount >= budget * 0.2 && amount < budget * 0.5){
      return "inset 1px 1px 10px rgba(255, 255, 0, 0.77)";
    }
    else if(amount >= budget * 0.5){
      return "inset 1px 1px 5px rgba(255, 0, 0, 0.77)";
    }

    return "";
  }

  function updateTableMap(): void{
    const newTableMap = new Map(props.tableMap);
    props.setTableMap(newTableMap);
  }

  // ******* Input Handlers ******* //
  function amountUpdate(e: ChangeEvent<HTMLInputElement>): void{
    const inputs: string = editInputs(e, amountValue, "number");
    const currCategory = props.tableMap!.get(props.id)!;
    props.tableMap!.set(props.id, {...currCategory, totalAmount: Number(inputs)});
    setAmountValue(prev => prev = inputs);
    console.log(...props.tableMap!.values());
    console.log(...oldData.oldTableMap.values());
  }

  function categoryUpdate(e: ChangeEvent<HTMLInputElement>): void{
    const inputs: string = editInputs(e, categoryValue, "string");
    const currCategory = props.tableMap!.get(props.id)!;
    props.tableMap!.set(props.id, {...currCategory, category: inputs});
    setCategoryValue(prev => prev = inputs);
  }

   // ******* Button Handlers ******* //
  function deleteButtonHandler(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void{
    const id: string = e.currentTarget.getAttribute("data-id")!
    props.tableMap!.delete(id);
    updateTableMap();
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    setAmountValue(prev => prev = String(props.amount));
    setCategoryValue(prev => prev = props.category);

    return()=>{
      setAmountValue(prev => prev = "0");
      setCategoryValue(prev => prev = "");
    }
  }, [props.amount, props.budget])

  return(
    <div data-id={props.id} className="custom-table-body-cell non-subcategory-cell clickable " 
          style={{boxShadow: highlightCell(props.amount)}}
            onClick={props.toggleEdit ? undefined : props.displaySubCategories}>
      <input type="text" value={categoryValue} 
              disabled={props.toggleEdit ? undefined : true} onChange={categoryUpdate} />
      <input type="text" inputMode="numeric" pattern='[0-9]*' value={amountValue} 
              disabled={props.toggleEdit ? undefined : true} onChange={amountUpdate} />
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
                          toggleEdit: boolean, setTableMap: Function, budget: number,
                            subcategoryMap: TypeCustomTable["subCategoryMap"] | null,
                              setSubcategoryMap: Function}){

   // ******* States ******* //
  const [categoryId, setCategoryId] = useState<string | null>(null);

   // ******* Memo ******* //
  const categories = useMemo<TypeCustomTable["categoryEntries"]>(()=>{
    return props.tableMap ? Array.from(props.tableMap!.entries()) : [];
  }, [props.tableMap]);

   // ******* Button Handlers ******* //
  function displaySubcategories(e: SyntheticEvent<HTMLDivElement, MouseEvent>){
    const selectedCategory: string = e.currentTarget.getAttribute("data-id")!;
    setCategoryId(prev => prev = selectedCategory);
  }

  // ******* Functions ******* //
  function totalAmount(categoryId: string, initalAmount: number): number{
    const subcategories = Array.from(props.subcategoryMap!.values());
    let summedAmounts: number = initalAmount;

    subcategories.forEach(subcategory =>{
      if(categoryId === subcategory.categoryId){
        summedAmounts += subcategory.amount;
      }
    });

    return summedAmounts;
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
            <CustomTableBodyCell id={category[0]} category={category[1].category} amount={totalAmount(category[0], category[1].totalAmount)}
            budget={props.budget} tableMap={props.tableMap} setTableMap={props.setTableMap}
            displaySubCategories={displaySubcategories} toggleEdit={props.toggleEdit} key={category[0]} />
          )}
        </div>
        <SubCategory tableMap={props.tableMap} toggleEdit={props.toggleEdit} 
                      categoryId={categoryId} setSubcategoryMap={props.setSubcategoryMap}
                      subcategoryMap={props.subcategoryMap} setTableMap={props.setTableMap}/>
      </div>
    </div>
  );
}


function CustomTable(){
  // ******* States ******* //
  const [tableMap, setTableMap] = useState<TypeCustomTable["categoryMap"] | null>(null);
  const [subcategoryMap, setSubcategoryMap] = useState<TypeCustomTable["subCategoryMap"] | null>(null);
  const [toggleInsert, setToggleInsert] = useState<boolean>(false);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [budget, setBudget] = useState<number>(0);
  const [change, setChange] = useState<boolean>(false);

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
      const newMap = new Map(tableMap!);
      const newSubMap = new Map(subcategoryMap!);
      setBudget(prev => prev = tempBudget);
      setToggleEdit(prev => prev = false);
      setSubcategoryMap(prev => prev = newSubMap);
      setTableMap(prev => prev = newMap);
    }
    else{
      oldData = {...oldData, oldTableMap: new Map(tableMap!)};
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
    setSubcategoryMap(prev => prev = new Map());

    return()=>{
      setSubcategoryMap(prev => prev = null);
    }
  }, [])

  useEffect(()=>{
    setBudget(prev => prev = user.budget);
    tempBudget = user.budget;

    return()=>{
      setBudget(prev => prev = 0);
    }
  },[])

  return(
    <div id="custom-table">
      <div id="custom-table-header">
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
        <div id="custom-table-saving-options">
          <button>
            <img src="./src/assets/manager-icons/undo-48px.svg" alt="Undo" title="Revert" className="manager-icons" />
          </button>
          <button id="custom-table-save-button" className="manager-buttons">Save</button>
        </div>
      </div>
      <CustomTableBody tableMap={tableMap} toggleEdit={toggleEdit} setTableMap={setTableMap} budget={budget}
                        subcategoryMap={subcategoryMap} setSubcategoryMap={setSubcategoryMap} />
      <CustomTableBottom tableMap={tableMap} toggleEdit={toggleEdit} budget={budget} subcategoryMap={subcategoryMap} />
    </div>
  )
}

export default CustomTable