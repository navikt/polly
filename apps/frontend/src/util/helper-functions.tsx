import { intl } from './intl/intl'
import { StyledLink } from 'baseui/link'
import * as React from 'react'
import { KeyboardEvent } from 'react'
import { StatefulTooltip } from 'baseui/tooltip'
import { lowerFirst } from 'lodash'
import { Process } from '../constants'

export const isLink = (text: string) => {
  const regex = /http[s]?:\/\/.*/gm
  if (!regex.test(text)) {
    return false
  }
  return true
}

export const shortenLinksInText = (text: string) => {
  return text.split(/\s+/).map((word, index) => {
    if (isLink(word)) {
      return (
        <span key={index}>
          <StatefulTooltip content={word}>
            <StyledLink href={word} target="_blank" rel="noopener noreferrer">
              {index === 0 ? intl.seeExternalLink : lowerFirst(intl.seeExternalLink)}
            </StyledLink>
          </StatefulTooltip>
          &nbsp;
        </span>
      )
    } else {
      return <span key={index}>{word} </span>
    }
  })
}

export const mapBool = (b?: boolean) => (b === true ? true : b === false ? false : undefined)

export const disableEnter = (e: KeyboardEvent) => {
  if (e.key === 'Enter') e.preventDefault()
}

export const getNoDpiaLabel = (id: string) => {
  if (id === 'NO_SPECIAL_CATEGORY_PI') {
    return intl.no_dpia_no_special_category_pi
  } else if (id === 'SMALL_SCALE') {
    return intl.no_dpia_small_scale
  } else if (id === 'NO_DATASET_CONSOLIDATION') {
    return intl.no_dpia_no_dataset_consolidation
  } else if (id === 'NO_NEW_TECH') {
    return intl.no_dpia_no_new_tech
  } else if (id === 'NO_PROFILING_OR_AUTOMATION') {
    return intl.no_dpia_no_profiling_or_automation
  } else if (id === 'OTHER') {
    return intl.no_dpia_other
  }
  return ''
}

export const checkForAaregDispatcher = (process: Process) => {
  return process.affiliation.disclosureDispatchers.find((d) => d.shortName === 'Aa-reg')
}
