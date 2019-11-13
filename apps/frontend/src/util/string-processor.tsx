import { Codelist } from "../constants"
import * as React from "react"

const reactProcessString = require("react-process-string")
export const processString = reactProcessString as (converters: { regex: RegExp, fn: (key: string, result: string[]) => JSX.Element }[]) => ((input: string) => JSX.Element)

const lovdata_base = process.env.REACT_APP_LOVDATA_BASE_URL;

export const legalBasisLinkProcessor = (codelist: Codelist, law: string, text: string) => processString([{
  regex: /(§+).?(\d+(-\d+)?)/g,
  fn: (key: string, result: string[]) =>
      <a key={key} href={`${lovdata_base + codelist.NATIONAL_LAW[law]}/§${result[2]}`} target="_blank" rel="noopener noreferrer">
        {result[1]} {result[2]}
      </a>
}])(text)