import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "../../hooks/use-theme";
import { UploadFile } from "../../redux/file-upload";
import { AuroraButton } from "../aurora/dynamic-aurora-button";

export default function FileUploader() {
  const { theme } = useTheme();

  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [metaDraft, setMetaDraft] = useState({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  /* ================= DROPZONE ================= */

  const onDrop = useCallback((acceptedFiles) => {
    const mapped = acceptedFiles.map((file) => ({
      File: file,
      MetaData: {},
    }));

    setData((prev) => [...prev, ...mapped]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  /* ================= METADATA DIALOG ================= */

  const openDialog = (index) => {
    setActiveIndex(index);
    setMetaDraft({ ...data[index].MetaData });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setNewKey("");
    setNewValue("");
  };

  const addMeta = () => {
    if (!newKey.trim()) return;

    const updated = { ...metaDraft, [newKey]: newValue };
    updateMeta(updated);
    setNewKey("");
    setNewValue("");
  };

  const updateMeta = (updatedMeta) => {
    setMetaDraft(updatedMeta);

    setData((prev) => {
      const copy = [...prev];
      copy[activeIndex].MetaData = updatedMeta;
      return copy;
    });
  };

  const removeMeta = (key) => {
    const updated = { ...metaDraft };
    delete updated[key];
    updateMeta(updated);
  };

  /* ================= FILE ACTIONS ================= */

  const removeFile = (index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  /*   
  const submitFile = () => {
    if (!data.length) return;
     UploadFile(
      data.map((file) => file.File),
      data.map((file) => file.MetaData),
    );
  };
  */

  const submitFile = () => {
    if (!data.length) return;
    for (let i = 0; i < data.length; i++) {
      UploadFile(
        data[i].File,
        data[i].MetaData,
      );
    }
    setData([]);
  };


  /* ================= RENDER ================= */


  const textFieldStyle = (theme) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.BORDER_COLOR,
      },
      "&:hover fieldset": {
        borderColor: theme.UPLOADER_BUTTON_BG,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.UPLOADER_BUTTON_BG,
      },
    },
  });


  const GetSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 700, mx: "auto", mt: 6 }}>

      {/* Dropzone */}
      <Paper
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.UPLOADER_BORDER}`,
          p: 6,
          textAlign: "center",
          bgcolor: isDragActive ? theme.UPLOADER_HOVER_BG : theme.MAIN_BG,
          cursor: "pointer",
          mb: 4,
          borderRadius: 2,
        }}
      >
        <input {...getInputProps()} />
        <Typography sx={{ color: theme.UPLOADER_TEXT, fontWeight: 500 }}>
          {isDragActive
            ? "Drop the files here..."
            : "Drag and drop files here, or click to select files"}
        </Typography>
      </Paper>

      {/* Files Table */}
      {data.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: theme.MAIN_BG,
            border: `1px solid ${theme.BORDER_COLOR}`,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: theme.UPLOADER_BUTTON_BG,
                }}
              >
                {["Name", "Size", "Type", "Actions"].map((label) => (
                  <TableCell
                    key={label}
                    sx={{
                      color: theme.UPLOADER_BUTTON_TEXT,
                      fontWeight: 600,
                      borderBottom: `1px solid ${theme.BORDER_COLOR}`,
                    }}
                  >
                    {label}
                    {label == "Actions" ?
                      <AuroraButton
                        variant="contained"
                        onClick={submitFile}
                        sx={{
                          ml: 2,
                          bgcolor: theme.UPLOADER_BUTTON_BG,
                          color: theme.UPLOADER_BUTTON_TEXT,
                          "&:hover": {
                            bgcolor: theme.UPLOADER_BUTTON_BG,
                          },
                        }}

                      >Upload</AuroraButton> : null
                    }
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: theme.MAIN_BG,
                    "&:hover": {
                      bgcolor: theme.UPLOADER_ROW_HOVER,
                    },
                  }}
                >
                  <TableCell sx={{ color: theme.TEXT_PRIMARY }}>
                    {item.File.name}
                  </TableCell>

                  <TableCell sx={{ color: theme.TEXT_SECONDARY }}>
                    {GetSize(item.File.size)}
                  </TableCell>

                  <TableCell sx={{ color: theme.TEXT_SECONDARY }}>
                    {item.File.type || "Unknown"}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: theme.UPLOADER_BUTTON_BG,
                          color: theme.UPLOADER_BUTTON_BG,
                          "&:hover": {
                            bgcolor: theme.UPLOADER_BUTTON_BG,
                            color: theme.UPLOADER_BUTTON_TEXT,
                          },
                        }}
                        onClick={() => openDialog(index)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        sx={{
                          borderColor: theme.RECORDING_RED,
                          color: theme.RECORDING_RED,
                          "&:hover": {
                            bgcolor: theme.RECORDING_RED,
                            color: "#fff",
                          },
                        }}
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Metadata Dialog */}


      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: theme.UPLOADER_DIALOG_BG,
            color: theme.TEXT_PRIMARY,
            borderRadius: 2,
            border: `1px solid ${theme.BORDER_COLOR}`,
          },
        }}
      >
        {/* ================= TITLE ================= */}
        <DialogTitle
          sx={{
            color: theme.TEXT_PRIMARY,
            borderBottom: `1px solid ${theme.BORDER_COLOR}`,
            fontWeight: 600,
          }}
        >
          Edit Metadata
        </DialogTitle>

        {/* ================= CONTENT ================= */}
        <DialogContent sx={{ mt: 2 }}>
          {Object.entries(metaDraft).map(([key, value]) => (
            <Box
              key={key}
              sx={{
                display: "flex",
                gap: 1,
                mb: 1.5,
                alignItems: "center",
              }}
            >
              <TextField
                label="Key"
                value={key}
                disabled
                fullWidth
                InputProps={{
                  style: { color: theme.TEXT_PRIMARY },
                }}
                InputLabelProps={{
                  style: { color: theme.TEXT_SECONDARY },
                }}
                sx={textFieldStyle(theme)}
              />

              <TextField
                label="Value"
                value={value}
                onChange={(e) =>
                  updateMeta({ ...metaDraft, [key]: e.target.value })
                }
                fullWidth
                InputProps={{
                  style: { color: theme.TEXT_PRIMARY },
                }}
                InputLabelProps={{
                  style: { color: theme.TEXT_SECONDARY },
                }}
                sx={textFieldStyle(theme)}
              />

              <IconButton
                onClick={() => removeMeta(key)}
                sx={{
                  color: theme.RECORDING_RED,
                  "&:hover": {
                    bgcolor: `${theme.RECORDING_RED}22`,
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          {/* ================= ADD NEW META ================= */}
          <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
            <TextField
              label="Key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              fullWidth
              InputProps={{
                style: { color: theme.TEXT_PRIMARY },
              }}
              InputLabelProps={{
                style: { color: theme.TEXT_SECONDARY },
              }}
              sx={textFieldStyle(theme)}
            />

            <TextField
              label="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              fullWidth
              InputProps={{
                style: { color: theme.TEXT_PRIMARY },
              }}
              InputLabelProps={{
                style: { color: theme.TEXT_SECONDARY },
              }}
              sx={textFieldStyle(theme)}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addMeta}
              sx={{
                bgcolor: theme.UPLOADER_BUTTON_BG,
                color: theme.UPLOADER_BUTTON_TEXT,
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: theme.UPLOADER_BUTTON_BG,
                  opacity: 0.9,
                },
              }}
            >
              Add
            </Button>
          </Box>
        </DialogContent>

        {/* ================= ACTIONS ================= */}
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.BORDER_COLOR}`,
            px: 3,
            py: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={closeDialog}
            sx={{
              borderColor: theme.UPLOADER_BUTTON_BG,
              color: theme.UPLOADER_BUTTON_BG,
              "&:hover": {
                bgcolor: `${theme.UPLOADER_BUTTON_BG}22`,
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>


    </Box >
  );
}

