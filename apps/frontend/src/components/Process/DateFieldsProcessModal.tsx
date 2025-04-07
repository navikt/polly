import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Tooltip } from '@navikt/ds-react'
import { useState } from 'react'
import { theme } from '../../util'
import { EndDate } from './EndDate'
import { StartDate } from './StartDate'

interface IDateModalProps {
  showDates: boolean
  showLabels?: boolean
}

interface ILabelWithTooltipProps {
  text: string
  tooltip: string
}

const LabelWithTooltip = (props: ILabelWithTooltipProps) => {
  const { text, tooltip } = props

  return (
    <Tooltip content={tooltip}>
      <Button type="button" variant="tertiary-neutral" size="small">
        {text}
        <FontAwesomeIcon
          style={{ marginLeft: '.5rem', alignSelf: 'center' }}
          icon={faQuestionCircle}
          color={theme.colors.primary300}
          size="sm"
        />
      </Button>
    </Tooltip>
  )
}

export const DateFieldsProcessModal = (props: IDateModalProps) => {
  const { showLabels } = props
  const [showDates, setShowDates] = useState<boolean>(props.showDates)

  return (
    <>
      {!showDates && (
        <div className="flex w-full mt-4">
          <Button size="xsmall" type="button" onClick={() => setShowDates(true)}>
            Velg datoer
          </Button>
        </div>
      )}{' '}
      {showDates && (
        <>
          <div className="w-full">
            <div className="flex w-full">
              <div className="w-1/2 mr-4">
                {showLabels && (
                  <LabelWithTooltip
                    text="Fom dato"
                    tooltip="Fra og med-dato er preutfylt med den datoen NAV ble opprettet. For behandlinger med senere fom-dato, må denne endres. Datoen kan også settes frem i tid."
                  />
                )}
              </div>
              <div className="w-1/2">
                {showLabels && (
                  <LabelWithTooltip
                    text="Tom dato"
                    tooltip="Til og med-dato skal kun oppgis dersom behandlingen er midlertidig og har en sluttdato."
                  />
                )}
              </div>
            </div>
            <div className="flex w-full">
              <StartDate />

              <EndDate />
            </div>
          </div>
        </>
      )}
    </>
  )
}
