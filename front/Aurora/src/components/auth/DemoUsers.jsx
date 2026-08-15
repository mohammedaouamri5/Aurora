import { Avatar, Box, Button, Typography } from "@mui/material";
import { useTheme } from "../../hooks/use-theme";

export const DEMO_USERS = [
  { name: "Alice Dev", email: "alice@aurora.dev", password: "password123" },
  { name: "Bob Builder", email: "bob@aurora.dev", password: "password123" },
  { name: "Carol Coder", email: "carol@aurora.dev", password: "password123" },
];

export function DemoUsers({ onSelect }) {
  const { theme } = useTheme();

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="caption"
        sx={{
          color: theme.TEXT_SECONDARY,
          display: "block",
          textAlign: "center",
          mb: 1,
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Quick demo login
      </Typography>

      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        {DEMO_USERS.map((user) => (
          <Button
            key={user.email}
            onClick={() => onSelect(user)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              border: `1px solid ${theme.BORDER_COLOR}`,
              bgcolor: theme.SIDEBAR_HOVER,
              color: theme.TEXT_PRIMARY,
              textTransform: "none",
              "&:hover": {
                bgcolor: `${theme.AURORA_PRIMARY}22`,
                borderColor: theme.AURORA_PRIMARY,
                boxShadow: `0 0 15px ${theme.AURORA_PRIMARY}30`,
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.AURORA_PRIMARY,
                fontSize: "13px",
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Typography sx={{ fontSize: "12px", lineHeight: 1.2 }}>
              {user.name.split(" ")[0]}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}
