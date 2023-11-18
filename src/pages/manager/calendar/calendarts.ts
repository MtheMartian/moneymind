export function checkIfFullNumber(input: string, calendarType?: string): boolean{

  if(Number.isInteger(Number(input))){

    const inputToNumber: number = Number(input);

    if(calendarType){
      const todayDate: Date = new Date(Date.now());

      switch(calendarType){
        case "year":
          if(inputToNumber < 2023 || inputToNumber > todayDate.getUTCFullYear()){
            return false;
          }
          break;

        case "date":
          if(inputToNumber < 1 || inputToNumber > 31){
            return false;
          }
          break;
      }
    }

    return true;
  }

  return false;
}