import { Button as __Button } from "@mui/material";
import { useTheme } from "../../hooks/use-theme";

export function AuroraButton(props) {
  const { theme } = useTheme();

  return (
    <__Button
      {...props}
      sx={{
        bgcolor: theme.UPLOADER_BUTTON_BG,
        color: theme.UPLOADER_BUTTON_TEXT,
        "&:hover": {
          bgcolor: theme.UPLOADER_BUTTON_BG,
        },
        ...props.sx,
      }}
    />
  );
}
