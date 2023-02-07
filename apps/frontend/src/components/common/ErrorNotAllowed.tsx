import * as React from 'react'
import { KIND, Notification } from 'baseui/notification'
import { ParagraphMedium } from 'baseui/typography'
import { intl } from '../../util'

const ErrorNotAllowed = () => {
  return (
    <Notification
      kind={KIND.warning}
      overrides={{
        Body: { style: { marginTop: '2rem', width: 'auto' } },
      }}
    >
      <ParagraphMedium>{intl.notAllowedMessage}</ParagraphMedium>
    </Notification>
  )
}

export default ErrorNotAllowed
