
import { useState } from "react"
import { Box, Button, Tooltip } from "@mui/material"
import { TopBar } from "./../components/top-bar/top-bar.jsx"
import { DynamicAuroraBackground } from "./../components/aurora/dynamic-aurora-background"
import { ActionBar } from "./../components/RAG/action-bar"
import { useTheme } from "../hooks/use-theme"
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';

export default function RAG() {

  const choices = [
    {
      name: "Search (By Name)",
      Icon: FindInPageOutlinedIcon,
    },
    {
      name: "Upload file",
      Icon: UploadFileOutlinedIcon,
    },
  ]

  const [currentChoice, setCurrentChoice] = useState(choices[0].name)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme } = useTheme()
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  return (
    <>
      <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

      {/* B1 */}
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          position: "relative",
          bgcolor: "red",
          margin: "0 auto", // <-- centers horizontally
          marginTop: "10vh",
        }}
      >        {/* B11: fixed-height actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            height: 60, // fixed height
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
            minHeight: 100, // minimal height
            bgcolor: theme.CHAT_BG,
            borderRadius: 2,
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {currentChoice ? <Box>{currentChoice}</Box> : <Box>Select an action</Box>}
        </Box>
      </Box>

    </>

  )
}









