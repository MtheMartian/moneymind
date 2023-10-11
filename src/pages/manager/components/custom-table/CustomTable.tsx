import { useRef, useState, useEffect, useMemo, 
        SyntheticEvent, ChangeEvent, MouseEventHandler, useCallback} from 'react';
import './custom-table.css';
import '../../manager.css';
import { TypeCustomTable } from './custom-table-types';
import { user } from '../../../../data/user';
import { editInputs, uniqueId, checkIfInputEmpty, checkIfInputEmptyCell,
          getCaretPosition, caretPosition } from '../../manager';
import { Stack } from '../../../../ts/dsa';
import { oldData, todaysDate, linkMap } from './custom-table';
import exportIcon from '../../../../assets/manager-icons/export-48px.svg';
import searchIcon from '../../../../assets/manager-icons/search-48px.svg';
import undoIcon from '../../../../assets/manager-icons/undo-48px.svg';
import deleteIcon from '../../../../assets/manager-icons/delete-48px.svg';

const stack = new Stack<typeof oldData>();

function CustomTableBottom(props: {tableMap: TypeCustomTable["categoryMap"] | null, budget: number,
                            toggleEdit: boolean, subcategoryMap: TypeCustomTable["subCategoryMap"] | null,
                              setChange: Function}){

  // ******* States ******* //
  const [balance, setBalance] = useState<number>(0);
  const [budgetInputValue, setBudgetInputValue] = useState<string>(String(props.budget));

  // ******* References ******* //
  const budgetInput = useRef<HTMLInputElement>(null);

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
    props.setChange(true);
    const inputs: string = editInputs(e, budgetInputValue, "number");
    oldData.oldBudget = Number(inputs);
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

  useEffect(()=>{
    if(budgetInput.current){
      budgetInput.current!.selectionStart = caretPosition;
      budgetInput.current!.selectionEnd = caretPosition;
      console.log(`useEffect: ${caretPosition}`);
    }
  }, [budgetInputValue]);

  return(
    <div id="custom-table-bottom">
      <p><span style={{fontWeight: 700}}>Total:</span> {grandTotal}</p>
      <div className="custom-table-bottom-budget-wrapper">
        <label style={{fontWeight: 700}}>Budget:</label>
        <input id="budget-input" type="text" inputMode="numeric"
                placeholder='Budget' value={budgetInputValue} 
                  ref={budgetInput} onChange={updateInput} 
                    disabled={props.toggleEdit ? undefined : true} 
                      onSelect={getCaretPosition} />
      </div>
      <p><span style={{fontWeight: 700}}>Balance:</span> {balance}</p>
    </div>
  )
}

