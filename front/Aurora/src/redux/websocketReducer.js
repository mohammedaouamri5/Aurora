const initialState = {
  connected: false,
  messages: [],
  error: null,
  reconnecting: false,
};

export default function websocketReducer(state = initialState, action) {

  switch (action.type) {
    case 'WS_CONNECTED':
      return {
        ...state,
        connected: true,
        error: null,
        reconnecting: false
      };

    case 'WS_DISCONNECTED':
      return {
        ...state,
        connected: false,
        reconnecting: true
      };

    case 'WS_MESSAGE_RECEIVED':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };

    case 'WS_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'WS_MAX_RECONNECT_FAILED':
      return {
        ...state,
        connected: false,
        reconnecting: false,
        error: 'Max reconnection attempts reached'
      };

    case 'WS_SEND_FAILED':
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
}
