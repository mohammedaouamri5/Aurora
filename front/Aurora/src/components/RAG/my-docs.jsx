import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetConversations } from "../../redux/my-docs";
import { AuroraTable, AuroraTableBody, AuroraTableCell, AuroraTableContainer, AuroraTableHead, AuroraTableRow } from "./../aurora/dynamic-aurora-tabule";

export function MyDocsPage() {
  const dispatch = useDispatch();

  const { data, status, error } = useSelector(
    (state) => state.MyDocs
  );

  useEffect(() => {
    dispatch(GetConversations());
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>{error}</p>;
  console.log(data)
  return (
    <AuroraTableContainer>
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
    </AuroraTableContainer>
  );
}

