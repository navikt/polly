import { Block, BlockProps } from "baseui/block"
import { Label2, Label3 } from "baseui/typography"
import React from "react"

const labelBlockProps: BlockProps = {
    display: ['flex', 'block', 'block', 'flex'],
    width: ['20%', '100%', '100%', '20%'],
    alignSelf: 'flex-start',
}

export const AuditLabel = (props: { label: string, children: any }) => {
    return (
        <Block display={['flex', 'block', 'block', 'flex']}>
            <Block {...labelBlockProps}>
                <Label2>{props.label}</Label2>
            </Block>
            <Block>
                <Label3>{props.children}</Label3>
            </Block>
        </Block>
    )
}