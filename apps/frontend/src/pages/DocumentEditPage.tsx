import React from "react";
import {intl} from "../util";
import Banner from "../components/Banner";
import DocumentForm from "../components/document/component/DocumentForm";
import {RouteComponentProps} from "react-router-dom";
import {codelist} from "../service/Codelist";
import {getDocument, updateInformationTypesDocument} from "../api";
import {Document, DocumentFormValues_Temp, DocumentInfoTypeUse,} from "../constants";
import shortid from "shortid";

const convertToDocumentFormValues = (document: Document) => {
  console.log(document, "DOCUMENT")
  return {
      id: document.id,
      name: document.name,
      description: document.description,
      informationTypes: document.informationTypes.map(it => {
        return {
          id: shortid.generate(),
          informationTypeId: it.informationTypeId,
          informationType: it.informationType,
          subjectCategories: it.subjectCategories
        } as DocumentInfoTypeUse
      })
  } as DocumentFormValues_Temp
}

const DocumentEditPage = (props: RouteComponentProps<{ id?: string}>) => {
  const [document, setDocument] = React.useState<Document>()
  const [isLoading,setLoading] = React.useState();

  const handleEditDocument = async (values: DocumentFormValues_Temp) => {
      console.log(values, "VALUES SUBMITTED")
      const res = updateInformationTypesDocument(values)
      console.log(res, "RESPONSE")
  }

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      await codelist.wait();
      if (props.match.params.id) {
          setDocument(await getDocument(props.match.params.id))
      }
      setLoading(false);
    })();
  }, []);

  return (
    <React.Fragment>
      <Banner title={intl.document}/>
      {!isLoading && document && <DocumentForm initialValues={convertToDocumentFormValues(document)} handleSubmit={handleEditDocument}/>}
    </React.Fragment>
  );
};

export default DocumentEditPage;
