import React from "react";
import {intl} from "../util";
import Banner from "../components/Banner";
import DocumentForm from "../components/document/component/DocumentForm";
import {RouteComponentProps} from "react-router-dom";
import {codelist} from "../service/Codelist";
import {getDocument, updateInformationTypesDocument} from "../api";
import {Document, DocumentFormValues, DocumentInfoTypeUse,} from "../constants";
import shortid from "shortid";

const convertToDocumentFormValues = (document: Document) => {
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
  } as DocumentFormValues
}

const DocumentEditPage = (props: RouteComponentProps<{ id?: string}>) => {
  const [document, setDocument] = React.useState<Document>()
  const [isLoading,setLoading] = React.useState();

  const handleEditDocument = async (values: DocumentFormValues) => {
      try {
        const res = await updateInformationTypesDocument(values)
        props.history.push(`/document/${res.id}`)
      } catch (err) {
        console.log(err, "ERR")
      }
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
      {!isLoading && document && <DocumentForm initialValues={convertToDocumentFormValues(document)} handleSubmit={handleEditDocument}/>}
    </React.Fragment>
  );
};

export default DocumentEditPage;
