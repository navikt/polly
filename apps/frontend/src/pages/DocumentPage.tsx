import React from "react";
import {intl} from "../util";
import Banner from "../components/Banner";
import CreateDocument from "../components/document/component/CreateDocument";

const DocumentPage = () => {
  return (
    <React.Fragment>
      <Banner title={intl.document}/>
      <CreateDocument/>
    </React.Fragment>
  );
};

export default DocumentPage;
