import parcels from '../data/parcel.json';

// Actions
const ContextActions = Object.freeze({
  GOT_PARCELS: 'GOT_PARCELS',
});

export default class ContextService {

  static reduce(action) {
    const { type, payload } = action;
    switch (type) {
      case ContextActions.GOT_PARCELS:
        return {
          parcels: payload
        };
      default:
        return {};
    }
  }

  static canReduce(action) {
    return action.type in ContextActions;
  }

  setStateDispatch(state, dispatch) {
    this.state = state;
    this.dispatch = dispatch;
  }

  getParcels() {
    const myParcels = parcels.slice(0, 5);
    this.dispatch({
      type: ContextActions.GOT_PARCELS,
      payload: myParcels // get first 5 parcels
    });
  }
}
