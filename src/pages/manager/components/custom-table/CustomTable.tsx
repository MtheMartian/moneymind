import { useRef, useState, useEffect, useMemo, 
        SyntheticEvent, ChangeEvent, MouseEventHandler} from 'react';
import './custom-table.css';
import '../../manager.css';
import { TypeCustomTable } from './custom-table-types';
import { user } from '../../../../data/user';
import { editInputs, uniqueId, checkIfInputEmpty, checkIfInputEmptyCell,
        getCaretPosition, caretPosition, findLongestString, convertStringToWeight,
        convertDateToString, getEntriesRequest, returnRequestURL, currentURLSearchParams, checkIfSamePeriod, returnDateSearchParamsOr } from '../../manager';
import { Stack, CustomBST, BSTNode } from '../../../../ts/dsa';
import { oldData,  customTableVariables } from './custom-table';
import exportIcon from '../../../../assets/manager-icons/export-48px.svg';
import searchIcon from '../../../../assets/manager-icons/search-48px.svg';
import undoIcon from '../../../../assets/manager-icons/undo-48px.svg';
import deleteIcon from '../../../../assets/manager-icons/delete-48px.svg';
import { RequestQueue } from '../../../../ts/general-classes';

function CustomTableBottom(props: {budget: number, toggleEdit: boolean, setChange: Function, 
                                  categories: BSTNode<TypeCustomTable["customTableEntry"]>[],
                                  subcategories: BSTNode<TypeCustomTable["customTableEntry"]>[]}){

  // ******* States ******* //
  const [balance, setBalance] = useState<number>(0);
  const [budgetInputValue, setBudgetInputValue] = useState<string>(String(props.budget));

  // ******* References ******* //
  const budgetInput = useRef<HTMLInputElement>(null);

  // ******* Memo ******* //
  const grandTotal = useMemo<number>(()=>{
    let addThemUp: number = 0;
    const categories = props.categories;
    const subcategories = props.subcategories;

    categories.forEach(category =>{
      addThemUp += category.item.entryAmount;
    });

    subcategories.forEach(subcategory =>{
      addThemUp += subcategory.item.entryAmount;
    });

    return addThemUp;
    }, [props.categories, props.subcategories]);

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
  }, [budgetInputValue, props.categories, props.subcategories])

  useEffect(()=>{
    if(budgetInput.current){
      budgetInput.current!.selectionStart = caretPosition;
      budgetInput.current!.selectionEnd = caretPosition;
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

function SubCategoryCell(props:{currSubcategory: BSTNode<TypeCustomTable["customTableEntry"]>,
                                subcategoryBST: CustomBST<TypeCustomTable["customTableEntry"]>, 
                                setSubcategories: Function, toggleEdit: boolean, 
                                setChange: Function, addToStack: Function,
                                updateLastUpdated: Function, updateStates: Function}){

  // ******* References ******* //
  const amountInputRef = useRef<HTMLInputElement>(null);
  const subcategoryInputRef = useRef<HTMLInputElement>(null);

  // ******* States ******* //
  const [subcategoryValue, setSubcategoryValue] = useState<string>(props.currSubcategory.item.entryName);
  const [amountValue, setAmountValue] = useState<string>(String(props.currSubcategory.item.entryAmount));

  // ******* Functions ******* //
  // ******* Input Handlers ******* //
  function amountUpdate(e: ChangeEvent<HTMLInputElement>): void{
    props.setChange(true);
    const currentElement: HTMLInputElement = e.currentTarget;

    const inputs: string = editInputs(e, amountValue, "number");
    const currSubcategory = props.currSubcategory;
    setAmountValue(prev => prev = inputs);

    if(checkIfInputEmpty(currentElement) || Number(currentElement.value) <= 0){
      return;
    }

    props.subcategoryBST.update(props.currSubcategory.id, {...currSubcategory.item, entryAmount: Number(inputs)}, currSubcategory.value, 0);
    props.updateLastUpdated();
  }

  function subcategoryUpdate(e: ChangeEvent<HTMLInputElement>): void{

    props.setChange(true);

    const inputs: string = editInputs(e, subcategoryValue, "string");
    const currSubcategory = props.currSubcategory;
    setSubcategoryValue(prev => prev = inputs);

    if(checkIfInputEmptyCell(e)){
      return;
    }

    props.subcategoryBST.update(currSubcategory.id, {...currSubcategory.item, entryName: inputs}, currSubcategory.value, 0);
    props.updateLastUpdated();
  }

  // ******* Button Handlers ******* //
  function deleteButtonHandler(): void{
    props.addToStack();
    props.setChange(true);

    props.subcategoryBST.remove(props.currSubcategory.id, 0);
    props.updateLastUpdated();
    props.updateStates(null, props.subcategoryBST.retrieve("desc"), null);
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
        <button data-id={props.currSubcategory.id} onClick={deleteButtonHandler} className="custom-table-body-delete-button">
          <img src={deleteIcon} alt="delete" className="manager-icons" />
        </button>
      </div> : null}
    </div>
  )
}

function SubCategory(props: {categoryBST: CustomBST<TypeCustomTable["customTableEntry"]>, 
                      subcategoryBST: CustomBST<TypeCustomTable["customTableEntry"]>, 
                      setSubcategories: Function, toggleEdit: boolean, categoryId: string | null,
                      setCategories: Function, setChange: Function, addToStack: Function, 
                      tableUse: string, subcategories: BSTNode<TypeCustomTable["customTableEntry"]>[],
                      updateStates: Function}){
                        
 // ******* States ******* //
  const [addSubcategoryForm, setAddSubCategoryForm] = useState<boolean>(false);
  const [amountInputValue, setAmountInputValue] = useState<string>("");

  // ******* References ******* //
  const subCategoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

   // ******* Memo ******* //
   const categorySelected = useMemo<BSTNode<TypeCustomTable["customTableEntry"]> | null>(()=>{
    if(props.categoryId){
      const retrievedCategory = props.categoryBST.retrieve(props.categoryId);
      if(retrievedCategory){
        return retrievedCategory;
      }
    }
    return null;
  }, [props.categoryId]);

   const subcategories = useMemo<BSTNode<TypeCustomTable["customTableEntry"]>[]>(()=>{
    const categorySelectedSubcategories: BSTNode<TypeCustomTable["customTableEntry"]>[] = [];

    const allSubcategories: BSTNode<TypeCustomTable["customTableEntry"]>[] = props.subcategoryBST.traverse("desc");

    allSubcategories.forEach(subcategory =>{
      if(categorySelected){
        if(categorySelected.item.linkID === subcategory.item.linkID){
          categorySelectedSubcategories.push(subcategory);
        }
      }
    });

    return categorySelectedSubcategories;
  }, [props.subcategories, props.categoryId]);

  // ******* Function ******* //
  function updateLastUpdated(): void{
    if(props.categoryId){
      const currCategory = props.categoryBST.retrieve(props.categoryId)!;
      const entryValues: number[] = [...currCategory.value];
      entryValues[3] = Date.now();

      props.categoryBST.update(currCategory.id, {...currCategory.item}, 
                            entryValues, customTableVariables.customBSTVariable);

      console.log("I updated!");
    }
  }

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
    const currDate: number = Date.now();
    let subcategoryString: string = subCategoryInput.current!.value;

    updateLastUpdated();

    if(props.tableUse === "daily"){
      if(subcategoryString === "" || subcategoryString === " "){
        subcategoryString = convertDateToString(currDate);
      }
    }
    props.subcategoryBST.insert([currDate, 0, 0], {entryName: subcategoryString, 
                                          entryAmount: Number(amountInput.current!.value),
                                          linkID: categorySelected!.item.linkID, lastUpdated: currDate,
                                          initialAmount: Number(amountInput.current!.value), 
                                          isCategory: false, 
                                          isMonthly: props.tableUse === "monthly" ? true : false,
                                          dateCreated: currDate, id: uId}, uId, 0);                             

    props.updateStates(null, props.subcategoryBST.traverse("desc"), null);
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
        {categorySelected ? <h2>{`${categorySelected.item.entryName}'s Subcategories`}</h2> : null}
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
        {subcategories.length === 0 && props.categoryId ? <p>Empty</p> : null}
        {subcategories.map(subcategory =>
          categorySelected ? 
          <SubCategoryCell currSubcategory={subcategory} subcategoryBST={props.subcategoryBST} 
                            setSubcategories={props.setSubcategories} toggleEdit={props.toggleEdit} 
                            key={subcategory.id} setChange={props.setChange} 
                            addToStack={props.addToStack} updateLastUpdated={updateLastUpdated} 
                            updateStates={props.updateStates} /> : null
        )}
      </div>
    </div>
  )
}

function CustomTableBodyCell(props:{currentCategory: BSTNode<TypeCustomTable["customTableEntry"]>,
                              toggleEdit: boolean, categoryBST: CustomBST<TypeCustomTable["customTableEntry"]>,
                              setCategories: Function, setSubcategories: Function, budget: number, 
                              displaySubCategories: MouseEventHandler<HTMLDivElement>, setChange: Function,
                              addToStack: Function, subcategoryBST: CustomBST<TypeCustomTable["customTableEntry"]>,
                              setCategoryId: Function, subcategories: BSTNode<TypeCustomTable["customTableEntry"]>[],
                              updateStates: Function}){

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

  function clearAssociatedSubcategories(): void{
    const subcategories = props.subcategoryBST.traverse("desc");
    subcategories.forEach(subcategory =>{
      if(subcategory.item.linkID === props.currentCategory.item.linkID){
        props.subcategoryBST.remove(subcategory.id, customTableVariables.customBSTVariable);
      }
    });
  }

  function totalAmount(): number{
    const subEntries = props.subcategoryBST.traverse("desc");
    let summedAmounts: number = props.currentCategory.item.entryAmount;

    subEntries.forEach(subEntry =>{
      if(props.currentCategory.item.linkID === subEntry.item.linkID){
        summedAmounts += subEntry.item.entryAmount;
      }
    });

    // if(props.tableUse === "daily"){
    //   storeDailyEntries(categoryId, summedAmounts);
    // }

    return summedAmounts;
  }

  // ******* Input Handlers ******* //
  function amountUpdate(e: ChangeEvent<HTMLInputElement>): void{
    props.setChange(true);
    const inputs: string = editInputs(e, amountValue, "number");
    const currCategory = props.currentCategory;
    const entryValues: number[] = [...currCategory.value];
    entryValues[3] = Date.now();

    props.categoryBST.update(currCategory.id, {...currCategory.item, entryAmount: Number(inputs)}, 
                            entryValues, customTableVariables.customBSTVariable);
    setAmountValue(prev => prev = inputs);
  }

  function categoryUpdate(e: ChangeEvent<HTMLInputElement>): void{
    props.setChange(true);
    const currentElement: HTMLInputElement = e.currentTarget;
    const inputs: string = editInputs(e, categoryValue, "string");
    const currCategory = props.currentCategory;
    const entryValues: number[] = [...currCategory.value];
    entryValues[3] = Date.now();
    setCategoryValue(prev => prev = inputs);

    if(checkIfInputEmpty(currentElement)){
      return;
    }

    props.categoryBST.update(currCategory.id, {...currCategory.item, entryName: inputs}, 
                            entryValues, customTableVariables.customBSTVariable);
  }

   // ******* Button Handlers ******* //
  function deleteButtonHandler(): void{
    props.addToStack();
    props.setChange(true);
    props.categoryBST.remove(props.currentCategory.id, customTableVariables.customBSTVariable);
    clearAssociatedSubcategories();
    props.updateStates(props.categoryBST.traverse(customTableVariables.customBSTNodeOrder), null, null);
    props.setCategoryId(null);
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    const amount: number = totalAmount();
    setAmountValue(prev => prev = String(amount));
    setCategoryValue(prev => prev = props.currentCategory.item.entryName);

    return()=>{
      setAmountValue(prev => prev = "0");
      setCategoryValue(prev => prev = "");
    }
  }, [props.currentCategory, props.budget, props.subcategories]);

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
    <div data-id={props.currentCategory.id} className="custom-table-body-cell non-subcategory-cell clickable " 
          style={{boxShadow: highlightCell(totalAmount())}}
            onClick={props.toggleEdit ? undefined : props.displaySubCategories}>
      <input type="text" className="cell-inputs" value={categoryValue} 
              disabled={props.toggleEdit ? undefined : true} onChange={categoryUpdate} 
              onSelect={getCaretPosition} />
      <input type="text" className="cell-inputs" inputMode="numeric" pattern='[0-9]*' value={amountValue} 
              disabled={props.toggleEdit ? undefined : true} onChange={amountUpdate} 
              onSelect={getCaretPosition} />
      <p>{props.currentCategory.item.initialAmount}</p>
      <p>{convertDateToString(props.currentCategory.item.lastUpdated)}</p>
      {props.toggleEdit ? 
        <div className="custom-table-body-cell-options">
          <button data-id={props.currentCategory.id} onClick={deleteButtonHandler} className="custom-table-body-delete-button">
            <img src={deleteIcon} alt="delete" className="manager-icons" />
          </button>
        </div> : null}
    </div>
  )
}