function SubCategoryCell(props:{id: string, subcategory: string, amount: number,
                          subcategoryMap: TypeCustomTable["subCategoryMap"] | null, setSubcategoryMap: Function,
                          tableMap: TypeCustomTable["categoryMap"] | null, setTableMap: Function,
                          toggleEdit: boolean, setChange: Function, addToStack: Function}){

  // ******* References ******* //
  const amountInputRef = useRef<HTMLInputElement>(null);
  const subcategoryInputRef = useRef<HTMLInputElement>(null);

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
    props.setChange(true);
    const currentElement: HTMLInputElement = e.currentTarget;

    const inputs: string = editInputs(e, amountValue, "number");
    const currSubcategory = props.subcategoryMap!.get(props.id)!;
    setAmountValue(prev => prev = inputs);

    if(checkIfInputEmpty(currentElement) || Number(currentElement.value) <= 0){
      return;
    }

    props.subcategoryMap!.set(props.id, {...currSubcategory, amount: Number(inputs)});
  }

  function subcategoryUpdate(e: ChangeEvent<HTMLInputElement>): void{

    props.setChange(true);

    const inputs: string = editInputs(e, subcategoryValue, "string");
    const currSubcategory = props.subcategoryMap!.get(props.id)!;
    setSubcategoryValue(prev => prev = inputs);

    if(checkIfInputEmptyCell(e)){
      return;
    }

    props.subcategoryMap!.set(props.id, {...currSubcategory, subCategory: inputs});
  }

  // ******* Button Handlers ******* //
  function deleteButtonHandler(e: SyntheticEvent<HTMLButtonElement, MouseEvent>){
    props.addToStack();
    props.setChange(true);
    const id: string = e.currentTarget.getAttribute("data-id")!;

    props.subcategoryMap!.delete(id);
    updateSubcategoryMap();
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    if(amountInputRef.current){
      const caretPosition = amountInputRef.current.selectionStart!;

      amountInputRef.current.selectionStart = caretPosition;
      amountInputRef.current.selectionEnd = caretPosition;
    }
  }, [amountValue]);

  useEffect(()=>{
    if(subcategoryInputRef.current){
      subcategoryInputRef.current.selectionStart = caretPosition;
      subcategoryInputRef.current.selectionEnd = caretPosition;
    }
  }, [subcategoryValue]);
                            
  return(
    <div className={`custom-table-body-cell subcategory-cell ${props.toggleEdit ? null : "disable-hover"}`}>
      <input type="text" className="cell-inputs" value={subcategoryValue} 
              disabled={props.toggleEdit ? undefined : true} onChange={subcategoryUpdate}
              onSelect={getCaretPosition} />
      <input type="text" className="cell-inputs" inputMode="numeric" pattern='[0-9]*' value={amountValue}
              disabled={props.toggleEdit ? undefined : true} onChange={amountUpdate} 
              onSelect={getCaretPosition} />
      {props.toggleEdit ? 
      <div className="custom-table-body-cell-options">
        <button data-id={props.id} onClick={deleteButtonHandler} className="custom-table-body-delete-button">
          <img src={deleteIcon} alt="delete" className="manager-icons" />
        </button>
      </div> : null}
    </div>
  )
}

function SubCategory(props: {tableMap: TypeCustomTable["categoryMap"] | null, 
                      subcategoryMap: TypeCustomTable["subCategoryMap"] | null, 
                      setSubcategoryMap: Function, toggleEdit: boolean, categoryId: string | null,
                      setTableMap: Function, setChange: Function, addToStack: Function, 
                      tableUse: string}){
                        
 // ******* States ******* //
  const [addSubcategoryForm, setAddSubCategoryForm] = useState<boolean>(false);
  const [amountInputValue, setAmountInputValue] = useState<string>("");

  // ******* References ******* //
  const subCategoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

   // ******* Memo ******* //
   const categorySelected = useMemo<string | null>(()=>{
    if(props.categoryId && props.tableMap){
      const retrievedCategory = props.tableMap.get(props.categoryId);
      if(typeof retrievedCategory !== "undefined"){
        return retrievedCategory.category;
      }
    }
    return null;
  }, [props.categoryId, props.tableMap]);

   const subCategories = useMemo<TypeCustomTable["subCategoryEntries"]>(()=>{
    return props.subcategoryMap ? Array.from(props.subcategoryMap.entries()) : [];
  }, [props.subcategoryMap, props.tableMap]);

  // ******* Input Handlers ******* //
  function updateInput(e: ChangeEvent<HTMLInputElement>): void{
    const inputs: string = editInputs(e, amountInputValue, "number");
    setAmountInputValue(prev => prev = inputs);
  }
  
  // ******* Button Handlers ******* //
  function addButtonHandler(): void{
    if(checkIfInputEmpty(subCategoryInput.current!) && props.tableUse !== "daily"){
      return;
    }

    if(checkIfInputEmpty(amountInput.current!) || Number(amountInput.current!.value) <= 0){
      return;
    }

    props.addToStack();
    props.setChange(true);
    const uId: string = uniqueId();
    let subcategoryString: string = subCategoryInput.current!.value;

    if(props.tableUse === "daily"){
      if(subcategoryString === "" || subcategoryString === " "){
        subcategoryString = todaysDate();
      }
    }
    props.subcategoryMap!.set(uId, {subCategory: subcategoryString,
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
          <h3>Add Entry</h3>
          <div>
            <label>Entry:</label>
            <input type="text" placeholder="SubCategory" autoFocus ref={subCategoryInput} />
          </div>
          <div>
            <label>Amount:</label>
            <input type="text"  inputMode="numeric" placeholder="Amount" ref={amountInput} 
                    onChange={updateInput} onSelect={getCaretPosition} value={amountInputValue} />
          </div>
          <div id="add-subcategory-form-options">
            <button className="manager-buttons" onClick={addButtonHandler}>Add</button>
            <button className="manager-buttons" onClick={displayAddSubCategoryForm}>Cancel</button>
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
                          key={subCategory[0]} setChange={props.setChange} addToStack={props.addToStack}/> : null
        )}
      </div>
    </div>
  )
}

