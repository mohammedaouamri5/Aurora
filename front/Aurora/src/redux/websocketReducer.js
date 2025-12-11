const initialState = {
  connected: false,
  messages: [],
  error: null,
  reconnecting: false,
};

export  const websocketMessageReducer = (state = initialState, action) => {

  switch (action.type) {

    case 'WSM_CONNECTED':
      return {
        ...state,
        connected: true,
        error: null,
        reconnecting: false
      };

    case 'WSM_DISCONNECTED':
      return {
        ...state,
        connected: false,
        reconnecting: true
      };

    case 'WSM_MESSAGE_RECEIVED':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };

    case 'WSM_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'WSM_MAX_RECONNECT_FAILED':
      return {
        ...state,
        connected: false,
        reconnecting: false,
        error: 'Max reconnection attempts reached'
      };

    case 'WSM_SEND_FAILED':
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
}
