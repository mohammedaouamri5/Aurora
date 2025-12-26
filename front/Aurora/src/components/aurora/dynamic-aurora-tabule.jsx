import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTheme } from "../../hooks/use-theme";

export const AuroraTableContainer = (props) => {
  const { theme } = useTheme();
  return (
    <TableContainer
      component={Paper}
      sx={{
        bgcolor: theme.MAIN_BG,
        border: `1px solid ${theme.BORDER_COLOR}`,
        borderRadius: 2,
        overflow: "hidden",
        ...props.sx,
      }}
      {...props}
    />
  );
};

export const AuroraTable = (props) => <Table {...props} />;

export const AuroraTableHead = (props) => {
  const { theme } = useTheme();
  return (
    <TableHead
      sx={{
        "& .MuiTableCell-root": {
          bgcolor: theme.UPLOADER_BUTTON_BG,
          color: theme.UPLOADER_BUTTON_TEXT,
          fontWeight: 600,
          borderBottom: `1px solid ${theme.BORDER_COLOR}`,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};

export const AuroraTableBody = (props) => {
  const { theme } = useTheme();
  return (
    <TableBody
      sx={{
        "& .MuiTableRow-root:hover": {
          bgcolor: theme.UPLOADER_ROW_HOVER,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};

export const AuroraTableRow = (props) => <TableRow {...props} />;

export const AuroraTableCell = (props) => {
  const { theme } = useTheme();
  return (
    <TableCell
      sx={{
        color: theme.TEXT_PRIMARY,
        ...props.sx,
      }}
      {...props}
    />
  );
};

