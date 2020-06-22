import * as React from 'react'
import { KIND, Notification } from 'baseui/notification'
import { Paragraph2 } from 'baseui/typography'
import { intl } from '../../util'

const ErrorNotAllowed = () => {

    return (
        <Notification
            kind={KIND.warning}
            overrides={{
                Body: { style: { marginTop: '2rem', width: 'auto' } }
            }}
        >
            <Paragraph2>{intl.notAllowedMessage}</Paragraph2>
        </Notification>
    )
}

export default ErrorNotAllowed
