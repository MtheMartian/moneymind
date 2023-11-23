import './calendar.css';
import {useEffect, useRef, useState, useMemo, SyntheticEvent} from 'react';
import { checkIfFullNumber, dateEntries } from './calendarts';

function CalendarContent(){
  
}

function CustomDropDown(props: {dateType: string, inputElement: HTMLInputElement | null,
                                setSelectedDropdown: Function}){
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

  // ******* UseEffects ******* //
  useEffect(()=>{
    switch(props.dateType){
      case "year":
        setDateTypeArr(prev => prev = [2023]);
        break;

      case "month":
        setDateTypeArr(prev => prev = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        break;

      case "date":
        setDateTypeArr(prev => prev = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
        break;
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

function CalendarCustomDropdown(props: {setCurrentYear: Function, setCurrentMonth: Function, setCurrentDate: Function}){
  // ******* Reference ******* //
  const yearInput = useRef<HTMLInputElement>(null);
  const monthInput = useRef<HTMLInputElement>(null);
  const dateInput = useRef<HTMLInputElement>(null);

  // ******* States ******* //
  const [selectedDropdown, setSelectedDropDown] = useState<number>(-1);

  // ******* Button Handlers ******* //
  function goButtonHandler(): void{
    const newURL: string = `/manager/calendar?year=${dateEntries[0]}&month=${dateEntries[1]}&date=${dateEntries[2]}`;
    window.history.pushState(null, "", newURL);
    props.setCurrentYear(dateEntries[0]);
    props.setCurrentMonth(dateEntries[1]);
    props.setCurrentDate(dateEntries[2]);
  }

  function showDropdownButtonHandler(idx: number): void{
    if(selectedDropdown === idx){
      setSelectedDropDown(prev => prev = -1);
      return;
    }
     
    setSelectedDropDown(prev => prev = idx);
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
              setSelectedDropdown={setSelectedDropDown}/> : null
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
            setSelectedDropdown={setSelectedDropDown}/> : null
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
            setSelectedDropdown={setSelectedDropDown}/> : null
        }
      </div>
      <div onClick={goButtonHandler}>Go</div>
    </div>
  )
}

function Calendar(){
  
  // ******* Reference ******* //
  const calendar = useRef<HTMLDivElement>(null);
  const todayDate = useRef<Date>(new Date(Date.now()));

  // ******* States ******* //
  const [currentYear, setCurrentYear] = useState<number>(todayDate.current.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.current.getMonth() + 1);
  const [currentDate, setCurrentDate] = useState<number>(todayDate.current.getDate());

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
      setCurrentYear(prev => prev = Number(currURL.get("year")));
    }

    if(currURL.has("month")){
      setCurrentMonth(prev => prev = Number(currURL.get("month")));
    }

    if(currURL.has("date")){
      setCurrentDate(prev => prev = Number(currURL.get("date")));
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

  return(
    <div id="calendar" ref={calendar}>
      <CalendarCustomDropdown setCurrentYear={setCurrentYear} setCurrentMonth={setCurrentMonth}
                              setCurrentDate={setCurrentDate} />
      {datesArr.map(date =>
      <div className="calendar-item-wrapper" id={`calendar-item-wrapper-${date.getDate()}`}>
        <div className="calendar-item-date">
          <p>{date.toDateString()}</p>
        </div>
        <div className="calendar-item">content</div>
      </div>
      )}
    </div>
  )
}

export default Calendar