import './calendar.css';
import {useEffect, useRef, useState, useMemo, SyntheticEvent} from 'react';
import { checkIfFullNumber, monthsInt, todayDate } from './calendarts';

function CalendarContent(){
  
}

function CustomDropDown(props: {dateType: string}){
  const [dateTypeArr, setDateTypeArr] = useState<number[]>([]);

  // ******* Functions ******* //
  function addSelectionToArray(elementEvent: SyntheticEvent<HTMLDivElement, MouseEvent>): void{
    const currElement: HTMLDivElement = elementEvent.currentTarget;

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
  const dateEntries = useRef<number[]>([todayDate.getUTCFullYear(), todayDate.getMonth(), todayDate.getDate()]);

  // ******* States ******* //
  const [years, setYears] = useState<number[]>([]);
  const [months, setMonths] = useState<number[]>([]);
  const [dates, setDates] = useState<number[]>([]);

  // ******* Functions ******* //
  function addSelectionToArray(elementEvent: SyntheticEvent<HTMLDivElement, MouseEvent>,
                                dateType: string): void{
    const currElement: HTMLDivElement = elementEvent.currentTarget;

    switch(dateType){
      case "year":
        dateEntries.current[0] = Number(currElement.textContent);
        break;

      case "month":
        dateEntries.current[1] = Number(currElement.textContent);
        break;

      case "date":
        dateEntries.current[2] = Number(currElement.textContent);
        break;
    }
  }

  // ******* Button Handlers ******* //
  function goButtonHandler(): void{
    props.setCurrentYear(dateEntries.current[0]);
    props.setCurrentMonth(dateEntries.current[1]);
    props.setCurrentDate(dateEntries.current[2]);
  }

  // ******* UseEffects ******* //
  useEffect(()=>{
    setYears(prev => prev = [2023]);
    setMonths(prev => prev = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    setDates(prev => prev = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);

  }, [])

  return(
    <div>
      <div>
        <div>
          <input type="text" inputMode='numeric' pattern='pattern=[0-9]*' placeholder='Year'
            ref={yearInput} onChange={checkIfFullNumber}/>
          <button>Show</button>
        </div>
        
      </div>
      <div>
        <div>
          <input type="text" placeholder='Month' onChange={checkIfFullNumber} />
          <button>Show</button>
        </div>
        <div>
          {months.map(month=>
            <div onClick={(e)=> addSelectionToArray(e, "month")}>
              {month}
            </div>
          )}
        </div>
      </div>
      <div>
        <div>
          <input type="text" inputMode='numeric' pattern='pattern=[0-9]*' placeholder='Date'
            onChange={checkIfFullNumber} />
          <button>Show</button>
        </div>
        <div>
          {dates.map(date=>
            <div onClick={(e)=> addSelectionToArray(e, "date")}>
              {date}
            </div>
          )}
        </div>
      </div>
      <div onClick={goButtonHandler}>Go</div>
    </div>
  )
}

function Calendar(){
  
  // ******* Reference ******* //
  const calendar = useRef<HTMLDivElement>(null);

  // ******* States ******* //
  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth());
  const [currentDate, setCurrentDate] = useState<number>(todayDate.getDate());
  const [dates, setDates] = useState<Date[]>([]);

  // ******* UseEffects ******* //
  // Setup the calendar
  useEffect(()=>{
    const datesArr: Date[] =[];
    for(let j: number = 0; j <= 31; j++){
      const currDate: Date = new Date(currentYear, currentMonth, j);
      if(currDate.getMonth() === currentMonth){
        datesArr.push(currDate);
      }
    }

    setDates(prev => prev = datesArr);

    return()=>{
      setDates(prev => prev = []);
    }
  }, [currentYear, currentMonth, currentDate]);

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
      calendarItem!.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
    }

    if(currURL.has("date") && calendar.current){
      const calendarItem = calendar.current.querySelector(`#calendar-item-wrapper-${currentDate}`);
      calendarItem!.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
    }

  }, [currentYear, currentMonth, currentDate]);

  return(
    <div id="calendar" ref={calendar}>
      <CalendarCustomDropdown setCurrentYear={setCurrentYear} setCurrentMonth={setCurrentMonth}
                              setCurrentDate={setCurrentDate} />
      {dates.map(date =>
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