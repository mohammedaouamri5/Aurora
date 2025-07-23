"use client"

import { Box, TextField, InputAdornment } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { COLORS } from "../../constants/sidebar.js"

export function SidebarSearch({ searchQuery, onSearchChange }) {
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
              <SearchIcon sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 18 }} />
            </InputAdornment>
          ),
          sx: {
            bgcolor: COLORS.SIDEBAR_HOVER,
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: COLORS.BORDER_COLOR,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: COLORS.BORDER_COLOR,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: COLORS.PRIMARY_GREEN,
            },
          },
        }}
        sx={{
          "& .MuiInputBase-input::placeholder": {
            color: COLORS.TEXT_SECONDARY,
            opacity: 1,
          },
        }}
      />
    </Box>
  )
}
