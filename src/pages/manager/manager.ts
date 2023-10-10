import { ChangeEvent, SyntheticEvent } from "react";

export let caretPosition: number = 0;
let caretPositionEnd: number | null = null;

function validateInput(input: string): boolean{
  return Number.isInteger(Number(input));
}

function editInputsHelper(str: string, toAdd: string | null): string{
  let newString: string = str.slice(0, caretPosition) + toAdd;
  const ending: string = str.slice(caretPosition);

  if(toAdd === null && caretPositionEnd === null){
    newString = str.slice(0, caretPosition - 1);
    caretPosition = caretPosition - 1;

    return newString + ending;
  }

  if(caretPositionEnd && toAdd){
    newString = str.replace(str.substring(caretPosition, caretPositionEnd), toAdd);
    caretPosition = newString.length;
    caretPositionEnd = null;
    return newString;
  }
  else if(caretPositionEnd && !toAdd){
    newString = str.replace(str.substring(caretPosition, caretPositionEnd), "");
    caretPositionEnd = null;
    return newString;
  }

  caretPosition = caretPosition + 1;
  return newString + ending; 
}

export function editInputs(e: ChangeEvent<HTMLInputElement>, currentValue: string, 
                            expectation: string): string{
  let inputValue: string = currentValue;
  const input: CompositionEvent = e.nativeEvent as CompositionEvent;

  if((input.data === " " || input.data === ",") && expectation === "number"){
    inputValue = editInputsHelper(inputValue, ".");
  }
  else{
    inputValue = editInputsHelper(inputValue, input.data);
  }

  // if(!validateInput(inputValue) && expectation === "number"){
  //   inputValue = inputValue.slice(0, -1);
  //   e.currentTarget.style.border = "1px solid red";
  // }
  // else{
  //   e.currentTarget.style.cssText = "";
  // }

  return inputValue;
}

export function uniqueId(): string{
  const prefix: string = "uniqueId-";
  const timeStamp: string = Date.now().toString(36);
  let counter: number = 0;
  return `${prefix}${timeStamp}-${counter++}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
}

export function checkIfInputEmpty(element: HTMLInputElement): boolean{
  if(element.value.length === 0 || element.value === " "){
    element.style.border = "2px solid red";

    return true;
  }
  
  element.style.cssText = "";
  
  return false;
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