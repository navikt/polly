import React from "react";
import {Block} from "baseui/block";
import {Label2, Paragraph2} from "baseui/typography";
import {Document} from "../../constants";
import {intl} from "../../util";
import DocumentInfoTypeTable from "./DocumentInfoTypeTable";

const renderTextWithLabel = (label: string, text: string) => (
    <Block marginTop="scale1000">
        <Label2 font="font400">{label}</Label2>
        <Paragraph2>{text}</Paragraph2>
    </Block>
)

type DocumentMetadata = {
    document: Document;
}

const DocumentMetadata = (props: DocumentMetadata) => {
    const { document } = props

    return (
        <React.Fragment>
            {renderTextWithLabel(intl.name, document.name)}
            {renderTextWithLabel(intl.description, document.description)}

            <Block marginTop="scale1000">
                <Label2 font="font400" marginBottom="scale800">{intl.usedProcess}</Label2>
                <DocumentInfoTypeTable list={document.informationTypes}/>
            </Block>
        </React.Fragment>
    );
};

export default DocumentMetadata;
