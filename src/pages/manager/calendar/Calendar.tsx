import '../components/custom-calendar/custom-calendar.css';

function Calendar(){

  const dates: Date[] = [];
  const todayDate: Date = new Date(Date.now());
  const currentYear: number = todayDate.getFullYear();
  const currentMonth: number = todayDate.getMonth();

  for(let j: number = 0; j < 31; j++){
    const currentDate: Date = new Date(currentYear, currentMonth, j);
    if(currentDate.getMonth() === currentMonth){
      dates.push(currentDate);
    }
  }

  return(
    <div id="calendar">
      {dates.map(date =>
      <div className="calendar-item-wrapper">
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