function CustomTableBodyCell(props:{id: string, category: string, amount: number,
                              toggleEdit: boolean, tableMap: TypeCustomTable["categoryMap"] | null,
                              setTableMap: Function, budget: number, 
                              displaySubCategories: MouseEventHandler<HTMLDivElement>, setChange: Function,
                              addToStack: Function, subCategoryMap: TypeCustomTable["subCategoryMap"] | null,
                              setCategoryId: Function}){
  // ******* References ******* //
  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);


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

  function clearAssociatedSubcategories(key: string): void{
    if(props.subCategoryMap){
      Array.from(props.subCategoryMap.entries()).forEach(subcategory=>{
        if(subcategory[1].categoryId === key){
          props.subCategoryMap!.delete(subcategory[0]);
        }
      });
    }
  }

  // ******* Input Handlers ******* //
  function amountUpdate(e: ChangeEvent<HTMLInputElement>): void{
    props.setChange(true);
    const inputs: string = editInputs(e, amountValue, "number");
    const currCategory = props.tableMap!.get(props.id)!;
    props.tableMap!.set(props.id, {...currCategory, totalAmount: Number(inputs)});
    setAmountValue(prev => prev = inputs);
  }

  function categoryUpdate(e: ChangeEvent<HTMLInputElement>): void{
    props.setChange(true);
    const currentElement: HTMLInputElement = e.currentTarget;

    const inputs: string = editInputs(e, categoryValue, "string");
    const currCategory = props.tableMap!.get(props.id)!;
    setCategoryValue(prev => prev = inputs);

    if(checkIfInputEmpty(currentElement)){
      return;
    }

    props.tableMap!.set(props.id, {...currCategory, category: inputs});
  }

   // ******* Button Handlers ******* //
  function deleteButtonHandler(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void{
    props.addToStack();
    props.setChange(true);
    const id: string = e.currentTarget.getAttribute("data-id")!
    props.tableMap!.delete(id);
    clearAssociatedSubcategories(id);
    updateTableMap();
    props.setCategoryId(null);
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

  useEffect(()=>{
    if(amountInput.current){
      const caretPosition = amountInput.current.selectionStart!;

      amountInput.current.selectionStart = caretPosition;
      amountInput.current.selectionEnd = caretPosition;
    }
  }, [amountValue]);

  useEffect(()=>{
    if(categoryInput.current){
      categoryInput.current.selectionStart = caretPosition;
      categoryInput.current.selectionEnd = caretPosition;
    }
  }, [categoryValue]);

  return(
    <div data-id={props.id} className="custom-table-body-cell non-subcategory-cell clickable " 
          style={{boxShadow: highlightCell(props.amount)}}
            onClick={props.toggleEdit ? undefined : props.displaySubCategories}>
      <input type="text" className="cell-inputs" value={categoryValue} 
              disabled={props.toggleEdit ? undefined : true} onChange={categoryUpdate} 
              onSelect={getCaretPosition} />
      <input type="text" className="cell-inputs" inputMode="numeric" pattern='[0-9]*' value={amountValue} 
              disabled={props.toggleEdit ? undefined : true} onChange={amountUpdate} 
              onSelect={getCaretPosition} />
      {props.toggleEdit ? 
        <div className="custom-table-body-cell-options">
          <button data-id={props.id} onClick={deleteButtonHandler} className="custom-table-body-delete-button">
            <img src={deleteIcon} alt="delete" className="manager-icons" />
          </button>
        </div> : null}
    </div>
  )
}

function CustomTableBody(props: {tableMap: TypeCustomTable["categoryMap"] | null, 
                          toggleEdit: boolean, setTableMap: Function, budget: number,
                            subcategoryMap: TypeCustomTable["subCategoryMap"] | null,
                              setSubcategoryMap: Function, setChange: Function,
                                addToStack: Function, tableUse: string}){

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
  function storeDailyEntries(categoryId: string, summedAmount: number): void{
    if(summedAmount <= 0){
      return;
    }

    const convertToMonthly: number = summedAmount / 28;
    const currentCategory = props.tableMap!.get(categoryId);
    linkMap.set(categoryId, {...currentCategory, totalAmount: Number(convertToMonthly.toFixed(2))});
    const myJSON: string = JSON.stringify(Array.from(linkMap.entries()));
    console.log(myJSON);
    sessionStorage.setItem("linkMap", myJSON);
  }

  function totalAmount(categoryId: string, initalAmount: number): number{
    const subcategories = Array.from(props.subcategoryMap!.values());
    let summedAmounts: number = initalAmount;

    subcategories.forEach(subcategory =>{
      if(categoryId === subcategory.categoryId){
        summedAmounts += subcategory.amount;
      }
    });

    if(props.tableUse === "daily"){
      storeDailyEntries(categoryId, summedAmounts);
    }

    return summedAmounts;
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    if(props.tableMap && props.tableMap.size === 0){
      setCategoryId(prev => prev = null);
    }

    return()=>{
      setCategoryId(prev => prev = null);
    }
  }, [props.tableMap])

  return(
    <div id="custom-table-body">
      <div id="custom-table-body-header">
        <div id="custom-table-body-search-container">
          <img src={searchIcon} alt="search" className="manager-icons" />
          <input type="text" placeholder="Search..." />
        </div>
        <button id="custom-table-body-export-button">
          <img src={exportIcon} alt="export" className="manager-icons" />
          <p>Export</p>
        </button>
      </div>
      <div id="custom-table-body-content">
        <div id="custom-table-body-cells-wrapper">
          <div id="custom-table-body-sections">
            <p>Category</p>
            <p>Amount</p>
            <p>Initial Amount</p>
            <p>Last Updated</p>
          </div>
          <div id="custom-table-body-cells">
            {categories.map((category) =>
              <CustomTableBodyCell id={category[0]} category={category[1].category} amount={totalAmount(category[0], category[1].totalAmount)}
              budget={props.budget} tableMap={props.tableMap} setTableMap={props.setTableMap}
              displaySubCategories={displaySubcategories} toggleEdit={props.toggleEdit} key={category[0]} setChange={props.setChange}
              addToStack={props.addToStack} subCategoryMap={props.subcategoryMap} setCategoryId={setCategoryId} />
            )}
          </div>
        </div>
        <SubCategory tableMap={props.tableMap} toggleEdit={props.toggleEdit} 
                      categoryId={categoryId} setSubcategoryMap={props.setSubcategoryMap}
                      subcategoryMap={props.subcategoryMap} setTableMap={props.setTableMap} setChange={props.setChange}
                      addToStack={props.addToStack} tableUse={props.tableUse} />
      </div>
    </div>
  );
}


