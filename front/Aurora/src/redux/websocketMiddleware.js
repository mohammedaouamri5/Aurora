import { useSelector } from "react-redux";

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
        console.log("store : ", store)
        console.log("store.getState() : ", store.getState())
        store.dispatch({ type: 'WS_MESSAGE_RECEIVED', Messages: store.getState().Messages, payload: data });
        store.dispatch({ type: 'ADD_MESSAGE', Messages: store.getState().Messages, payload: data });
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

