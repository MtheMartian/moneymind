import './calendar.css';
import {useEffect, useRef, useState, useMemo, SyntheticEvent} from 'react';
import { Link } from 'react-router-dom';
import { checkIfFullNumber, dateEntries } from './calendarts';
import { RequestQueue } from '../../../ts/general-classes';
import { TypeCustomTable } from '../components/custom-table/custom-table-types';
import { CustomBST, quickSort } from '../../../ts/dsa';
import { returnRequestURL, getEntriesRequest } from '../manager';

// ------- Date Selection ------- //
function CustomDropDown(props: {dateType: string, inputElement: HTMLInputElement | null,
                                setSelectedDropdown: Function, asyncQueue: RequestQueue}){
  // ******* States ******* //
  const [dateTypeArr, setDateTypeArr] = useState<number[]>([]);

  // ******* Functions ******* //
  function addSelectionToArray(elementEvent: SyntheticEvent<HTMLDivElement, MouseEvent>): void{
    if(!props.inputElement){
      return;
    }

    const currElement: HTMLDivElement = elementEvent.currentTarget;

    props.inputElement.value = currElement.textContent!;
    props.setSelectedDropdown(-1);

    switch(props.dateType){
    case "year":
    dateEntries[0] = Number(currElement.textContent);
    break;

    case "month":
    dateEntries[1] = Number(currElement.textContent);
    break;

    case "date":
    dateEntries[2] = Number(currElement.textContent);
    break;
    }
  }

  async function getCustomDropDownContent(): Promise<void>{
    if(props.dateType === "year"){
      const tempMap: Map<number, number> = new Map();
      const requestURL: string = returnRequestURL("all");
      const entries: TypeCustomTable["customTableEntry"][] = await getEntriesRequest(requestURL);

      entries.forEach(entry =>{
        const tempYear: number = new Date(entry.dateCreated).getUTCFullYear();

        if(!tempMap.has(tempYear)){
          tempMap.set(tempYear, 0);
        }
      });

      setDateTypeArr(quickSort(Array.from(tempMap.keys()), "asc"));
      return;
    }

    let counter = 0;
    const numArr: number[] = [];

    switch(props.dateType){
      case "month":
        counter = 12;
        break;

      case "date":
        counter = 31;
        break;
    }

    for(let i: number = 1; i <= counter; i++){
      numArr.push(i);
    }

    setDateTypeArr(numArr);
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    props.asyncQueue.enqueueRequest(getCustomDropDownContent);

    return()=>{
      setDateTypeArr([]);
    }

  }, []);

  return(
    <div>
      {dateTypeArr.map(dateType=>
        <div onClick={addSelectionToArray}>
          {dateType}
        </div>
      )}
    </div>
  )
}

function CalendarCustomDropdown(props: {setCurrentYear: Function, setCurrentMonth: Function, setCurrentDate: Function,
                                        asyncQueue: RequestQueue}){
  // ******* Reference ******* //
  const yearInput = useRef<HTMLInputElement>(null);
  const monthInput = useRef<HTMLInputElement>(null);
  const dateInput = useRef<HTMLInputElement>(null);

  // ******* States ******* //
  const [selectedDropdown, setSelectedDropDown] = useState<number>(-1);

  // ******* Button Handlers ******* //
  function goButtonHandler(): void{
    const currDate: Date = new Date(Date.now());

    // If blank inputs
    if(dateEntries[0] === -1 && dateEntries[1] === -1 && dateEntries[2] === -1){
      yearInput.current!.style.border = "2px solid red";
      monthInput.current!.style.border = "2px solid red";
      dateInput.current!.style.border = "2px solid red";

      return;
    }

    if(dateEntries[0] === -1){
      dateEntries[0] = currDate.getUTCFullYear();
    }

    if(dateEntries[1] === -1){
      dateEntries[1] = currDate.getMonth();
    }

    if(dateEntries[2] === -1){
      dateEntries[2] = 1;
    }

    // Push new URL
    const newURL: string = `/manager/calendar?year=${dateEntries[0]}&month=${dateEntries[1]}&date=${dateEntries[2]}`;
    window.history.pushState(null, "", newURL);
    props.setCurrentYear(dateEntries[0]);
    props.setCurrentMonth(dateEntries[1]);
    props.setCurrentDate(dateEntries[2]);

    yearInput.current!.style.cssText = "";
    monthInput.current!.style.cssText = "";
    dateInput.current!.style.cssText = "";
  }

  function showDropdownButtonHandler(idx: number): void{
    if(selectedDropdown === idx){
      setSelectedDropDown(-1);
      return;
    }
     
    setSelectedDropDown(idx);
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    

  }, [])

  return(
    <div>
      <div>
        <div>
          <input type="text" inputMode='numeric' pattern='pattern=[0-9]*' placeholder='Year'
            ref={yearInput} onChange={checkIfFullNumber}/>
          <button onClick={()=> showDropdownButtonHandler(0)}>Show</button>
        </div>
        {selectedDropdown === 0 ? 
            <CustomDropDown dateType='year' inputElement={yearInput.current} 
              setSelectedDropdown={setSelectedDropDown} asyncQueue={props.asyncQueue} /> : null
        }
        
      </div>
      <div>
        <div>
          <input type="text" placeholder='Month' onChange={checkIfFullNumber} 
            ref={monthInput} />
          <button onClick={()=> showDropdownButtonHandler(1)}>Show</button>
        </div>
        {selectedDropdown === 1 ?
          <CustomDropDown dateType='month' inputElement={monthInput.current} 
            setSelectedDropdown={setSelectedDropDown} asyncQueue={props.asyncQueue} /> : null
        }
      </div>
      <div>
        <div>
          <input type="text" inputMode='numeric' pattern='pattern=[0-9]*' placeholder='Date'
            onChange={checkIfFullNumber} ref={dateInput} />
          <button onClick={()=> showDropdownButtonHandler(2)}>Show</button>
        </div>
        {selectedDropdown === 2 ?
          <CustomDropDown dateType='date' inputElement={dateInput.current} 
            setSelectedDropdown={setSelectedDropDown} asyncQueue={props.asyncQueue} /> : null
        }
      </div>
      <div onClick={goButtonHandler}>Go</div>
    </div>
  )
}

