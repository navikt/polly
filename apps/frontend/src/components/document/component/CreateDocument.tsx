import React, {KeyboardEvent} from "react";
import {Block, BlockProps} from "baseui/block";
import {Label2} from "baseui/typography";
import {intl} from "../../../util";
import {Input, SIZE} from "baseui/input";
import {Textarea} from "baseui/textarea";
import {CreateDocumentFormValues, DocumentTableRow} from "../../../constants";
import DocumentTable from "./DocumentTable";
import {Field, FieldArray, FieldProps, Form, Formik} from "formik";
import {Button} from "baseui/button";
import {Code} from "../../../service/Codelist";
import axios from "axios";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT

const rowBlockProps: BlockProps = {
  width: '100%',
  marginTop: '1rem',
};

let initialCreateDocumentFormValues: CreateDocumentFormValues = {
  name: "",
  description: "",
  informationTypes: []
};

const CreateDocument = () => {
  const [tableData, setTableData] = React.useState<DocumentTableRow[]>([]);
  const [description, setDescription] = React.useState("");
  const [isLoading, setLoading] = React.useState();

  const handleCreateDocument = async (values: CreateDocumentFormValues) => {
    let body = {...values};
    setLoading(true)
    try {
      console.log("Body: ",body);
      const response = await axios.post(`${server_polly}/document`, body);
      console.log(response);
    } catch (error) {
      console.log(error.message)
    }
    setLoading(false)
  };

  const setRowData = (data: DocumentTableRow, index: number) => {
    tableData[index] = data;
    setTableData(tableData);
  };

  const removeRowData = (index:number) => {
    tableData.splice(index,1);
    setTableData(tableData);
  };


  const disableEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <React.Fragment>
      <Formik
        initialValues={initialCreateDocumentFormValues}
        onSubmit={(values,{resetForm}) => {
          console.log(values)
          handleCreateDocument(values);
          resetForm();
          setTableData([]);
        }}
      >
        {
          (formikProps:any) => (
            <Form onKeyDown={disableEnter}>
              <Block {...rowBlockProps}>
                <Label2>{intl.name}</Label2>
                <Field name="name">
                  {
                    (props: FieldProps) => (
                      <Input type="text" size={SIZE.default} {...props.field}/>
                    )
                  }
                </Field>
              </Block>
              <Block {...rowBlockProps}>
                <Label2>{intl.description}</Label2>
                <Field name="description">
                  {
                    (props: FieldProps) => (
                      <Textarea
                        value={description}
                        onChange={event => setDescription((event.target as HTMLTextAreaElement).value)}
                        {...props.field}
                      />
                    )
                  }
                </Field>
              </Block>
              <Block {...rowBlockProps}>
                <FieldArray
                  name="informationTypes"
                  render={
                    arrayHelpers=>(
                      <DocumentTable
                        tableData={tableData}
                        setTableData={setTableData}
                        setRowData={setRowData}
                        removeRow={removeRowData}
                        arrayHelpers={arrayHelpers}
                      />
                    )
                  }
                />
              </Block>
              <Block display="flex" flexDirection="row-reverse">
                <Button
                  type="submit"
                  overrides={{
                    BaseButton: {
                      style: {
                        marginTop: "5px",
                        marginLeft: "5px",
                        paddingRight: "4rem",
                        paddingLeft: "4rem",
                      }
                    }
                  }}
                >
                  {intl.save}
                </Button>
                <Button
                  type="button"
                  overrides={{
                    BaseButton: {
                      style: {
                        marginTop : "5px",
                        paddingRight: "4rem",
                        paddingLeft: "4rem",
                      }
                    }
                  }}
                  onClick={()=>{
                    formikProps.resetForm();
                    setTableData([]);
                  }}
                >
                  {intl.abort}
                </Button>
              </Block>
            </Form>
          )
        }
      </Formik>
    </React.Fragment>
  )
};

export default CreateDocument;
