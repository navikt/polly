import { LegalBasis } from "../constants"
import { codelist, ListName } from "../codelist"
import { processString } from "./string-processor"
import * as React from "react"

const lovdata_base = process.env.REACT_APP_LOVDATA_BASE_URL;

export const renderLegalBasis = (legalBasis: LegalBasis) => {
  let gdpr = codelist.getShortname(ListName.GDPR_ARTICLE, legalBasis.gdpr.code)
  let nationalLaw = legalBasis.nationalLaw && codelist.getShortname(ListName.NATIONAL_LAW, legalBasis.nationalLaw.code)
  let nationalLawId = legalBasis.nationalLaw && !legalBasis.nationalLaw.invalidCode && codelist.getDescription(ListName.NATIONAL_LAW, legalBasis.nationalLaw.code)

  let description = nationalLawId ? legalBasisLinkProcessor(nationalLawId, legalBasis.description) : legalBasis.description

  return (
      <span> {gdpr + ', '} {nationalLaw && nationalLaw} {description}</span>
  )
}

const legalBasisLinkProcessor = (law: string, text: string) => processString([{
  regex: /(§+).?(\d+(-\d+)?)/g,
  fn: (key: string, result: string[]) =>
      <a key={key} href={`${lovdata_base + codelist.getDescription(ListName.NATIONAL_LAW, law)}/§${result[2]}`} target="_blank" rel="noopener noreferrer">
        {result[1]} {result[2]}
      </a>
}])(text)