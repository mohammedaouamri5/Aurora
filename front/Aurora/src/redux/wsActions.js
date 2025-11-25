
const url = import.meta.env.VITE_BACK_END_URL_WSS;

export const connectToMessagesWS = () => ({
  type: 'WS_CONNECT',
  payload: { url: `/ws/messages` }, // use your Go server's WSS endpoint
});

export const sendWSMessage = (payload) => ({
  type: 'WS_SEND',
  payload,
});

