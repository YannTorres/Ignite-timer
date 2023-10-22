import { produce } from 'immer'

import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
  if (action.type === ActionTypes.Add_New_Cycle) {
    // return {
    //   ...state,
    //   cycles: [...state.cycles, action.payload.newCycle],
    //   activeCycleId: action.payload.newCycle.id,
    // }
    return produce(state, (draft) => {
      draft.cycles.push(action.payload.newCycle)
      draft.activeCycleId = action.payload.newCycle.id
    })
  }

  if (action.type === ActionTypes.Interrupt_Current_Cycle) {
    // return {
    //   ...state,
    //   cycles: state.cycles.map((cycle) => {
    //     if (cycle.id === state.activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    //   activeCycleId: null,
    // }

    const currentCycleIndex = state.cycles.findIndex((cycle) => {
      return cycle.id === state.activeCycleId
    })
    // Quando não for achado nenhum index é retornado -1.
    if (currentCycleIndex < 0) {
      return state
    }

    return produce(state, (draft) => {
      draft.activeCycleId = null
      draft.cycles[currentCycleIndex].interruptedDate = new Date()
    })
  }

  if (action.type === ActionTypes.Mark_Current_Cycle_As_Finished) {
    return {
      ...state,
      cycles: state.cycles.map((cycle) => {
        if (cycle.id === state.activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
      activeCycleId: null,
    }
  }

  return state
}
