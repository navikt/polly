import * as React from 'react'
import { Notification, KIND } from 'baseui/notification'
import { Paragraph2, Paragraph1 } from 'baseui/typography'
import { intl } from '../../util/intl/intl'

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