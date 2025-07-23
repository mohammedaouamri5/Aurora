import { Box, Typography } from "@mui/material"
import { COLORS } from "../../constants/sidebar.js"

export function RecordingStatus() {
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
        bgcolor: "rgba(255, 68, 68, 0.1)",
        borderRadius: 1,
        p: 1,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: COLORS.RECORDING_RED,
          mr: 1,
          animation: "blink 1s infinite",
          "@keyframes blink": {
            "0%, 50%": { opacity: 1 },
            "51%, 100%": { opacity: 0.3 },
          },
        }}
      />
      <Typography variant="caption" sx={{ color: COLORS.RECORDING_RED, fontWeight: 500 }}>
        Recording... Click to stop
      </Typography>
    </Box>
  )
}