function CustomTableBody(props: {categoryBST: CustomBST<TypeCustomTable["customTableEntry"]>, 
                                subcategoryBST: CustomBST<TypeCustomTable["customTableEntry"]>,
                                setCategories: Function, setSubcategories: Function, addToStack: Function, 
                                tableUse: string, budget: number, setChange: Function, toggleEdit: boolean,
                                categories: BSTNode<TypeCustomTable["customTableEntry"]>[],
                                subcategories: BSTNode<TypeCustomTable["customTableEntry"]>[],
                                updateTableFromDB: Function, asyncQueue: RequestQueue,
                                updateStates: Function}){

  // ******* Reference ******* //
  const sortCounter = useRef<number[]>([0, 0, 0]);
  const searchBar = useRef<HTMLInputElement>(null);

   // ******* States ******* //
  const [categoryId, setCategoryId] = useState<string | null>(null);

   // ******* Memo ******* //
  const entries = useMemo<BSTNode<TypeCustomTable["customTableEntry"]>[]>(()=>{
    return props.categories;
  }, [props.categories]);

  // ******* Input Handlers ******* //
  function searchEntries(): void{
    if(searchBar.current && !currentURLSearchParams.has("id")){
      const input: string = searchBar.current.value.length > 0 ? searchBar.current.value : "<Empty>";
      props.asyncQueue.enqueueRequest(()=> props.updateTableFromDB(returnRequestURL("search", input)));
    }
  }

   // ******* Button Handlers ******* //
  function displaySubcategories(e: SyntheticEvent<HTMLDivElement, MouseEvent>){
    const currentSelection: string = e.currentTarget.getAttribute("data-id")!;
    setCategoryId(prev => prev = currentSelection);
  }

  function sortCategoriesSection(sectionToSort: string): undefined{
    sectionToSort = sectionToSort.toLowerCase();

    function resetToDefaultSorting(idx: number): void{
      sortCounter.current[idx] = 0;
      customTableVariables.customBSTVariable = 0;
      props.categoryBST.reconstruct(props.categories, 0);
      props.updateStates(props.categoryBST.traverse("desc"), null, null);
      customTableVariables.customBSTNodeOrder = "desc";
    }

    function setSortedCategories(idx: number): void{
      customTableVariables.customBSTVariable = idx;
      sortCounter.current[idx]++;
      props.categoryBST.reconstruct(props.categories, idx);

      if(sortCounter.current[idx] === 1){
        props.updateStates(props.categoryBST.traverse("asc"), null, null);
        customTableVariables.customBSTNodeOrder = "asc";
      }
      else if(sortCounter.current[idx] === 2){
        props.updateStates(props.categoryBST.traverse("desc"), null, null);
        customTableVariables.customBSTNodeOrder = "desc";
      }
      else if(sortCounter.current[idx] === 3){
        resetToDefaultSorting(idx);
      }
    }

    switch(sectionToSort){

      case "category":
        setSortedCategories(1);

        if(sortCounter.current[3] !== 0 || sortCounter.current[2] !== 0){
          sortCounter.current[3] = 0;
          sortCounter.current[2] = 0;
        }

        break;

      case "amount":
        setSortedCategories(2);

        if(sortCounter.current[3] !== 0 || sortCounter.current[1] !== 0){
          sortCounter.current[3] = 0;
          sortCounter.current[1] = 0;
        }

        break;

      case "date":
        setSortedCategories(3);
  
        if(sortCounter.current[1] !== 0 || sortCounter.current[2] !== 0){
          sortCounter.current[1] = 0;
          sortCounter.current[2] = 0;
        }
  
        break;
    }
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    if(props.categoryBST.length === 0){
      setCategoryId(prev => prev = null);
    }

    return()=>{
      setCategoryId(prev => prev = null);
    }
  }, [props.categoryBST]);

  return(
    <div id="custom-table-body">
      <div id="custom-table-body-header">
        <div id="custom-table-body-search-container">
          <img src={searchIcon} alt="search" className="manager-icons" />
          <input type="text" placeholder="Search..." ref={searchBar}
            onKeyUp={searchEntries} disabled={currentURLSearchParams.has("id") ? true : undefined}/>
        </div>
        <button id="custom-table-body-export-button">
          <img src={exportIcon} alt="export" className="manager-icons" />
          <p>Export</p>
        </button>
      </div>
      <div id="custom-table-body-content">
        <div id="custom-table-body-cells-wrapper">
          <div id="custom-table-body-sections">
            <button onClick={()=>sortCategoriesSection("category")}>Category</button>
            <button onClick={()=>sortCategoriesSection("amount")}>Amount</button>
            <p>Initial Amount</p>
            <button onClick={()=>sortCategoriesSection("date")}>Last Updated</button>
          </div>
          <div id="custom-table-body-cells">
            {entries.map((entry) =>
              <CustomTableBodyCell currentCategory={entry} budget={props.budget} categoryBST={props.categoryBST} 
                                    setCategories={props.setCategories} displaySubCategories={displaySubcategories} 
                                    toggleEdit={props.toggleEdit} key={entry.id} setChange={props.setChange}
                                    addToStack={props.addToStack} subcategoryBST={props.subcategoryBST} 
                                    setCategoryId={setCategoryId} setSubcategories={props.setSubcategories} 
                                    subcategories={props.subcategories} updateStates= {props.updateStates}/>
            )}
          </div>
        </div>
        <SubCategory toggleEdit={props.toggleEdit} subcategories={props.subcategories}
                      categoryId={categoryId} setCategories={props.setCategories}
                      setChange={props.setChange} categoryBST={props.categoryBST}
                      addToStack={props.addToStack} tableUse={props.tableUse} 
                      setSubcategories={props.setSubcategories} 
                      subcategoryBST={props.subcategoryBST} 
                      updateStates={props.updateStates} />
      </div>
    </div>
  );
}


