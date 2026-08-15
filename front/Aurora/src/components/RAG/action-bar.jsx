
import { Box, Typography, Button } from "@mui/material"
import { useTheme } from "../../hooks/use-theme"

export const ActionBar = ({ choices, SetSelected, selected }) => {
  const { theme } = useTheme()

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, width: "100%" }}>
      {choices.map((choice) => {
        const isSelected = selected === choice.name
        return (
          <Button
            key={choice.name}
            variant="contained"
            onClick={() => SetSelected(choice)}
            sx={{
              bgcolor: isSelected ? theme.AURORA_PRIMARY : "transparent",
              color: isSelected ? "#ffffff" : theme.TEXT_SECONDARY,
              border: `1px solid ${theme.BORDER_COLOR}`,
              textTransform: "none",
              "&:hover": {
                bgcolor: isSelected ? theme.AURORA_PRIMARY : theme.SIDEBAR_HOVER,
                color: isSelected ? "#ffffff" : theme.TEXT_PRIMARY,
              },
            }}
          >
            {choice.name}
          </Button>
        )
      })}
    </Box>
  )
}