function CustomTable(props: {title: string, tableUse: string, stack: Stack<any>,
                              currentTable: TypeCustomTable["categoryMap"] | null, 
                              currentSubcategories: TypeCustomTable["subCategoryMap"] | null}){

  // ******* States ******* //
  const [tableMap, setTableMap] = useState<TypeCustomTable["categoryMap"] | null>(props.currentTable);
  const [subcategoryMap, setSubcategoryMap] = useState<TypeCustomTable["subCategoryMap"] | null>(props.currentSubcategories);
  const [toggleInsert, setToggleInsert] = useState<boolean>(false);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [budget, setBudget] = useState<number>(0);
  const [change, setChange] = useState<boolean>(false);
  const [amountInputValue, setAmountInputValue] = useState<string>("");

  // ******* References ******* //
  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  // ******* Functions ******* //
  function updateStates(): void{
    const newMap = new Map(tableMap!);
    const newSubMap = new Map(subcategoryMap!);
    setBudget(prev => prev = oldData.oldBudget);
    setSubcategoryMap(prev => prev = newSubMap);
    setTableMap(prev => prev = newMap);
  }

  function addToStack(): void{
    props.stack.insert({...oldData, oldTableMap: new Map(tableMap!), oldSubMap: new Map(subcategoryMap!),
      oldBudget: budget});
      console.log(props.stack.head?.value);
  }

  // ******* Input Handlers ******* //
  function updateInput(e: ChangeEvent<HTMLInputElement>): void{
    const inputs: string = editInputs(e, amountInputValue, "number");
    setAmountInputValue(prev => prev = inputs);
  }

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
      updateStates();
    }
    else{
      addToStack();
      setToggleEdit(prev => prev = true);
    }
  }

  function insertButtonHandler(): void{
    const uId: string = uniqueId();
    const newTableMap: TypeCustomTable["categoryMap"] = new Map(tableMap);
    let categoryString: string = categoryInput.current!.value;

    if(checkIfInputEmpty(categoryInput.current!) && props.tableUse !== "daily"){
      return;
    }

    if(props.tableUse === "daily"){
      if(categoryString === "" || categoryString === " "){
        categoryString = todaysDate();
      }
    }

    newTableMap.set(uId, {category: categoryString, totalAmount: Number(amountInput.current!.value)});
    setTableMap(newTableMap);
    setChange(prev => prev = true);
    addToStack();
    displayInsert();
  }

  function saveButtonHandler(): void{
    setChange(prev => prev = false);
    updateStates();
  }

  function undoButtonHandler(): void{
    const previousData = props.stack.pop();

    if(!previousData){
      setChange(prev => prev = false);
      return;
    }

    if(props.stack.length === 0){
      setChange(prev => prev = false);
    }

    setBudget(prev => prev = previousData.oldBudget);
    setSubcategoryMap(prev => prev = previousData.oldSubMap);
    setTableMap(prev => prev = previousData.oldTableMap);
    setToggleEdit(prev => prev = false);
    setChange(prev => prev = true);
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    setTableMap(prev => prev = props.currentTable);

    return()=>{
      setTableMap(prev => prev = null);
    }
  }, [props.currentTable])

  useEffect(()=>{
    setSubcategoryMap(prev => prev = props.currentSubcategories);

    return()=>{
      setSubcategoryMap(prev => prev = null);
    }
  }, [props.currentSubcategories])

  useEffect(()=>{
    setBudget(prev => prev = user.budget);
    oldData.oldBudget = user.budget;

    return()=>{
      setBudget(prev => prev = 0);
    }
  },[])

  return(
    <div id="custom-table">
      <div id="custom-table-header">
        <h1>{props.title}</h1>
        <div id="custom-table-menu">
          <button onClick={displayEditOptions} className="manager-buttons">Edit</button>
          {toggleInsert ? 
          <div id="custom-table-insert">
            <input type="text" placeholder="Category" autoFocus ref={categoryInput} />
            <input type="text"  inputMode="numeric" placeholder="Amount" ref={amountInput} 
                    onChange={updateInput} onSelect={getCaretPosition} value={amountInputValue} />
            <div id="custom-table-insert-options">
              <button onClick={insertButtonHandler} className="manager-buttons">Add</button>
              <button onClick={displayInsert} className="manager-buttons">Cancel</button>
            </div>
          </div> :
          <button onClick={displayInsert} className="manager-buttons">Insert</button>}
        </div>
        <div id="custom-table-saving-options">
          {props.stack.length > 0 ? 
          <button onClick={undoButtonHandler}>
            <img src={undoIcon} alt="Undo" title="Undo" className="manager-icons" />
          </button> : null}
          <button id="custom-table-save-button" className="manager-buttons" 
                  onClick={saveButtonHandler}
                    disabled={change ? undefined : true}>
            Save
          </button>
        </div>
      </div>
      <CustomTableBody tableMap={tableMap} toggleEdit={toggleEdit} setTableMap={setTableMap} budget={budget}
                        subcategoryMap={subcategoryMap} setSubcategoryMap={setSubcategoryMap} setChange={setChange} 
                          addToStack={addToStack} tableUse={props.tableUse} />
      <CustomTableBottom tableMap={tableMap} toggleEdit={toggleEdit} budget={budget} subcategoryMap={subcategoryMap}
                          setChange={setChange} />
    </div>
  )
}

export default CustomTable