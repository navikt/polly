import React from "react"

const reactProcessString = require("react-process-string")
export const processString = reactProcessString as (converters: { regex: RegExp, fn: (key: string, result: string[]) => JSX.Element }[]) => ((input: string) => JSX.Element[])
