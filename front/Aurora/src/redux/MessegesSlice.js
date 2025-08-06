
import { CommentBank, Filter9 } from "@mui/icons-material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
const url = import.meta.env.VITE_BACK_END_URL;

export const GetMessages = createAsyncThunk(
  "Messages/fetchMessageOfGivenChat",
  async ({ ConversationID }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // get your JWT
      if (!token) return rejectWithValue("Unauthorized: No token found");
      const res = await axios.get(`${url}/Messages`, {
        headers: {
          Authorization: `${token}`,
        },
        params: {
          ConversationID: ConversationID,
        }
      });

      if (res.status != 200) {
        console.log(err);
        return rejectWithValue("Something went wrong");
      }


      var result = res.data

      return { Messages: result, ConversationID: ConversationID };
    } catch (err) {
      console.log(err.data.error);
      return rejectWithValue("Something went wrong");
    }
  }
);


export const SendTextMessage = createAsyncThunk(
  "Messages/fetchSendMessagesOfGivenChat",
  async ({ ConversationID, Textmessage }, { rejectWithValue }) => {

    // const dispatch = useDispatch();
    // const isConnected = useSelector()
    // if (!isConnected) {
    //   console.log("Messanger.js:47.36IsConnected : " , isConnected)
    //   dispatch(connectToSocket());
    // }





    try {
      const token = localStorage.getItem("token"); // get your JWT
      if (!token) return rejectWithValue("Unauthorized: No token found");
      const res = await axios.post(`${url}/Messages`, {
        ConversationID: ConversationID,
        Textmessage, Textmessage,
      }, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        }
      });

      var result = res.data
      return { Message: result, ConversationID: ConversationID };
    } catch (err) {
      console.log(err);
      return rejectWithValue("Something went wrong");
    }
  }
);


function PushMessage({ Data, ConversationID, Message }) {
  Data[ConversationID] = [...(Data[ConversationID] || []), Message]
  console.log("PushMessage  : ", Data, ConversationID, Message, Data[ConversationID])
  return Data
}

function PushMessages({ Data, ConversationID, Messages }) {
  Data[ConversationID] = [...(Data[ConversationID] || []), ...(Messages[ConversationID] || [])]
  console.log("PuchMessages  : ", Data)
  return Data
}

function SetMessages({ Data, ConversationID, Messages }) {
  // console.log(Messages)
  // console.log(Data)

  Data[ConversationID] = (Messages[ConversationID] || [])
  // console.log("SetMessages  : ", Data)
  return Data
}



const MessagesSlice = createSlice({
  name: "Messages",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(GetMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(SendTextMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(SendTextMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })



      .addCase(GetMessages.fulfilled, (state, action) => {
        state.data = SetMessages({ Data: state.data, ...action.payload })
        return
      })
      .addCase(SendTextMessage.fulfilled, (state, action) => {

        console.log(".addCase(SendTextMessage.fulfilled,", action.payload)
        state.data = PushMessage({ Data: state.data, ...action.payload })
        return
      })
  },
});

export default MessagesSlice.reducer;

