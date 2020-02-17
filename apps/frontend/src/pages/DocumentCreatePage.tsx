import React from "react";
import {intl} from "../util";
import Banner from "../components/Banner";
import DocumentForm from "../components/document/component/DocumentForm";
import {DocumentFormValues} from "../constants";
import {createInformationTypesDocument} from "../api";
import {RouteComponentProps} from "react-router-dom";

let initialCreateDocumentFormValues: DocumentFormValues = {
  name: "",
  description: "",
  informationTypes: []
};

const DocumentCreatePage = (props: RouteComponentProps) => {

  const handleCreateDocument = async (values: DocumentFormValues) => {
    let body = {...values};
    try {
      const res = await createInformationTypesDocument(body);
      props.history.push(`/document/${res.id}`);
    } catch (error) {
      console.log(error, "Error")
    }
  };

  return (
    <React.Fragment>
      <DocumentForm initialValues={initialCreateDocumentFormValues} handleSubmit={handleCreateDocument}/>
    </React.Fragment>
  );
};

export default DocumentCreatePage;
