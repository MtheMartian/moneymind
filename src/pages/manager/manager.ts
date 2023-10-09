import { ChangeEvent, MutableRefObject, useRef, SyntheticEvent } from "react";

export let caretPosition: number = 0;

function validateInput(input: string): boolean{
  return Number.isInteger(Number(input));
}

function editInputsHelper(caretPosition: number, str: string, toAdd: string | null): string{
  let newString: string = str.slice(0, caretPosition) + toAdd;

  if(toAdd === null){
    newString = str.slice(0, caretPosition - 1);
  }

  return newString + str.slice(caretPosition); 
}

export function editInputs(e: ChangeEvent<HTMLInputElement>, currentValue: string, 
                            expectation: string, caretPosition: number): string{
  let inputValue: string = currentValue;
  const input: CompositionEvent = e.nativeEvent as CompositionEvent;

  if(input.data === null){
    inputValue = editInputsHelper(caretPosition, inputValue, null);
    caretPosition--;
  }
  else if((input.data === " " || input.data === ",") && expectation === "number"){
    inputValue = editInputsHelper(caretPosition, inputValue, ".");
    caretPosition++;
  }
  else{
    inputValue = editInputsHelper(caretPosition, inputValue, input.data);
    caretPosition++;
  }

  // if(!validateInput(inputValue) && expectation === "number"){
  //   inputValue = inputValue.slice(0, -1);
  //   e.currentTarget.style.border = "1px solid red";
  // }
  // else{
  //   e.currentTarget.style.cssText = "";
  // }

  console.log(`editInputs: ${caretPosition}`);
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
  caretPosition = currentElement.selectionStart!;
  console.log(caretPosition);
}