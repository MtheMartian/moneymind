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

const reducer = (state: StateType["defaultState"] = initialState, action: Action) : StateType["defaultState"] => {
  switch(action.type){
    case "UPDATE_MONTHLY_STATE":
      return {...state, monthlyTableState: state.monthlyTableState === 1 ? 0 : 1};

    case "UPDATE_DAILY_STATE":
      return {...state, dailyTableState: state.dailyTableState === 2 ? 0 : 2};

    case "UPDATE_CALENDAR_STATE":
      return {...state, calendarState: state.calendarState === 3 ? 0 : 3};

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
