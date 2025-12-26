import axios from "axios";


const url = import.meta.env.VITE_BACK_END_URL;
export const UploadFile = async (__file, __meta_Data) => {

  try {
    const FormDataObj = new FormData();

    FormDataObj.append("file", __file);
    FormDataObj.append("meta-data", JSON.stringify(__meta_Data));
    const token = localStorage.getItem("token"); 

    const Response = await axios.post(
      `${url}/RAG/upload-file`,
      FormDataObj,
      {
        headers: {
          'Authorization': `${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (ProgressEvent) => {
          const Percent = Math.round(
            (ProgressEvent.loaded * 100) / (ProgressEvent.total || 1)
          );
          console.log("Upload:", Percent, "%");
        },
      }
    );
    console.log(Response);
    return Response.data;
  } catch (Error) {
    console.log(Error);
    return Error.response?.data || "Upload failed"
  }
}




