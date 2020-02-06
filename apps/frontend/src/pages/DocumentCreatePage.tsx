import React from "react";
import {intl} from "../util";
import Banner from "../components/Banner";
import DocumentForm from "../components/document/component/DocumentForm";
import {DocumentFormValues_Temp} from "../constants";
import {createInformationTypesDocument} from "../api";
import {RouteComponentProps} from "react-router-dom";

let initialCreateDocumentFormValues: DocumentFormValues_Temp = {
  name: "",
  description: "",
  informationTypes: []
};

const DocumentCreatePage = (props: RouteComponentProps) => {

  const handleCreateDocument = async (values: DocumentFormValues_Temp) => {
    let body = {...values};
    console.log(body)
    try {
      const res = await createInformationTypesDocument(body);
      props.history.push(`/document/${res.id}`);
    } catch (error) {
    }
  };

  return (
    <React.Fragment>
      <Banner title={intl.document}/>
      <DocumentForm initialValues={initialCreateDocumentFormValues} handleSubmit={handleCreateDocument}/>
    </React.Fragment>
  );
};

export default DocumentCreatePage;
