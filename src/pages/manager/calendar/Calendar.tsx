import './calendar.css';
import {useEffect, useRef, useState, useMemo} from 'react';
import { checkIfFullNumber } from './calendarts';

function CalendarContent(){
  
}

function CalendarCustomDropdown(){
  const yearInput = useRef<HTMLInputElement>(null);

  return(
    <div>
      <div>
        <div>
          <input type="text" inputMode='numeric' pattern='pattern=[0-9]*' placeholder='Year'
            ref={yearInput} onChange={(e)=>{checkIfFullNumber(e, "year")}}/>
          <button>Show</button>
        </div>
        <div></div>
      </div>
      <div>
        <div>
          <input type="text" placeholder='Month'/>
          <button>Show</button>
        </div>
        <div></div>
      </div>
      <div>
        <div>
          <input type="text" inputMode='numeric' pattern='pattern=[0-9]*' placeholder='Date'/>
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
  const todayDate = useRef<Date>(new Date(Date.now()));

  const calendar = useRef<HTMLDivElement>(null);
  const [currentYear, setCurrentYear] = useState<number>(todayDate.current.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.current.getMonth());
  const [currentDate, setCurrentDate] = useState<number>(todayDate.current.getDate());



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
    const monthsInt: Map<string, number> = new Map([["january", 0], ["february", 1], ["march", 2], 
                                                    ["april", 3], ["may", 4], ["june", 5],
                                                    ["july", 6], ["august", 7], ["september", 8], 
                                                    ["october", 9], ["november", 10], ["december", 11]]);

    return typeof monthsInt.get(month) !== "undefined" ? monthsInt.get(month)! : todayDate.current.getMonth();
  }


  useEffect(()=>{
    const currURL: URLSearchParams = new URL(window.location.href).searchParams;

    if(currURL.has("year")){
      setCurrentYear(prev => prev = Number(currURL.get("year")));
    }

    if(currURL.has("month")){
      setCurrentMonth(prev => prev = returnMonthInt(currURL.get("month")!));
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