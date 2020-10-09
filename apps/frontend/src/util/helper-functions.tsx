import {intl} from "./intl/intl";
import {StyledLink} from "baseui/link";
import * as React from "react";

export const isLink = (text: string) => {
  const regex = /http[s]?:\/\/.*/gm
  if(!regex.test(text)){
    return false
  }
  return true;
}

export const shortenLinksInText = (text: string) => {
  let objects: any = []
  text.split(" ").forEach((word, index) => {
    if (isLink(word)) {
      objects.push(
        <React.Fragment key={index}>
          <StyledLink href={`${word}`}>{intl.seeExternalLink}</StyledLink>
          &nbsp;
        </React.Fragment>
      )
    } else {
      objects.push(word + " ")
    }
  })
  return objects
}
export const mapBool = (b?: boolean) => b === true ? true : b === false ? false : undefined