// ------- Calendar Date Box & Date Box content ------- // 
function CalendarDateBoxContent(props: {currentDateItems: TypeCustomTable["customTableEntry"][]}){
  return(
    <div>
      {props.currentDateItems? props.currentDateItems.map(item =>
          item.isCategory ?
          <Link to={item.isMonthly ? `/manager?id=${item.id}` : `/manager/daily?id=${item.id}`}>
            {item.entryName}
          </Link> : null
        ) : null}
    </div>
  )
}

function CalendarDateBox(props:{currDate: Date, dateItemsMap: Map<number, TypeCustomTable["customTableEntry"][]> | null}){
  return(
    <div className="calendar-item-wrapper" id={`calendar-item-wrapper-${props.currDate.getDate()}`}>
      <div className="calendar-item-date">
        <p>{props.currDate.toDateString()}</p>
      </div>
      <div className="calendar-item">
        {props.dateItemsMap? <CalendarDateBoxContent currentDateItems={props.dateItemsMap.get(props.currDate.getDate())!} 
          key={`itemsDate${props.currDate.getDate()}`}/> : null}
      </div>
    </div>
  )
}

// ------- Main Calendar ------- //
function Calendar(){
  // ******* Reference ******* //
  const calendar = useRef<HTMLDivElement>(null);
  const todayDate = useRef<Date>(new Date(Date.now()));
  const asyncQueue = useRef<RequestQueue>(new RequestQueue());

  // ******* States ******* //
  const [currentYear, setCurrentYear] = useState<number>(todayDate.current.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.current.getMonth() + 1);
  const [currentDate, setCurrentDate] = useState<number>(todayDate.current.getDate());
  const [currentDateItems, setCurrentDateItems] = useState<Map<number, TypeCustomTable["customTableEntry"][]> | null>(null);

  const datesArr = useMemo<Date[]>(()=>{
    const tempArr: Date[] = [];
    for(let j: number = 0; j <= 31; j++){
      const currDate: Date = new Date(currentYear, currentMonth - 1, j);
      if(currDate.getMonth() === currentMonth - 1){
        tempArr.push(currDate);
      }
    }

    return tempArr;
  }, [currentYear, currentMonth, currentDate]);

  // ******* UseEffects ******* //
  // Get date options from URL (if present), scroll to today's/selected date.
  useEffect(()=>{
    const currURL: URLSearchParams = new URL(window.location.href).searchParams;

    if(currURL.has("year")){
      setCurrentYear(Number(currURL.get("year")));
    }

    if(currURL.has("month")){
      setCurrentMonth(Number(currURL.get("month")));
    }

    if(currURL.has("date")){
      setCurrentDate(Number(currURL.get("date")));
    }

    if(!currURL.has("year") && !currURL.has("month") && calendar.current){
      const calendarItem = calendar.current.querySelector(`#calendar-item-wrapper-${currentDate}`);
      calendarItem?.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
    }

    if(currURL.has("date") && calendar.current){
      const calendarItem = calendar.current.querySelector(`#calendar-item-wrapper-${currentDate}`);
      calendarItem?.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
    }

  }, [currentYear, currentMonth, currentDate]);

  useEffect(()=>{
    function setDateItemsMap(items: TypeCustomTable["customTableEntry"][]): void{
      const newMap: Map<number, TypeCustomTable["customTableEntry"][]> = new Map();
      const contentBST: CustomBST<TypeCustomTable["customTableEntry"]> = new CustomBST();

      items.forEach(item =>{
        contentBST.insert([item.dateCreated, 0, 0], item, item.id, 0);
      })

      const sortedDateItems = contentBST.traverse("asc");

      sortedDateItems.forEach(item =>{
        const currentItemDate: number = new Date(item.item.dateCreated).getDate();
        if(newMap.has(currentItemDate)){
          newMap.get(currentItemDate)?.push(item.item);
        }
        else{
          newMap.set(currentItemDate, []);
        }
      });

      setCurrentDateItems(newMap);
    }

    async function getEntriesBasedOnDate(): Promise<void>{
      const requestURL: string = `https://localhost:7158/api/tables/period?year=${currentYear}&month=${currentMonth}&date=${currentDate}`;
      try{
        const returnedData: TypeCustomTable["customTableEntry"][] = await getEntriesRequest(requestURL);
        setDateItemsMap(returnedData);
      }
      catch(err){
        console.error(`Woopsies! Couldn't retrieve data for this date. ${err}`);
      }
    }

    asyncQueue.current.enqueueRequest(getEntriesBasedOnDate);

    return()=>{
      setCurrentDateItems(null);
    }
  }, [currentYear, currentMonth, currentDate]);

  return(
    <div id="calendar" ref={calendar}>
      <Link to={`/manager?year=${currentYear}&month=${currentMonth}`} />
      <CalendarCustomDropdown setCurrentYear={setCurrentYear} setCurrentMonth={setCurrentMonth}
                              setCurrentDate={setCurrentDate} asyncQueue={asyncQueue.current} />
      {datesArr.map((date, index) =>
        <CalendarDateBox currDate={date} dateItemsMap={currentDateItems} key={`date${index}`} />
      )}
    </div>
  )
}

export default Calendar