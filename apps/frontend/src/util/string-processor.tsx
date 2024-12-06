import { JSX } from 'react'

/* eslint-disable @typescript-eslint/no-var-requires */
const reactProcessString = require('react-process-string')
export const processString = reactProcessString as (
  converters: { regex: RegExp; fn: (key: string, result: string[]) => JSX.Element | string }[]
) => (input?: string) => JSX.Element[]
