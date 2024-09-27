import { StyledLink } from 'baseui/link'
import { StatefulTooltip } from 'baseui/tooltip'
import { KeyboardEvent } from 'react'
import { IProcess } from '../constants'
import { ICode } from '../service/Codelist'

export const isLink = (text: string): boolean => {
  const regex = /http[s]?:\/\/.*/gm
  if (!regex.test(text)) {
    return false
  }
  return true
}

export const shortenLinksInText = (text: string) => {
  return text.split(/\s+/).map((word: string, index: number) => {
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

export const disableEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter') event.preventDefault()
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

export const checkForAaregDispatcher = (process: IProcess) => {
  return process.affiliation.disclosureDispatchers.find(
    (disclosureDispatcher: ICode) => disclosureDispatcher.shortName === 'Aa-reg'
  )
}
