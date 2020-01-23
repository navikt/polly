import React from "react";
import {Block, BlockProps} from "baseui/block";
import {Label2} from "baseui/typography";
import {intl} from "../../../util";
import {Input, SIZE} from "baseui/input";
import {Textarea} from "baseui/textarea";
import {DocumentTableRow} from "../../../constants";
import DocumentTable from "./DocumentTable";

const rowBlockProps: BlockProps = {
  width: '100%',
  marginTop: '1rem',
};

const CreateDocument = () => {
  const [tableData, setTableData] = React.useState<DocumentTableRow[]>([]);

  const setRowData = (data: DocumentTableRow, index: number) => {
    tableData[index] = data;
    setTableData(tableData);
    console.log("Index= ", index);
  };

  return(
    <React.Fragment>
      <Block {...rowBlockProps}>
        <Label2>{intl.name}</Label2>
        <Input name="documentName" type="input" size={SIZE.default}/>
      </Block>
      <Block {...rowBlockProps}>
        <Label2>{intl.description}</Label2>
        <Textarea name="documentDescription"/>
      </Block>
      <Block {...rowBlockProps}>
        <DocumentTable
          tableData={tableData}
          setTableData={setTableData}
          setRowData={setRowData}
        />
      </Block>
    </React.Fragment>
  )
};

export default CreateDocument;
