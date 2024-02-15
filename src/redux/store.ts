import { configureStore, Action, ConfigureStoreOptions } from "@reduxjs/toolkit";

type StateType = {
  defaultState: {
    monthlyTableState: number,
    dailyTableState: number,
    calendarState: number
  }
}

const initialState: StateType["defaultState"] = {
  monthlyTableState: 0,
  dailyTableState: 0,
  calendarState: 0
};

const reducer = (state: StateType["defaultState"] = initialState, action: Action) : {} => {
  switch(action.type){
    case "UPDATE_MONTHLY_STATE":
      return {...state, monthlyTableState: 1};

    case "UPDATE_DAILY_STATE":
      return {...state, dailyTableState: 2};

    case "UPDATE_CALENDAR_STATE":
      return {...state, calendarState: 3};

    case "RESET_MONTHLY_STATE":
      return {...state, monthlyTableState: 0};

    default:
      return state;
  }
};

export const updateMonthlyState = () => ({
  type: "UPDATE_MONTHLY_STATE"
});

export const updateDailyState = () => ({
  type: "UPDATE_DAILY_STATE"
});

export const updateCalendarState = () => ({
  type: "UPDATE_CALENDAR_STATE"
});

const configureStoreOptions: ConfigureStoreOptions = {reducer: reducer}

export const store = configureStore(configureStoreOptions);

export type ReduxStates = StateType;
