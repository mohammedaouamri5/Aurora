
let socket = null;

export const websocketMessages = store => next => action => {

  console.log("action type:", action.type);
  switch (action.type) {
    case 'WSM_CONNECT':
      if (socket !== null) {
        break;
      }

      socket = new WebSocket(action.payload.url);

      socket.onopen = () => {
        store.dispatch({ type: 'WSM_CONNECTED' });
      };

      socket.onmessage = event => {
        console.log(event.data)
        const data = JSON.parse(event.data);
        store.dispatch({ type: 'WSM_MESSAGE_RECEIVED', Messages: store.getState().Messages, payload: data });
        store.dispatch({ type: 'ADD_MESSAGE', Messages: store.getState().Messages, payload: data });
      };

      socket.onclose = () => {
        store.dispatch({ type: 'WSM_DISCONNECTED' });
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        store.dispatch({ type: 'WSM_ERROR', payload: error });
      };

    case 'WSM_SEND':
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(action.payload));
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
    case 'WSM_CONNECT':
      if (socket !== null) {
        break;
      }

      socket = new WebSocket(action.payload.url);

      socket.onopen = () => {
        store.dispatch({ type: 'WSM_CONNECTED' });
      };

      socket.onmessage = event => {
        console.log(event.data)
        const data = JSON.parse(event.data);
        store.dispatch({ type: 'WSM_MESSAGE_RECEIVED', Messages: store.getState().Messages, payload: data });
        store.dispatch({ type: 'ADD_MESSAGE', Messages: store.getState().Messages, payload: data });
      };

      socket.onclose = () => {
        store.dispatch({ type: 'WSM_DISCONNECTED' });
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        store.dispatch({ type: 'WSM_ERROR', payload: error });
      };

    case 'WSM_SEND':
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(action.payload));
      }
      break;

    default:
      break;
  }

  return next(action);
};
