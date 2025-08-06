let socket = null;

const websocketMiddleware = store => next => action => {
  switch (action.type) {
    case 'WS_CONNECT':
      if (socket !== null) {
        socket.close();
      }

      socket = new WebSocket(action.payload.url);

      socket.onopen = () => {
        store.dispatch({ type: 'WS_CONNECTED' });
      };

      socket.onmessage = event => {
      
        console.log(event.data)
        const data = JSON.parse(event.data);
        store.dispatch({ type: 'WS_MESSAGE_RECEIVED', payload: data });
      };

      socket.onclose = () => {
        store.dispatch({ type: 'WS_DISCONNECTED' });
      };

      break;

    case 'WS_SEND':
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log(action.payload)
        socket.send(JSON.stringify(action.payload));
      }
      break;

    default:
      break;
  }

  return next(action);
};

export default websocketMiddleware;

