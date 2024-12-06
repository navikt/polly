import { JSX } from 'react'

/* eslint-disable @typescript-eslint/no-var-requires */
import { JSX } from 'react'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const reactProcessString = require('react-process-string')

export const processString = reactProcessString as (
  converters: { regex: RegExp; fn: (key: string, result: string[]) => JSX.Element | string }[]
) => (input?: string) => JSX.Element[]
