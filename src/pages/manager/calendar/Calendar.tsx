import './calendar.css';
import {useEffect, useRef, useState, useMemo} from 'react';
import { checkIfFullNumber, monthsInt, todayDate } from './calendarts';

function CalendarContent(){
  
}

function CalendarCustomDropdown(){
  const yearInput = useRef<HTMLInputElement>(null);
  const dateEntries = useRef<number[]>([todayDate.getUTCFullYear(), todayDate.getMonth(), todayDate.getDate()]);

  return(
    <div>
      <div>
        <div>
          <input type="text" inputMode='numeric' pattern='pattern=[0-9]*' placeholder='Year'
            ref={yearInput} onChange={checkIfFullNumber}/>
          <button>Show</button>
        </div>
        <div></div>
      </div>
      <div>
        <div>
          <input type="text" placeholder='Month' onChange={checkIfFullNumber} />
          <button>Show</button>
        </div>
        <div></div>
      </div>
      <div>
        <div>
          <input type="text" inputMode='numeric' pattern='pattern=[0-9]*' placeholder='Date'
            onChange={checkIfFullNumber} />
          <button>Show</button>
        </div>
        <div></div>
      </div>
      <div>Go</div>
    </div>
  )
}

function Calendar(){

  //const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now()));
  

  const calendar = useRef<HTMLDivElement>(null);
  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth());
  const [currentDate, setCurrentDate] = useState<number>(todayDate.getDate());



  const dates = useMemo<Date[]>(()=>{

    const datesArr: Date[] =[];
    for(let j: number = 0; j <= 31; j++){
      const currDate: Date = new Date(currentYear, currentMonth, j);
      if(currDate.getMonth() === currentMonth){
        datesArr.push(currDate);
      }
    }

    return datesArr;
  }, [currentYear, currentMonth]);

  function returnMonthInt(month: string): number{
    month = month.toLowerCase();

    return typeof monthsInt.get(month) !== "undefined" ? monthsInt.get(month)! : todayDate.getMonth();
  }


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
      <CalendarCustomDropdown />
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