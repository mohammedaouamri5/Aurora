
let WSM = null;
let WST = null;

export const websocketMessages = store => next => action => {

  console.log("action type:", action.type);
  switch (action.type) {
    case 'WSM_CONNECT':
      if (WSM !== null) {
        break;
      }

      WSM = new WebSocket(action.payload.url);

      WSM.onopen = () => {
        store.dispatch({ type: 'WSM_CONNECTED' });
      };

      WSM.onmessage = event => {
        console.log(event.data)
        const data = JSON.parse(event.data);
        // store.dispatch({ type: 'WSM_MESSAGE_RECEIVED', Messages: store.getState().Messages, payload: data });
        store.dispatch({ type: 'ADD_MESSAGE', Messages: store.getState().Messages, payload: data });
      };

      WSM.onclose = () => {
        store.dispatch({ type: 'WSM_DISCONNECTED' });
      };

      WSM.onerror = (error) => {
        console.error('WebSocket error:', error);
        store.dispatch({ type: 'WSM_ERROR', payload: error });
      };

    case 'WSM_SEND':
      if (WSM && WSM.readyState === WebSocket.OPEN) {
        WSM.send(JSON.stringify(action.payload));
      }
      break;

    default:
      break;
  }

  return next(action);
};



export const websocketTitel = store => next => action => {

  console.log("action type:", action.type);
  switch (action.type) {
    case 'WST_CONNECT':
      if (WST !== null) {
        break;
      }

      WST = new WebSocket(action.payload.url);

      WST.onopen = () => {
        store.dispatch({ type: 'WST_CONNECTED' });
      };

      
      WST.onmessage = event => {
        console.log(event.data)
        const data = JSON.parse(event.data);

        store.dispatch({ type: 'UPDATE_TITLE',  payload: data , state : store.getState()});
      };

      WST.onclose = () => {
        store.dispatch({ type: 'WST_DISCONNECTED' });
      };

      WST.onerror = (error) => {
        console.error('WebSocket error:', error);
        store.dispatch({ type: 'WST_ERROR', payload: error });
      };

    case 'WST_SEND':
      if (WST && WST.readyState === WebSocket.OPEN) {
        WST.send(JSON.stringify(action.payload));
      }
      break;

    default:
      break;
  }

  return next(action);
};
