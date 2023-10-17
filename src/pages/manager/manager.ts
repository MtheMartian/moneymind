import { ChangeEvent, SyntheticEvent } from "react";

// ******* General ******* //
export function uniqueId(): string{

  const prefix: string = "uniqueId-";
  const timeStamp: string = Date.now().toString(36);
  let counter: number = 0;
  return `${prefix}${timeStamp}-${counter++}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
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
function findLongestString(strArr: string[]): number{
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

function convertStringsToWeights(strArr: string[]): Map<number, string[]>{
  const longestString: number = findLongestString(strArr);
  const weightedStringsMap: Map<number, string[]> = new Map(); 

  strArr.forEach((currStr, index) =>{
    currStr = currStr.toLowerCase();
    let weight: string = "";

    if(Number.isInteger(Number(currStr[0]))){
      if(weightedStringsMap.get(0) !== undefined){
        const currItem: string[] = weightedStringsMap.get(0)!;
        currItem.unshift(currStr);

        weightedStringsMap.set(0, currItem);
      }
      else{
        weightedStringsMap.set(0, [currStr]);
      }
    }
    else{
      for(let i: number = 0; i < currStr.length; i++){
        weight += returnWeight(currStr[i]);
      }
    
      for(let i: number = 0; i < (longestString - currStr.length); i++){
        weight += "00";
      }

      if(weightedStringsMap.get(Number(weight)) !== undefined){
        const currItem: string[] = weightedStringsMap.get(Number(weight))!;
        currItem.unshift(currStr);

        weightedStringsMap.set(Number(weight), currItem);
      }
      else{
        weightedStringsMap.set(Number(weight), [currStr]);
      }
    }
  })

  return weightedStringsMap;
}

