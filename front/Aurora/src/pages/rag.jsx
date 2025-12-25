import { useState } from "react";
import { Box } from "@mui/material";
import { TopBar } from "./../components/top-bar/top-bar.jsx";
import { useTheme } from "../hooks/use-theme";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import FileUploader from "../components/RAG/upload-file.jsx";
import { ActionBar } from "./../components/RAG/action-bar";

export default function RAG() {

  const choices = [
    {
      name: "Search (By Name)",
      Icon: FindInPageOutlinedIcon,
      Component: FileUploader
    },
    {
      name: "Upload file",
      Icon: UploadFileOutlinedIcon,
      Component: FileUploader
    },
  ];

  // Default to the first choice
  const [currentChoice, setCurrentChoice] = useState(choices[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useTheme();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const DynamicComponent = currentChoice.Component;

  return (
    <>
      <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          position: "relative",
          bgcolor: "transparent",
          margin: "0 auto",
          marginTop: "10vh",
        }}
      >
        {/* B11: fixed-height actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            height: 60,
            bgcolor: theme.SIDEBAR_BG,
            borderRadius: 2,
            alignItems: "center",
            justifyContent: "flex-start",
            padding: 1,
          }}
        >
          <ActionBar choices={choices} SetSelected={setCurrentChoice} />
        </Box>

        {/* B12: dynamic content */}
        <Box
          sx={{
            minHeight: 100,
            bgcolor: theme.CHAT_BG,
            borderRadius: 2,
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {DynamicComponent ? <DynamicComponent /> : <Box>Select an action</Box>}
        </Box>
      </Box>
    </>
  );
}

