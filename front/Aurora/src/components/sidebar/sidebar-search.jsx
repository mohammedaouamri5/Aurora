import { Box, TextField, InputAdornment } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useTheme } from "../../hooks/use-theme"

export function SidebarSearch({ searchQuery, onSearchChange }) {
  const { theme } = useTheme()

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <TextField
        fullWidth
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.TEXT_SECONDARY, fontSize: 18 }} />
            </InputAdornment>
          ),
          sx: {
            bgcolor: theme.SIDEBAR_HOVER,
            color: theme.TEXT_PRIMARY,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.BORDER_COLOR,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.BORDER_COLOR,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.AURORA_PRIMARY,
            },
          },
        }}
        sx={{
          "& .MuiInputBase-input::placeholder": {
            color: theme.TEXT_SECONDARY,
            opacity: 1,
          },
        }}
      />
    </Box>
  )
}