function CustomTable(props: {title: string, tableUse: string, stack: Stack<typeof oldData>,
                              categoryBST: CustomBST<TypeCustomTable["customTableEntry"]>, 
                              subcategoryBST: CustomBST<TypeCustomTable["customTableEntry"]>}){

  // ******* States ******* //
  const [categories, setCategories] = useState<BSTNode<TypeCustomTable["customTableEntry"]>[]>([]);
  const [subcategories, setSubcategories] = useState<BSTNode<TypeCustomTable["customTableEntry"]>[]>([]);
  const [toggleInsert, setToggleInsert] = useState<boolean>(false);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [budget, setBudget] = useState<number>(0);
  const [change, setChange] = useState<boolean>(false);
  const [amountInputValue, setAmountInputValue] = useState<string>("");

  // ******* References ******* //
  const categoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);
  const asyncQueue = useRef<RequestQueue>(new RequestQueue());

  // ******* Functions ******* //
  function updateStates(entriesArr: BSTNode<TypeCustomTable["customTableEntry"]>[] | null,
                        subEntriesArr: BSTNode<TypeCustomTable["customTableEntry"]>[] | null,
                        currBudget: number | null): void{
    if(entriesArr){
      setCategories(prev => prev = entriesArr);
    }

    if(subEntriesArr){
      setSubcategories(prev => prev = subEntriesArr);
    }

    if(currBudget){
      setBudget(prev => prev = currBudget);
    } 
  }

  // Function to add changes to a stack for potential 'Undo'
  function addToStack(): void{
    const oldCategories: typeof categories = [];
    const oldSubcategories: typeof subcategories = []

    categories.forEach(node =>{
      oldCategories.push(new BSTNode(node.item, node.value, node.id));
    });

    subcategories.forEach(node =>{
      oldSubcategories.push(new BSTNode(node.item, node.value, node.id));
    })

    props.stack.insert({...oldData, oldEntries: oldCategories, oldSubEntries: oldSubcategories,
      oldBudget: budget});
      console.log(props.stack.items());
  }

  // These two functions are used to set the values of the CustomBST
  // (e.g. sorting/reconstructing the CustomBST).
  // It's an array of numbers (0: Date, 1: Category/Subcategory, 2: Amount).
  function totalAmount(linkId: string, amount: number): number{
    const subEntries = props.subcategoryBST.traverse("desc");
    let summedAmounts: number = amount;

    subEntries.forEach(subEntry =>{
      if(linkId === subEntry.item.linkID){
        summedAmounts += subEntry.item.entryAmount;
      }
    });

    return summedAmounts;
  }

  function setNodeValues(): void{
    const strArr: string[] = [];
    const nodes = props.categoryBST.traverse("asc");

    nodes.forEach(node =>{
      strArr.push(node.item.entryName);
    })

    const longestString: number = findLongestString(strArr);

    nodes.forEach(node =>{
      const weight: number = convertStringToWeight(node.item.entryName, longestString);
      console.log(`Weight: ${weight}`);
      const currentTotalAmount: number = totalAmount(node.item.linkID, node.item.entryAmount);
      props.categoryBST.update(node.id, node.item, [node.value[0], weight, currentTotalAmount], 0);
    });
  }

  async function retrieveDataFromDBAndUpdateTable(requestURL: string): Promise<void>{
    try{
      const returnedData: TypeCustomTable["customTableEntry"][] = await getEntriesRequest(requestURL);

        if(returnedData.length === 0){
          return;
        }

        console.log(returnedData);

        const tempArr1: BSTNode<TypeCustomTable["customTableEntry"]>[] = [];
        const tempArr2: BSTNode<TypeCustomTable["customTableEntry"]>[] = [];

        for(let i: number = 0; i < returnedData.length; i++){
          const currentItem: TypeCustomTable["customTableEntry"] = returnedData[i];

          if(currentItem.isCategory){
            tempArr1.push(new BSTNode<TypeCustomTable["customTableEntry"]>(currentItem, [0, 0, 0], currentItem.id)); 
          }
          else{
            tempArr2.push(new BSTNode<TypeCustomTable["customTableEntry"]>(currentItem, [0, 0, 0], currentItem.id)); 
          }
        }

        props.categoryBST.reconstruct(tempArr1, customTableVariables.customBSTVariable);
        props.subcategoryBST.reconstruct(tempArr2, 0);

        setNodeValues(); //Set sorting values.

        const allCategories: BSTNode<TypeCustomTable["customTableEntry"]>[] = props.categoryBST.traverse(customTableVariables.customBSTNodeOrder);
        const allSubcategories: BSTNode<TypeCustomTable["customTableEntry"]>[] = props.subcategoryBST.traverse("desc");

        updateStates(allCategories, allSubcategories, oldData.oldBudget);
    }
    catch(error){
      console.error(`Something went wrong! ${error}`);
    }
  }
