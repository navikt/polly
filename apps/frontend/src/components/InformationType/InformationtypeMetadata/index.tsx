import * as React from "react";
import { Block, BlockProps } from 'baseui/block'
import { Label2 } from "baseui/typography";

import AccordionInformationtype from './AccordionInformationtype'
import { Disclosure, Document, InformationType, Policy } from "../../../constants"
import { intl } from "../../../util"
import Metadata from "./Metadata";
import InformationtypePolicyTable from "./InformationtypePolicyTable"
import { Button } from "baseui/button"
import TableDisclosure from "../../common/TableDisclosure";
import { DocumentReferences, DocumentTable } from "./DocumentTable"

const sectionBlockProps: BlockProps = {
  marginTop: '3rem'
}

interface InformationtypeMetadataProps {
  informationtype: InformationType;
  policies: Policy[];
  disclosures: Disclosure[],
  documents: Document[],
  expanded: string[]
  onSelectPurpose: (purpose: string) => void
}

const InformationtypeMetadata = (props: InformationtypeMetadataProps) => {
  const {informationtype, policies, disclosures, documents, expanded, onSelectPurpose} = props
  const [accordion, setAccordion] = React.useState(false);

  const documentRef: DocumentReferences = {}

  return (
    <React.Fragment>
      {informationtype && (
        <React.Fragment>
          <Metadata informationtype={informationtype}/>

          <Block {...sectionBlockProps}>
            <Block display="flex" justifyContent="space-between" marginBottom="2rem">
              <Label2 font="font450">{intl.purposeUse}</Label2>
              <Button onClick={() => setAccordion(!accordion)} type="button" size="compact" kind="secondary">{accordion ? intl.showAll : intl.groupByPurpose}</Button>
            </Block>
            {accordion &&
            <AccordionInformationtype policies={policies} expaneded={expanded}
                                      onChange={args => args.expanded.length && onSelectPurpose(args.expanded[0] as string)}/>
            }
            {!accordion &&
            <InformationtypePolicyTable policies={policies} showPurpose={true}/>
            }
          </Block>

          <Block {...sectionBlockProps}>
            <Label2 font="font450" marginBottom="2rem">{intl.disclosuresToThirdParty}</Label2>
            <TableDisclosure
              list={disclosures}
              showRecipient
              editable={false}
              onCloseModal={() => console.log('skal fjerrens også')}
              documentRef={documentRef}
            />
          </Block>

          <Block {...sectionBlockProps}>
            <Label2 font="font450" marginBottom="2rem">{intl.documents}</Label2>
            <DocumentTable
              documents={documents}
              documentRef={documentRef}
            />
          </Block>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default InformationtypeMetadata;
