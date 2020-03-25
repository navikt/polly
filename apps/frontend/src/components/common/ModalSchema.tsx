import {ErrorMessage} from 'formik'
import {Block, BlockProps} from 'baseui/block'
import {KIND as NKIND, Notification} from 'baseui/notification'
import {Label2} from 'baseui/typography'
import * as React from 'react'
import {PLACEMENT, StatefulTooltip} from 'baseui/tooltip'
import {theme} from '../../util'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import {paddingZero} from './Style'

type ModalBlockProps = {
    blockProps?: BlockProps,
    tooltip?: string
}

export const Error = (props: { fieldName: string, fullWidth?: boolean }) => (
    <ErrorMessage name={props.fieldName}>
        {msg => (
            <Block display="flex" width="100%" marginTop=".2rem">
                {!props.fullWidth && <ModalLabel/>}
                <Block width="100%">
                    <Notification overrides={{Body: {style: {width: 'auto', ...paddingZero, marginTop: 0}}}}
                                  kind={NKIND.negative}>{msg}</Notification>
                </Block>
            </Block>
        )}
    </ErrorMessage>
)

export const ModalLabel = (props: { label?: any, tooltip?: string | React.ReactElement }) => {
    return (
        <Block minWidth="25%" alignSelf="center" paddingRight=".5rem">
            {props.tooltip ?
                <StatefulTooltip content={props.tooltip} placement={PLACEMENT.top}>
                    <Label2 font="font300" display="flex" width="100%" justifyContent={"flex-start"}>
                      <Block display={"flex"}>
                        <Block>{props.label}</Block>
                        <Block>
                          <FontAwesomeIcon style={{marginLeft: ".5rem", alignSelf: "center"}}
                                           icon={faExclamationCircle} color={theme.colors.primary300}
                                           size="sm"/>
                        </Block>
                      </Block>
                    </Label2>
                </StatefulTooltip>
                : <Label2 font="font300">{props.label}</Label2>
            }
        </Block>
    )
}

export const ModalBlock: React.FunctionComponent<ModalBlockProps> = (props) => {
    return (
        <Block {...props.blockProps}>
            {props.children}
            {
                props.tooltip &&
                <StatefulTooltip
                    content={props.tooltip}
                    placement={PLACEMENT.top}
                    overrides={{
                        Body: {
                            style: {
                                maxWidth: '400px'
                            }
                        }
                    }}
                >
                    <Label2 font="font300" display="flex" justifyContent="space-between">
                        <FontAwesomeIcon
                            style={{marginRight: '.5rem', marginLeft: '10px'}}
                            icon={faExclamationCircle}
                            color={theme.colors.primary300}
                            size="sm"
                        />
                    </Label2>
                </StatefulTooltip>
            }
        </Block>
    )
}
