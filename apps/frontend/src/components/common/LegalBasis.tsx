import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faExclamation, faTrash } from '@fortawesome/free-solid-svg-icons'
import { ARTWORK_SIZES, ListItem, ListItemLabel } from 'baseui/list'
import { Block } from 'baseui/block'
import { Button } from 'baseui/button'

import { LegalBasis, LegalBasisFormValues, PolicyAlert } from '../../constants'
import { codelist, ListName } from '../../service/Codelist'
import { processString } from '../../util/string-processor'
import { intl, theme } from '../../util'
import { StyledLink } from 'baseui/link'
import { env } from '../../util/env'

export const LegalBasisView = (props: { legalBasis?: LegalBasis, legalBasisForm?: LegalBasisFormValues }) => {
  const input = props.legalBasis ? props.legalBasis : props.legalBasisForm
  if (!input) return null
  const {description} = input
  const gdpr = props.legalBasis ? props.legalBasis.gdpr.code : props.legalBasisForm!.gdpr
  const nationalLaw = props.legalBasis ? props.legalBasis?.nationalLaw?.code : props.legalBasisForm!.nationalLaw

  let gdprDisplay = gdpr && codelist.getShortname(ListName.GDPR_ARTICLE, gdpr)
  let nationalLawDisplay = nationalLaw && codelist.getShortname(ListName.NATIONAL_LAW, nationalLaw)

  let descriptionText = codelist.valid(ListName.NATIONAL_LAW, nationalLaw) ? legalBasisLinkProcessor(nationalLaw!, description) : description

  return (
    <span>
       {gdprDisplay}{(nationalLawDisplay || descriptionText) && ', '} {nationalLawDisplay} {descriptionText}
    </span>
  )
}

const lovdataBase = (nationalLaw: string) => (codelist.isForskrift(nationalLaw) ? env.lovdataForskriftBaseUrl : env.lovdataLovBaseUrl) + codelist.getDescription(ListName.NATIONAL_LAW, nationalLaw)

const legalBasisLinkProcessor = (law: string, text?: string) => processString([
  {
    // Replace '§§ 10 og 4' > '§§ 10 og §§§ 4', so that our rewriter picks up the 2nd part
    regex: /§§\s*(\d+(-\d+)?)\s*og\s*(\d+(-\d+)?)/gi,
    fn: (key: string, result: string[]) => `§§ ${result[1]} og §§§ ${result[3]}`
  }, {
    // tripe '§§§' is hidden, used as a trick in combination with rule 1 above
    regex: /§(§§)?(§)?\s*(\d+(-\d+)?)/g,
    fn: (key: string, result: string[]) =>
      <StyledLink key={key} href={`${lovdataBase(law)}/§${result[3]}`} target="_blank" rel="noopener noreferrer">
        {(!result[1] && !result[2]) && '§'} {result[2] && '§§'} {result[3]}
      </StyledLink>
  }, {
    regex: /kap(ittel)?\s*(\d+)/gi,
    fn: (key: string, result: string[]) =>
      <StyledLink key={key} href={`${lovdataBase(law)}/KAPITTEL_${result[2]}`} target="_blank"
                  rel="noopener noreferrer">
        Kapittel {result[2]}
      </StyledLink>
  }
])(text)

export const LegalBasesNotClarified = (props: { alert?: PolicyAlert }) => {
  const color = theme.colors.warning500
  const warningIcon = <span><FontAwesomeIcon icon={faExclamation} color={color}/>&nbsp;</span>
  return (
    <Block color={color}>
      <Block>
        {props.alert?.missingLegalBasis && <>{warningIcon} {intl.legalBasesUndecidedWarning}</>}
      </Block>
      <Block>
        {!props.alert?.missingLegalBasis && props.alert?.missingArt6 && <>{warningIcon} {intl.legalBasesArt6Warning}</>}
      </Block>
      <Block>
        {!props.alert?.missingLegalBasis && props.alert?.missingArt9 && <>{warningIcon} {intl.legalBasesArt9Warning}</>}
      </Block>
    </Block>
  )
}

export const ListLegalBases = (
  props: {
    legalBases?: LegalBasisFormValues[],
    onRemove: (index: number) => void,
    onEdit: (index: number) => void
  },) => {
  const {legalBases, onRemove, onEdit} = props
  if (!legalBases) return null
  return (
    <React.Fragment>
      {legalBases.map((legalBasis: LegalBasisFormValues, i: number) => (
        <ListItem
          artworkSize={ARTWORK_SIZES.SMALL}
          overrides={{
            Content: {
              style: {
                marginLeft: '4rem'

              }
            },
            EndEnhancerContainer: {},
            Root: {},
            ArtworkContainer: {}
          }}
          endEnhancer={
            () =>
              <Block minWidth="100px">
                <Button
                  type="button"
                  kind="minimal"
                  size="compact"
                  onClick={() => {
                    onEdit(i)
                  }}
                >
                  <FontAwesomeIcon icon={faEdit}/>
                </Button>
                <Button
                  type="button"
                  kind="minimal"
                  size="compact"
                  onClick={() => onRemove(i)}
                >
                  <FontAwesomeIcon icon={faTrash}/>
                </Button>
              </Block>
          }
          sublist
          key={i}
        >
          <ListItemLabel sublist>
            <LegalBasisView legalBasisForm={legalBasis}/>
          </ListItemLabel>
        </ListItem>
      ))}
    </React.Fragment>
  )
}

export const ListLegalBasesInTable = (props: { legalBases: LegalBasis[] }) => {
  const {legalBases} = props
  return (
    <Block>
      <ul style={{listStyle: 'none', paddingInlineStart: 0, marginTop: 0, marginBottom: 0}}>
        {legalBases.map((legalBasis, i) => (
          <Block marginBottom="8px" key={i}>
            <li><LegalBasisView legalBasis={legalBasis}/></li>
          </Block>
        ))}
      </ul>
    </Block>
  )
}
