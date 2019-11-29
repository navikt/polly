import { intl, theme, useAwait } from "../util"
import { user } from "../service/User"
import * as React from "react"
import { Block } from "baseui/block"
import startIll from '../resources/start_illustration.svg'

export const Main = () => {
    useAwait(user.wait())

    return (
        <Block display="flex" justifyContent="center" alignContent="center" marginTop={theme.sizing.scale4800}>
            <img src={startIll} alt={intl.startIllustration} style={{maxWidth: "65%"}}/>
        </Block>
    )
}