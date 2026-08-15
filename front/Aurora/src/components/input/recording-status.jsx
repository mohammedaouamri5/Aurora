import { Box, Typography } from "@mui/material"
import { useTheme } from "../../hooks/use-theme"

export function RecordingStatus() {
  const { theme } = useTheme()

  return (
    <Box
      sx={{
        position: "absolute",
        top: -40,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: `${theme.RECORDING_RED}1a`,
        borderRadius: 1,
        p: 1,
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: theme.RECORDING_RED,
          mr: 1,
          animation: "blink 1s infinite",
          "@keyframes blink": {
            "0%, 50%": { opacity: 1 },
            "51%, 100%": { opacity: 0.3 },
          },
        }}
      />
      <Typography variant="caption" sx={{ color: theme.RECORDING_RED, fontWeight: 500 }}>
        Recording... Click to stop
      </Typography>
    </Box>
  )
}
