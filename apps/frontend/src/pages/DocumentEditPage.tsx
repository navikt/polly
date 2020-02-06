import React from "react";
import {intl} from "../util";
import Banner from "../components/Banner";
import DocumentForm from "../components/document/component/DocumentForm";
import {RouteComponentProps} from "react-router-dom";
import {codelist} from "../service/Codelist";
import {getDocument} from "../api";
import {Document, DocumentFormValues_Temp, DocumentInfoTypeUse,} from "../constants";

const convertToDocumentFormValues = (document: Document) => {
  console.log(document, "DOCUMENT")
  return {
      name: document.name,
      description: document.description,
      informationTypes: document.informationTypes.map(it => {
        return {
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
      {!isLoading && document && <DocumentForm initialValues={convertToDocumentFormValues(document)} handleSubmit={() => console.log('tekst')}/>}
    </React.Fragment>
  );
};

export default DocumentEditPage;
