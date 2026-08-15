import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import { GetConversations } from "../../redux/my-docs";
import { AuroraTable, AuroraTableBody, AuroraTableCell, AuroraTableContainer, AuroraTableHead, AuroraTableRow } from "./../aurora/dynamic-aurora-tabule";
import { useTheme } from "../../hooks/use-theme";

export function MyDocsPage() {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const { data, status, error } = useSelector(
    (state) => state.MyDocs
  );

  useEffect(() => {
    dispatch(GetConversations());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6 }}>
        <CircularProgress sx={{ color: theme.AURORA_PRIMARY }} />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Typography sx={{ color: theme.RECORDING_RED, textAlign: "center", py: 6 }}>
        {error}
      </Typography>
    );
  }

  return (
    <AuroraTableContainer>
      {data && data.length > 0 ? (
        <AuroraTable>
          <AuroraTableHead>
            <AuroraTableRow>
              <AuroraTableCell>Name</AuroraTableCell>
              <AuroraTableCell>Type</AuroraTableCell>
            </AuroraTableRow>
          </AuroraTableHead>

          <AuroraTableBody>
            {data.map((file) => (
              <AuroraTableRow key={file.FileID}>
                <AuroraTableCell>{file.FileName}</AuroraTableCell>
                <AuroraTableCell>{file.MetaData}</AuroraTableCell>
              </AuroraTableRow>
            ))}
          </AuroraTableBody>
        </AuroraTable>
      ) : (
        <Typography sx={{ color: theme.TEXT_SECONDARY, textAlign: "center", py: 6 }}>
          No files uploaded yet.
        </Typography>
      )}
    </AuroraTableContainer>
  );
}
