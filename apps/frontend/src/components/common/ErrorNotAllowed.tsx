import * as React from 'react'
import { KIND, Notification } from 'baseui/notification'
import { ParagraphMedium } from 'baseui/typography'

const ErrorNotAllowed = () => {
  return (
    <Notification
      kind={KIND.warning}
      overrides={{
        Body: { style: { marginTop: '2rem', width: 'auto' } },
      }}
    >
      <ParagraphMedium>Du har ikke tilgang til denne siden.</ParagraphMedium>
    </Notification>
  )
}

export default ErrorNotAllowed
