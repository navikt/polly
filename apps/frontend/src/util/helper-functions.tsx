import { StyledLink } from 'baseui/link'
import * as React from 'react'
import { KeyboardEvent } from 'react'
import { StatefulTooltip } from 'baseui/tooltip'
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
              se ekstern lenke
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
    return 'Ingen særlige kategorier personopplysninger behandles'
  } else if (id === 'SMALL_SCALE') {
    return 'Behandlingen skjer ikke i stor skala (få personopplysninger eller registrerte)'
  } else if (id === 'NO_DATASET_CONSOLIDATION') {
    return 'Ingen sammenstilling av datasett på tvers av formål'
  } else if (id === 'NO_NEW_TECH') {
    return 'Ingen bruk av teknologi på nye måter eller ny teknologi'
  } else if (id === 'NO_PROFILING_OR_AUTOMATION') {
    return 'Ingen bruk av profilering eller automatisering'
  } else if (id === 'OTHER') {
    return 'Annet'
  }
  return ''
}

export const checkForAaregDispatcher = (process: Process) => {
  return process.affiliation.disclosureDispatchers.find((d) => d.shortName === 'Aa-reg')
}
