import {intl} from "./intl/intl";
import {StyledLink} from "baseui/link";
import * as React from "react";
import {StatefulTooltip} from 'baseui/tooltip'
import {lowerFirst} from 'lodash'

export const isLink = (text: string) => {
  const regex = /http[s]?:\/\/.*/gm
  if(!regex.test(text)){
    return false
  }
  return true;
}

export const shortenLinksInText = (text: string) => {
  return text.split(" ").map((word, index) => {
    if (isLink(word)) {
      return (
        <span key={index}>
          <StatefulTooltip content={word}>
            <StyledLink href={word} target="_blank" rel="noopener noreferrer">{index === 0 ? intl.seeExternalLink : lowerFirst(intl.seeExternalLink)}</StyledLink>
          </StatefulTooltip>
          &nbsp;
        </span>
      )
    } else {
      return <span>{word} </span>
    }
  })
}
export const mapBool = (b?: boolean) => b === true ? true : b === false ? false : undefined
