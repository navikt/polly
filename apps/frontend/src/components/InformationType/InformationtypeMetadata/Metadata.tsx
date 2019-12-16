import * as React from 'react'
import { useEffect, useState } from 'react'
import { Block, BlockProps } from 'baseui/block'
import { InformationType } from '../../../constants'
import { Card } from 'baseui/card'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { IconDefinition } from "@fortawesome/fontawesome-common-types"
import { intl } from '../../../util'
import { Label2, Paragraph2 } from 'baseui/typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { Code } from '../../../service/Codelist'
import { sensitivityColor } from "../Sensitivity"
import { getTerm, mapTermToOption } from "../../../api"

const itemBlockProps: BlockProps = {
    display: ['flex', 'block', 'block', 'flex'],
};

const labelBlockProps: BlockProps = {
    display: ['flex', 'block', 'block', 'flex'],
    width: ['30%', '100%', '100%', '30%'],
    alignSelf: 'flex-start',
    marginTop: '1rem',
};

const reduceToList = (list: Array<Code> | undefined) => {
    if (!list) return []
    return list.reduce((acc: string[], curr: Code) => {
        acc = [...acc, curr.shortName]
        return acc
    }, [])
}

const arrayToString = (list: string[]) => {
    if (!list) return ''
    return list.join(', ')
}

const renderTextWithLabelMetadata = (label: string, text: string, icon?: IconDefinition, iconColor?: string) => {
    return (
        <Block {...itemBlockProps}>
            <Block {...labelBlockProps}>
                <Label2>{icon && <FontAwesomeIcon icon={icon} color={iconColor} />} {label}</Label2>
            </Block>
            <Block maxWidth="70%"><Paragraph2>{text}</Paragraph2></Block>
        </Block>
    )
}

const renderTextWithLabel = (label: string, text: string, icon?: IconDefinition, iconColor?: string) => (
    <Block>
        <Label2>{icon && <FontAwesomeIcon icon={icon} color={iconColor}/>}{label}</Label2>
        <Paragraph2 $style={{whiteSpace: 'pre-wrap'}}>{text}</Paragraph2>
    </Block>
)

const CardOverview = (props: { name: string, term: string, description: string }) => (
    <Card>
        <FlexGrid
            flexGridColumnCount={1}
            flexGridColumnGap="scale400"
            flexGridRowGap="scale400"
        >
            <FlexGridItem marginTop="1rem">{renderTextWithLabel(intl.name, props.name, faTag)}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabel(intl.term, props.term)}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabel(intl.description, props.description)}</FlexGridItem>
        </FlexGrid>
    </Card>
)

const CardMetadata = (props: { navMaster: Code, sources: Code[], categories: Code[], keywords: string[], sensitivity: Code }) => (
    <Card>
        <FlexGrid
            flexGridColumnCount={1}
            flexGridColumnGap="scale1000"
            flexGridRowGap="scale400"
        >
            <FlexGridItem>{renderTextWithLabelMetadata(intl.navMaster, props.navMaster ? props.navMaster.shortName : '', faTag)}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabelMetadata(intl.sources, reduceToList(props.sources).join(', '))}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabelMetadata(intl.categories, reduceToList(props.categories).join(', '))}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabelMetadata(intl.keywords, arrayToString(props.keywords))}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabelMetadata(intl.sensitivity, props.sensitivity ? props.sensitivity.shortName : '', faUserShield, sensitivityColor(props.sensitivity.code))}</FlexGridItem>
        </FlexGrid>
    </Card>
)

const Metadata = (props: { informationtype: InformationType }) => {
    const { informationtype } = props
    const [term, setTerm] = useState()

    useEffect(() => {
        (async () => {
            if (informationtype.term) {
                const term = await getTerm(informationtype.term)
                setTerm(mapTermToOption(term).label)
            }
        })()
    }, [informationtype.term])

    return (
        <Block display="flex" marginBottom="5rem">
            <Block width="40%" marginRight="5rem">
                <CardOverview
                    name={informationtype.name}
                    term={informationtype.term ? term : ''}
                    description={informationtype.description}
                />
            </Block>
            <Block width="60%" marginRight="5rem">
                <CardMetadata
                    navMaster={informationtype.navMaster}
                    sources={informationtype.sources ? informationtype.sources : []}
                    categories={informationtype.categories ? informationtype.categories : []}
                    keywords={informationtype.keywords ? informationtype.keywords : []}
                    sensitivity={informationtype.sensitivity}
                />
            </Block>
        </Block>
    )
}

export default Metadata