const initialState = {
  connected: false,
  messages: [],
};


export default function websocketReducer(state = initialState, action) {
  console.log("THE ACTION ==> ", action)
  console.log("THE STATE  ==> ", state)
  switch (action.type) {
    case 'WS_CONNECTED':
      return { ...state, connected: true };
    case 'WS_DISCONNECTED':
      return { ...state, connected: false };
    case 'WS_MESSAGE_RECEIVED':
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
}

