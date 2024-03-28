import { ChangeEvent, SyntheticEvent } from "react";
import { TypeCustomTable } from "../../components/custom-table/custom-table-types";

// ******* General ******* //
export function uniqueId(): string{

  const prefix: string = "uniqueId-";
  const timeStamp: string = Date.now().toString(36);
  let counter: number = 0;
  return `${prefix}${timeStamp}-${counter++}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
}

export const prefixURLTables: string = "/budget/table";

// ******* Request URLs ******* //
export const currentURLSearchParams: URLSearchParams = new URL(window.location.href).searchParams;
const currentDate: Date = new Date(Date.now());

export function returnRequestURL(requestFor?: string, input?: string): string{
  const tempStr = currentURLSearchParams.get("year");
  const tempStr2 = currentURLSearchParams.get("month");

  switch(requestFor){
    case "search":
      if(currentURLSearchParams.has("year")|| currentURLSearchParams.has("month")){
        return `${prefixURLTables}/search?entry=${input ? input : "<Empty>"}&year=${tempStr ? tempStr : currentDate.getUTCFullYear()}&month=${tempStr2 ? tempStr2 : currentDate.getUTCMonth() + 1}`;
      }

      break;

    case "save":
      if(currentURLSearchParams.has("id")){
        const tempStr: string | null = currentURLSearchParams.get("id");
    
        if(tempStr){
          return `${prefixURLTables}/entry?id=${tempStr}`;
        }
      }
    
      if(currentURLSearchParams.has("year") || currentURLSearchParams.has("month")){
        return `${prefixURLTables}/period?year=${tempStr ? tempStr : currentDate.getUTCFullYear()}&month=${tempStr2 ? tempStr2 : currentDate.getUTCMonth() + 1}`;
      }

      break;

    case "all":
      return `${prefixURLTables}`;
  }

  return `${prefixURLTables}/period?year=${tempStr ? tempStr : currentDate.getUTCFullYear()}&month=${tempStr2 ? tempStr2 : currentDate.getUTCMonth() + 1}`;
}

/**
 * Default is the date from search params.
 * @returns Date
 */
export function returnDateSearchParamsOr(input?: number): Date{
  const year = currentURLSearchParams.get("year");
  const month = currentURLSearchParams.get("month");

  if(!year || !month){
    return new Date();
  }

  const dateString: string = `${year}-${month}-01`;
  let dateFromParams: Date = input !== undefined ? new Date(input) : new Date(dateString);

  return dateFromParams;
}

export function checkIfSamePeriod(inputDate: Date): boolean{
  if(inputDate.getUTCFullYear() !== currentDate.getUTCFullYear() ||
      inputDate.getUTCMonth() !== currentDate.getUTCMonth()){
        return false;
      }

      return true;
}

export async function getEntriesRequest(requestURL: string):Promise<TypeCustomTable["customTableEntry"][]>{
  const response: Response = await fetch(requestURL);
  const returnedData: TypeCustomTable["customTableEntry"][] = await response.json();

  return returnedData;
}

// ******* Text Inputs ******* //
export let caretPosition: number = 0;
let caretPositionEnd: number | null = null;

function checkIfNumber(input: string): boolean{
  let dotCount: number = 0;

  for(let i : number = 0; i < input.length; i++){
    if(input[i] === '.'){
      dotCount++;
    }
  }

  if(dotCount > 1 || input[0] === '-'){
    return false;
  }


  if(Number.isFinite(Number(input))){
    return true;
  }

  return false;
}

function updateCaretPosition(newString: string, strToAdd: string | null): void{
  if(strToAdd === null && caretPositionEnd === null){
    caretPosition = caretPosition - 1;
    return;
  }

  if(caretPositionEnd){
    caretPositionEnd = null;

    if(strToAdd){
      caretPosition = newString.length;
    }

    return;
  }

  caretPosition = caretPosition + 1;
}

function stringReconstructor(str: string, toAdd: string | null): string{

  let newString: string = str.slice(0, caretPosition) + toAdd;
  const ending: string = str.slice(caretPosition);

  if(toAdd === null && caretPositionEnd === null){
    newString = str.slice(0, caretPosition - 1);

    return newString + ending;
  }

  if(caretPositionEnd && toAdd){
    newString = str.replace(str.substring(caretPosition, caretPositionEnd), toAdd);
    return newString;
  }
  else if(caretPositionEnd && !toAdd){
    newString = str.replace(str.substring(caretPosition, caretPositionEnd), "");
    return newString;
  }

  return newString + ending; 
}

export function editInputs(e: ChangeEvent<HTMLInputElement>, currentValue: string, 
                            expectation: string): string{

  const inputValue: string = currentValue;
  const input: CompositionEvent = e.nativeEvent as CompositionEvent;
  let newString: string = stringReconstructor(inputValue, input.data);

  if((input.data === " " || input.data === ",") && expectation === "number"){
    newString = stringReconstructor(inputValue, ".");
  }

  if(expectation === "number" && input.data !== null){
    if(checkIfNumber(newString)){
      e.currentTarget.style.cssText = "";
    }
    else{
      e.currentTarget.style.border = "2px solid red";
      return inputValue;
    }
  }

  updateCaretPosition(newString, input.data);

  return newString;
}

export function checkIfInputEmptyCell(e: ChangeEvent<HTMLInputElement>): boolean{

  const currentElement: HTMLInputElement = e.nativeEvent.currentTarget! as HTMLInputElement;
  console.log(currentElement);

  if(currentElement.value.length === 0 || currentElement.value === " "){
    currentElement.style.border = "2px solid red";

    return true;
  }

  currentElement.style.cssText = "";

  return false;
}

export function getCaretPosition(e: SyntheticEvent<HTMLInputElement, MouseEvent>): void{

  const currentElement: HTMLInputElement = e.currentTarget;
  const selection = currentElement.value.substring(currentElement.selectionStart!, currentElement.selectionEnd!);
  caretPosition = currentElement.selectionStart!;
  caretPositionEnd = null;

  if(selection !== ""){
    caretPositionEnd = currentElement.selectionEnd!;
  }
}

export function checkIfInputEmpty(element: HTMLInputElement): boolean{

  if(element.value.length === 0 || element.value === " "){
    element.style.border = "2px solid red";

    return true;
  }
  
  element.style.cssText = "";
  
  return false;
}

// ******* String to weight ******* //
export function findLongestString(strArr: string[]): number{
  let longest: number = strArr[0].length;

  for(let i: number = 1; i < strArr.length; i++){
    if(strArr[i].length > longest){
      longest = strArr[i].length;
    }
  }

  return longest;
}

function returnWeight(char: string): string{
  const letters = new Map([['a', '01'], ['b', '02'], ['c', '03'], ['d', '04'],
                          ['e', '05'], ['f', '06'], ['g', '07'], ['h', '08'],
                          ['i', '09'], ['j', '10'], ['k', '11'], ['l', '12'],
                          ['m', '13'], ['n', '14'], ['o', '15'], ['p', '16'],
                          ['q', '17'], ['r', '18'], ['s', '19'], ['t', '20'],
                          ['u', '21'], ['v', '22'], ['w', '23'], ['x', '24'],
                          ['y', '25'], ['z', '26']]);
  
    if(letters.get(char) === undefined){
      return "00";
    }
  
  return letters.get(char)!;
}

export function convertStringToWeight(str: string, strLength: number): number{
  const longestString: number = strLength;

  str = str.toLowerCase();
  let weight: string = "";

  for(let i: number = 0; i < str.length; i++){
    weight += returnWeight(str[i]);
  }

  for(let i: number = 0; i < (longestString - str.length); i++){
    weight += "00";
  }

  return Number(weight);
}

export function convertDateToString(currentDateMS: number): string{
  const currentDate: Date = new Date(currentDateMS);
  const month: number = currentDate.getMonth() + 1;
  return `${currentDate.getFullYear()}/${month}/${currentDate.getDate()}`;
}

export function highlightElementError(element: HTMLInputElement, correct: boolean): void{
  if(!correct){
    element.style.border = "2px solid red";
    return;
  }

  element.style.border = "2px solid rgb(111, 252, 195)";
}

