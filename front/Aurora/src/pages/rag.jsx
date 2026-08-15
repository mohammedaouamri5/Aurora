import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "../hooks/use-theme";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import FileUploader from "../components/RAG/upload-file.jsx";
import { MyDocsPage } from "../components/RAG/my-docs";
import { ActionBar } from "./../components/RAG/action-bar";

export default function RAG() {

  const choices = [
    {
      name: "My Docs",
      Icon: FindInPageOutlinedIcon,
      Component: MyDocsPage
    },
    {
      name: "Upload file",
      Icon: UploadFileOutlinedIcon,
      Component: FileUploader
    },
  ];

  const [currentChoice, setCurrentChoice] = useState(choices[0]);
  const { theme } = useTheme();

  const DynamicComponent = currentChoice.Component;

  return (
    <Box
      sx={{
        width: "80%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: "relative",
        bgcolor: "transparent",
        margin: "0 auto",
        marginTop: "6vh",
      }}
    >
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
        <ActionBar choices={choices} SetSelected={setCurrentChoice} selected={currentChoice.name} />
      </Box>

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
  );
}
