import { Box, Button } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { COLORS } from "../../constants/sidebar.js"
import { useDispatch } from "react-redux";
import { AddConversation } from "../../redux/ConversationaNameSlice.js";

export function SidebarHeader() {
  const dispatch = useDispatch();
  const OnClickHandeler = () => {
    const newConversation = {
    };
    dispatch(AddConversation(newConversation));
  }
  return (
    <Box sx={{ p: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        onClick={OnClickHandeler}
        startIcon={<AddIcon />}
        sx={{
          color: "white",
          borderColor: COLORS.BORDER_COLOR,
          textTransform: "none",
          justifyContent: "flex-start",
          "&:hover": {
            bgcolor: COLORS.SIDEBAR_HOVER,
            borderColor: COLORS.BORDER_COLOR,
          },
        }}
      >
        New chat
      </Button>
    </Box>

  )
}
