import { useRef, useState, useEffect, MouseEventHandler } from 'react';
import '../css/moneymanager/table.css';
import { TypeCustomTable } from '../types/custom-table-types';

function CustomTableSubCategories(){
  return(
    <div>

    </div>
  )
}


function CustomTableBody(props: {tableCategoryMap: TypeCustomTable["categoryMap"]}){
  const [categories, setCategories] = useState<TypeCustomTable["categoryEntries"]>([]);

  return(
    <div>
      {categories.map((category, index) =>
        <div data-id={category[0]}>
          <div>
            <input type="text" ref={categoryInput} />
            <input type="text" ref={amountInput} />
          </div>
        </div>
      )}
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
