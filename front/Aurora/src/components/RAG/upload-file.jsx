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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "../../hooks/use-theme";

export default function FileUploader() {
  const [files, setFiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const { theme } = useTheme();

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      metadata: {},
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleOpenDialog = (index) => {
    setCurrentFileIndex(index);
    setMetadata({ ...files[index].metadata });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewKey("");
    setNewValue("");
  };

  const handleAddMetadata = () => {
    if (!newKey.trim()) return;

    const updatedMetadata = { ...metadata, [newKey]: newValue };
    setMetadata(updatedMetadata);

    const updatedFiles = [...files];
    updatedFiles[currentFileIndex].metadata = updatedMetadata;
    setFiles(updatedFiles);

    setNewKey("");
    setNewValue("");
  };

  const handleRemoveMetadata = (key) => {
    const updatedMetadata = { ...metadata };
    delete updatedMetadata[key];
    setMetadata(updatedMetadata);

    const updatedFiles = [...files];
    updatedFiles[currentFileIndex].metadata = updatedMetadata;
    setFiles(updatedFiles);
  };

  const handleMetadataChange = (key, value) => {
    const updatedMetadata = { ...metadata, [key]: value };
    setMetadata(updatedMetadata);

    const updatedFiles = [...files];
    updatedFiles[currentFileIndex].metadata = updatedMetadata;
    setFiles(updatedFiles);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleSubmit = () => {
    console.log("Submitted files:", files);
    // Here you can implement the actual submit logic
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 700, margin: "0 auto", mt: 6 }}>
      {/* Drag & Drop Area */}
      <Paper
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.UPLOADER_BORDER}`,
          padding: 6,
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
            ? "Drop your files here..."
            : "Drag & drop files here, or click to select files"}
        </Typography>
      </Paper>

      {/* Files Table */}
      {files.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            border: `1px solid ${theme.BORDER_COLOR}`,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.UPLOADER_BUTTON_BG }}>
                <TableCell sx={{ color: theme.UPLOADER_BUTTON_TEXT, fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: theme.UPLOADER_BUTTON_TEXT, fontWeight: 600 }}>Size (KB)</TableCell>
                <TableCell sx={{ color: theme.UPLOADER_BUTTON_TEXT, fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ color: theme.UPLOADER_BUTTON_TEXT, fontWeight: 600 }}>
                  Metadata
                  <Button
                    variant="contained"
                    sx={{
                      ml: 2,
                      backgroundColor: theme.UPLOADER_BUTTON_BG,
                      color: theme.UPLOADER_BUTTON_TEXT,
                      fontSize: "0.8rem",
                      padding: "2px 8px",
                    }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file, index) => (
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: theme.UPLOADER_ROW_ALT,
                    "&:hover": { bgcolor: theme.UPLOADER_ROW_HOVER },
                  }}
                >
                  <TableCell sx={{ color: theme.UPLOADER_TEXT }}>{file.name}</TableCell>
                  <TableCell sx={{ color: theme.UPLOADER_TEXT }}>
                    {(file.size / 1024).toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ color: theme.UPLOADER_TEXT }}>{file.type || "Unknown"}</TableCell>
                  <TableCell sx={{ color: theme.UPLOADER_TEXT }}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: theme.UPLOADER_BUTTON_BG,
                          color: theme.UPLOADER_BUTTON_BG,
                        }}
                        onClick={() => handleOpenDialog(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: theme.RECORDING_RED,
                          color: theme.RECORDING_RED,
                        }}
                        onClick={() => handleRemoveFile(index)}
                        startIcon={<DeleteIcon />}
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
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { bgcolor: theme.UPLOADER_DIALOG_BG, color: theme.TEXT_PRIMARY },
        }}
      >
        <DialogTitle sx={{ color: theme.TEXT_PRIMARY }}>Edit Metadata</DialogTitle>
        <DialogContent>
          {Object.entries(metadata).map(([key, value]) => (
            <Box key={key} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
              <TextField
                label="Key"
                value={key}
                disabled
                fullWidth
                InputProps={{ style: { color: theme.TEXT_PRIMARY } }}
                sx={{ "& .MuiInputLabel-root": { color: theme.TEXT_PRIMARY } }}
              />
              <TextField
                label="Value"
                value={value}
                onChange={(e) => handleMetadataChange(key, e.target.value)}
                fullWidth
                InputProps={{ style: { color: theme.TEXT_PRIMARY } }}
                sx={{ "& .MuiInputLabel-root": { color: theme.TEXT_PRIMARY } }}
              />
              <IconButton
                onClick={() => handleRemoveMetadata(key)}
                sx={{ color: theme.RECORDING_RED }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              fullWidth
              InputProps={{ style: { color: theme.TEXT_PRIMARY } }}
              sx={{ "& .MuiInputLabel-root": { color: theme.TEXT_PRIMARY } }}
            />
            <TextField
              label="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              fullWidth
              InputProps={{ style: { color: theme.TEXT_PRIMARY } }}
              sx={{ "& .MuiInputLabel-root": { color: theme.TEXT_PRIMARY } }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.UPLOADER_BUTTON_BG,
                color: theme.UPLOADER_BUTTON_TEXT,
              }}
              onClick={handleAddMetadata}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              color: theme.UPLOADER_BUTTON_BG,
              borderColor: theme.UPLOADER_BUTTON_BG,
            }}
            onClick={handleCloseDialog}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

