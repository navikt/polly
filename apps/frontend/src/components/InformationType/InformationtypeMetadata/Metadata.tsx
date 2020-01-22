import * as React from 'react'
import { useEffect, useState } from 'react'
import { Block, BlockProps } from 'baseui/block'
import { InformationType } from '../../../constants'
import { Card } from 'baseui/card'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { IconDefinition } from "@fortawesome/fontawesome-common-types"
import { intl, theme } from '../../../util'
import { Label2, Paragraph2 } from 'baseui/typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTimesCircle, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { Code } from '../../../service/Codelist'
import { sensitivityColor } from "../Sensitivity"
import { getTerm, mapTermToOption } from "../../../api"
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip"
import { StyledLink } from "baseui/link";
import { features } from "../../../util/feature-toggle"

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

const renderCodesToLinks = (sources: Code[]) =>
  sources.map((source, index) => (
    <React.Fragment key={index}>
      {features.enableThirdParty ?
        <StyledLink href={`/thirdparty/${source.code}`}>{source.shortName}</StyledLink>
        : source.shortName}
      <span>{index < sources.length - 1 ? ", " : ""}</span>
    </React.Fragment>
  ));

const renderTextWithLabelMetadata = (label: string, text: string | any, icon?: IconDefinition, iconColor?: string) => {
    return (
        <Block {...itemBlockProps}>
            <Block {...labelBlockProps}>
                <Label2>{icon && <FontAwesomeIcon icon={icon} color={iconColor}/>} {label}</Label2>
            </Block>
            <Block maxWidth="70%"><Paragraph2>{text}</Paragraph2></Block>
        </Block>
    )
}

const TextWithLabel = (props: { label: string, text?: string, icon?: IconDefinition, iconColor?: string, error?: string }) => {
    const errorIcon = <FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500}/>
    const value = <Paragraph2 $style={{whiteSpace: 'pre-wrap'}}>{props.error && errorIcon} {props.text}</Paragraph2>
    return (
        <Block>
            <Label2>{props.icon && <FontAwesomeIcon icon={props.icon} color={props.iconColor}/>} {props.label}</Label2>
            {!props.error && value}
            {props.error && <StatefulTooltip content={props.error} placement={PLACEMENT.top}>{value}</StatefulTooltip>}
        </Block>
    )
}

const CardOverview = (props: { name: string, termId?: string, description: string }) => {
    const [term, setTerm] = useState(props.termId)
    const [termError, setTermError] = useState(false)

    useEffect(() => {
        (async () => {
            if (props.termId) {
                try {
                    const termResponse = await getTerm(props.termId)
                    setTerm(mapTermToOption(termResponse).label)
                } catch (e) {
                    console.error("couldnt find term", e)
                    setTermError(true)
                }
            }
        })()
    }, [props.termId])

    return (
        <Card>
            <FlexGrid
                flexGridColumnCount={1}
                flexGridColumnGap="scale400"
                flexGridRowGap="scale400"
            >
                <FlexGridItem marginTop="1rem">
                    <TextWithLabel label={intl.name} text={props.name} icon={faTag}/>
                </FlexGridItem>
                <FlexGridItem>
                    <TextWithLabel label={intl.term} text={term} error={termError ? intl.couldntLoadTerm : undefined}/>
                </FlexGridItem>
                <FlexGridItem>
                    <TextWithLabel label={intl.description} text={props.description}/>
                </FlexGridItem>
            </FlexGrid>
        </Card>
    )
}

const CardMetadata = (props: { navMaster: Code, sources: Code[], categories: Code[], keywords: string[], sensitivity: Code }) => (
    <Card>
        <FlexGrid
            flexGridColumnCount={1}
            flexGridColumnGap="scale1000"
            flexGridRowGap="scale400"
        >
            <FlexGridItem>{renderTextWithLabelMetadata(intl.navMaster, props.navMaster ? props.navMaster.shortName : '')}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabelMetadata(intl.sources, renderCodesToLinks(props.sources))}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabelMetadata(intl.categories, reduceToList(props.categories).join(', '))}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabelMetadata(intl.keywords, arrayToString(props.keywords))}</FlexGridItem>
            <FlexGridItem>{renderTextWithLabelMetadata(intl.sensitivity, props.sensitivity ? props.sensitivity.shortName : '', faUserShield, sensitivityColor(props.sensitivity.code))}</FlexGridItem>
        </FlexGrid>
    </Card>
)

const Metadata = (props: { informationtype: InformationType }) => {
    const {informationtype} = props

    return (
        <Block display="flex" marginBottom="5rem">
            <Block width="40%" marginRight="5rem">
                <CardOverview
                    name={informationtype.name}
                    termId={informationtype.term}
                    description={informationtype.description}
                />
            </Block>
            <Block width="60%" marginRight="0">
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
