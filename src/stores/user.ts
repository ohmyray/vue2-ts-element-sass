import { ActionContext } from 'vuex'

type IState = {
  name: string
}

const state: IState = {
  name: 'zs'
}

const getters = {
  name: state => state.name
}

const actions = {
  setName ({ state }: ActionContext<IState, any>, payload: string): void {
    state.name = payload
  }
}

export default {
  state,
  getters,
  actions
}