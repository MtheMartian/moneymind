import { useRef, useState, useEffect, useMemo, 
        SyntheticEvent, ChangeEvent, MouseEventHandler} from 'react';
import './custom-table.css';
import '../../manager.css';
import { TypeCustomTable } from './custom-table-types';
import { user } from '../../../../data/user';
import { editInputs, uniqueId, checkIfInputEmpty, checkIfInputEmptyCell,
          getCaretPosition, caretPosition, findLongestString, convertStringToWeight } from '../../manager';
import { Stack, CustomBST, BSTNode } from '../../../../ts/dsa';
import { oldData, todaysDate, customTableVariables } from './custom-table';
import exportIcon from '../../../../assets/manager-icons/export-48px.svg';
import searchIcon from '../../../../assets/manager-icons/search-48px.svg';
import undoIcon from '../../../../assets/manager-icons/undo-48px.svg';
import deleteIcon from '../../../../assets/manager-icons/delete-48px.svg';

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
                                setChange: Function, addToStack: Function}){

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
  }

  // ******* Button Handlers ******* //
  function deleteButtonHandler(): void{
    props.addToStack();
    props.setChange(true);

    props.subcategoryBST.remove(props.currSubcategory.id, 0);
    props.setSubcategories(props.subcategoryBST.retrieve("desc"));
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
                      tableUse: string, subcategories: BSTNode<TypeCustomTable["customTableEntry"]>[]}){
                        
 // ******* States ******* //
  const [addSubcategoryForm, setAddSubCategoryForm] = useState<boolean>(false);
  const [amountInputValue, setAmountInputValue] = useState<string>("");

  // ******* References ******* //
  const subCategoryInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

   // ******* Memo ******* //
   const categorySelected = useMemo<string | null>(()=>{
    if(props.categoryId){
      const retrievedCategory = props.categoryBST.retrieve(props.categoryId);
      if(retrievedCategory){
        return retrievedCategory.item.entryName;
      }
    }
    return null;
  }, [props.categoryId]);

   const subcategories = useMemo<BSTNode<TypeCustomTable["customTableEntry"]>[]>(()=>{
    return props.subcategoryBST.traverse("desc");
  }, [props.subcategories]);

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

    if(props.tableUse === "daily"){
      if(subcategoryString === "" || subcategoryString === " "){
        subcategoryString = todaysDate();
      }
    }
    props.subcategoryBST.insert([currDate, 0, 0], {entryName: subcategoryString, 
                                          entryAmount: Number(amountInput.current!.value),
                                          entryId: props.categoryId, lastUpdated: currDate,
                                          initalAmount: Number(amountInput.current!.value)}, uId, 0);                             

    props.setSubcategories(props.subcategoryBST.traverse("desc"));
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
        {subcategories.length === 0 && props.categoryId ? <p>Empty</p> : null}
        {subcategories.map(subcategory =>
          subcategory.item.entryId && subcategory.item.entryId === props.categoryId ? 
          <SubCategoryCell currSubcategory={subcategory} subcategoryBST={props.subcategoryBST} 
                            setSubcategories={props.setSubcategories} toggleEdit={props.toggleEdit} 
                            key={subcategory.id} setChange={props.setChange} 
                            addToStack={props.addToStack}/> : null
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
                              setCategoryId: Function, subcategories: BSTNode<TypeCustomTable["customTableEntry"]>[]}){

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
      if(subcategory.item.entryId === props.currentCategory.id){
        props.subcategoryBST.remove(subcategory.id, customTableVariables.customBSTVariable);
      }
    });
  }

  function totalAmount(): number{
    const subEntries = props.subcategoryBST.traverse("desc");
    let summedAmounts: number = props.currentCategory.item.entryAmount;

    subEntries.forEach(subEntry =>{
      if(props.currentCategory.id === subEntry.item.entryId){
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
    props.categoryBST.update(currCategory.id, {...currCategory.item, entryAmount: Number(inputs)}, 
                            currCategory.value, customTableVariables.customBSTVariable);
    setAmountValue(prev => prev = inputs);
  }

  function categoryUpdate(e: ChangeEvent<HTMLInputElement>): void{
    props.setChange(true);
    const currentElement: HTMLInputElement = e.currentTarget;

    const inputs: string = editInputs(e, categoryValue, "string");
    const currCategory = props.currentCategory;
    setCategoryValue(prev => prev = inputs);

    if(checkIfInputEmpty(currentElement)){
      return;
    }

    props.categoryBST.update(currCategory.id, {...currCategory.item, entryName: inputs}, 
                            currCategory.value, customTableVariables.customBSTVariable);
  }

   // ******* Button Handlers ******* //
  function deleteButtonHandler(): void{
    props.addToStack();
    props.setChange(true);
    props.categoryBST.remove(props.currentCategory.id, customTableVariables.customBSTVariable);
    clearAssociatedSubcategories();
    props.setCategories(props.categoryBST.traverse(customTableVariables.customBSTNodeOrder));
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
                                subcategories: BSTNode<TypeCustomTable["customTableEntry"]>[]}){

  // ******* Reference ******* //
  const sortCounter = useRef<number[]>([0, 0, 0]);

   // ******* States ******* //
  const [categoryId, setCategoryId] = useState<string | null>(null);

   // ******* Memo ******* //
  const entries = useMemo<BSTNode<TypeCustomTable["customTableEntry"]>[]>(()=>{
    return props.categories;
  }, [props.categories]);

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
      props.setCategories(props.categoryBST.traverse("desc"));
      customTableVariables.customBSTNodeOrder = "desc";
    }

    function setSortedCategories(idx: number): void{
      customTableVariables.customBSTVariable = idx;
      sortCounter.current[idx]++;
      props.categoryBST.reconstruct(props.categories, idx);

      if(sortCounter.current[idx] === 1){
        props.setCategories(props.categoryBST.traverse("asc"));
        customTableVariables.customBSTNodeOrder = "asc";
      }
      else if(sortCounter.current[idx] === 2){
        props.setCategories(props.categoryBST.traverse("desc"));
        customTableVariables.customBSTNodeOrder = "desc";
      }
      else if(sortCounter.current[idx] === 3){
        resetToDefaultSorting(idx);
      }
    }

    switch(sectionToSort){
      case "date":
        setSortedCategories(0);

        if(sortCounter.current[1] !== 0 || sortCounter.current[2] !== 0){
          sortCounter.current[1] = 0;
          sortCounter.current[2] = 0;
        }

        break;

      case "category":
        setSortedCategories(1);

        if(sortCounter.current[0] !== 0 || sortCounter.current[2] !== 0){
          sortCounter.current[0] = 0;
          sortCounter.current[2] = 0;
        }

        break;

      case "amount":
        setSortedCategories(2);

        if(sortCounter.current[0] !== 0 || sortCounter.current[1] !== 0){
          sortCounter.current[0] = 0;
          sortCounter.current[1] = 0;
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
                                    subcategories={props.subcategories}/>
            )}
          </div>
        </div>
        <SubCategory toggleEdit={props.toggleEdit} subcategories={props.subcategories}
                      categoryId={categoryId} setCategories={props.setCategories}
                      setChange={props.setChange} categoryBST={props.categoryBST}
                      addToStack={props.addToStack} tableUse={props.tableUse} 
                      setSubcategories={props.setSubcategories} 
                      subcategoryBST={props.subcategoryBST} />
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

  // ******* Functions ******* //
  function updateStates(entriesArr: BSTNode<TypeCustomTable["customTableEntry"]>[],
                        subEntriesArr: BSTNode<TypeCustomTable["customTableEntry"]>[],
                        currBudget: number): void{
    setBudget(prev => prev = currBudget);
    setCategories(prev => prev = entriesArr);
    setSubcategories(prev => prev = subEntriesArr);
  }

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

  function updateCustomBSTNodes(nodes: BSTNode<TypeCustomTable["customTableEntry"]>[],
                                  targetTree: string): BSTNode<TypeCustomTable["customTableEntry"]>[]{

    if(nodes.length === 0){
      if(targetTree === "category"){
        props.categoryBST.clear();
        props.subcategoryBST.clear();
        return [];
      }
      else if(targetTree === "subcategory"){
        props.subcategoryBST.clear();
        return [];
      }
    }                

    nodes.forEach(node =>{
      if(targetTree === "category"){
        props.categoryBST.update(node.id, node.item, node.value, customTableVariables.customBSTVariable);
      }
      else if(targetTree === "subcategory"){
        props.subcategoryBST.update(node.id, node.item, node.value, 0);
      }
    });

    if(targetTree === "subcategory"){
      return props.subcategoryBST.traverse("desc");
    }

    return props.categoryBST.traverse(customTableVariables.customBSTNodeOrder);
  }

  // These two functions are used to set the values of the CustomBST
  // (e.g. sorting/reconstructing the CustomBST).
  // It's an array of numbers (0: Date, 1: Category/Subcategory, 2: Amount).
  function totalAmount(entryId: string, amount: number): number{
    const subEntries = props.subcategoryBST.traverse("desc");
    let summedAmounts: number = amount;

    subEntries.forEach(subEntry =>{
      if(entryId === subEntry.item.entryId){
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
      const currentTotalAmount: number = totalAmount(node.id, node.item.entryAmount);
      props.categoryBST.update(node.id, node.item, [node.value[0], weight, currentTotalAmount], 0);
    });
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

  function insertButtonHandler(): void{
    const uId: string = uniqueId();
    let newEntryName: string = categoryInput.current!.value;
    const currentTime: number = Date.now();

    if(checkIfInputEmpty(categoryInput.current!) && props.tableUse !== "daily"){
      return;
    }

    if(props.tableUse === "daily"){
      if(newEntryName === "" || newEntryName === " "){
        newEntryName = todaysDate();
      }
    }

    props.categoryBST.insert([currentTime, 0, 0], {entryName: newEntryName, entryAmount: Number(amountInputValue),
                                      entryId: null, lastUpdated: currentTime, 
                                      initalAmount: Number(amountInputValue)}, uId, 0);
 
    setNodeValues();
    addToStack();
    setCategories(props.categoryBST.traverse("desc"));
    setChange(prev => prev = true);
    setAmountInputValue(prev => prev = "");
    displayInsert();
  }

  function saveButtonHandler(): void{
    setChange(prev => prev = false);
    updateStates(categories, subcategories, oldData.oldBudget);
    
    categories.forEach(node =>{
      props.categoryBST.update(node.id, node.item, node.value, 0);
    });

    subcategories.forEach(node =>{
      props.subcategoryBST.update(node.id, node.item, node.value, 0);
    });
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
      <CustomTableBody categoryBST={props.categoryBST} toggleEdit={toggleEdit} budget={budget}
                        subcategoryBST={props.subcategoryBST} setChange={setChange} 
                        addToStack={addToStack} tableUse={props.tableUse}
                        setSubcategories={setSubcategories} categories={categories} 
                        subcategories={subcategories} setCategories={setCategories} />

      <CustomTableBottom categories={categories} toggleEdit={toggleEdit} budget={budget} subcategories={subcategories}
                          setChange={setChange} />
    </div>
  )
}

export default CustomTable