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

  getParcels() {
    this.dispatch({
      type: ContextActions.GOT_PARCELS,
      payload: {
        id: "Test"
      }
    });
  }
}