//

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
      const updatedCategories = props.categoryBST.traverse("desc");
      const updatedSubcategories = props.subcategoryBST.traverse("desc");

      setToggleEdit(prev => prev = false);
      updateStates(updatedCategories, updatedSubcategories, oldData.oldBudget);
    }
    else{
      addToStack();
      setToggleEdit(prev => prev = true);
    }
  }

  function insertButtonPeriodChecker(): boolean{

    if(categories.length > 0){
      if(!checkIfSamePeriod(new Date(categories[0].item.dateCreated))){
        return false;
      }
    }

    if(!checkIfSamePeriod(returnDateSearchParamsOr())){
      return false;
    }

    return true;
  }

  function insertButtonHandler(): void{
    const uId: string = uniqueId();
    let newEntryName: string = categoryInput.current!.value;
    const currentTime: number = Date.now();

    if(checkIfInputEmpty(categoryInput.current!) && props.tableUse !== "daily"){
      return;
    }

    if(!insertButtonPeriodChecker()){
      return;
    }

    if(props.tableUse === "daily"){
      if(newEntryName === "" || newEntryName === " "){
        newEntryName = convertDateToString(currentTime);
      }
    }

    props.categoryBST.insert([currentTime, 0, 0, currentTime], {entryName: newEntryName, entryAmount: Number(amountInputValue),
                                      linkID: uId, lastUpdated: currentTime, 
                                      initialAmount: Number(amountInputValue), isCategory: true,
                                      isMonthly: props.tableUse === "monthly" ? true : false,
                                      dateCreated: currentTime, id: uId}, uId, 0);
 
    setNodeValues();
    addToStack();
    setCategories(props.categoryBST.traverse("desc"));
    setChange(prev => prev = true);
    setAmountInputValue(prev => prev = "");
    displayInsert();
  }

  async function saveButtonHandler(): Promise<void>{
    const nodeArray: BSTNode<TypeCustomTable["customTableEntry"]>[] = [...props.categoryBST.traverse("desc"), ...props.subcategoryBST.traverse("desc")];
    const nodeArrayJson: {}[] = [];

    nodeArray.forEach(node =>{
      nodeArrayJson.push({
        "Id": node.id,
        "DateCreated": node.item.dateCreated,
        "LastUpdated": node.item.lastUpdated,
        "EntryName": node.item.entryName,
        "EntryAmount": node.item.entryAmount,
        "InitialAmount": node.item.initialAmount,
        "IsMonthly": node.item.isMonthly,
        "IsCategory": node.item.isCategory,
        "LinkID": node.item.linkID
      });
    });

    const requestString: string = returnRequestURL();

    asyncQueue.current.enqueueRequest(async () => {
      await fetch(requestString, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(nodeArrayJson)
    });
    });

    console.log(JSON.stringify(nodeArrayJson));

    asyncQueue.current.enqueueRequest(()=> retrieveDataFromDBAndUpdateTable(returnRequestURL()));
      setChange(prev => prev = false);
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

    props.categoryBST.reconstruct(previousData.oldEntries, customTableVariables.customBSTVariable);
    props.subcategoryBST.reconstruct(previousData.oldSubEntries, 0);

    const oldCategories = props.categoryBST.traverse(customTableVariables.customBSTNodeOrder);
    const oldSubcategories = props.subcategoryBST.traverse("desc");

    updateStates(oldCategories, oldSubcategories, previousData.oldBudget);
    setToggleEdit(prev => prev = false);
    setChange(prev => prev = true);
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    setCategories(prev => prev = props.categoryBST.traverse("desc"));
    setSubcategories(prev => prev = props.subcategoryBST.traverse("desc"));

    return()=>{
      setCategories(prev => prev = []);
      setSubcategories(prev => prev = []);
    }

  }, [props.categoryBST, props.subcategoryBST]);

  useEffect(()=>{
    setBudget(prev => prev = user.budget);
    oldData.oldBudget = user.budget;

    return()=>{
      setBudget(prev => prev = 0);
    }
  }, [])

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
          <button onClick={displayInsert} className="manager-buttons" disabled={insertButtonPeriodChecker() ? undefined : true}>Insert</button>}
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
      <CustomTableBody categoryBST={props.categoryBST} toggleEdit={toggleEdit} budget={budget}
                        subcategoryBST={props.subcategoryBST} setChange={setChange} 
                        addToStack={addToStack} tableUse={props.tableUse}
                        setSubcategories={setSubcategories} categories={categories} 
                        subcategories={subcategories} setCategories={setCategories} 
                        updateTableFromDB={retrieveDataFromDBAndUpdateTable} 
                        asyncQueue={asyncQueue.current} updateStates={updateStates}/>

      <CustomTableBottom categories={categories} toggleEdit={toggleEdit} budget={budget} subcategories={subcategories}
                          setChange={setChange} />
    </div>
  )
}

export default CustomTable