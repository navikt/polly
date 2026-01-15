import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { Fragment, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { getAlertForDisclosure } from '../../api/AlertApi'
import { IDisclosure, IDisclosureAlert, disclosureSort } from '../../constants'
import { canViewAlerts } from '../../pages/AlertEventPage'
import { ICodelistProps } from '../../service/Codelist'
import { useTable } from '../../util/hooks'
import Button from './Button/CustomButton'
import { ListLegalBasesInTable } from './LegalBasis'
import RouteLink from './RouteLink'
import { Cell, HeadCell, Row, Table } from './Table'

type TTableDisclosureProps = {
  list: Array<IDisclosure>
  codelistUtils: ICodelistProps
}

type TAlerts = { [k: string]: IDisclosureAlert }
const TableDisclosure = ({ list, codelistUtils }: TTableDisclosureProps) => {
  const [alerts, setAlerts] = useState<TAlerts>({})

  const [table, sortColumn] = useTable<IDisclosure, keyof IDisclosure>(list, {
    sorting: disclosureSort,
    initialSortColumn: 'name',
  })

  useEffect(() => {
    ;(async () => {
      const alertMap: TAlerts = (
        await Promise.all(list.map((list: IDisclosure) => getAlertForDisclosure(list.id)))
      ).reduce((acc: TAlerts, alert: IDisclosureAlert) => {
        acc[alert.disclosureId] = alert
        return acc
      }, {} as TAlerts)
      setAlerts(alertMap)
    })()
  }, [list])

  return (
    <Fragment>
      <Table
        emptyText="Ingen utlevering"
        headers={
          <>
            <HeadCell title="Mottaker" column="recipient" tableState={[table, sortColumn]} />
            <HeadCell title="Navn på utlevering" column="name" tableState={[table, sortColumn]} />
            <HeadCell title="Dokument" column="document" tableState={[table, sortColumn]} />
            <HeadCell
              title="Formål med utlevering"
              column="recipientPurpose"
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title="Ytterligere beskrivelse"
              column="description"
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title="Behandlingsgrunnlag"
              column="legalBases"
              tableState={[table, sortColumn]}
            />
            <HeadCell small />
          </>
        }
      >
        {table.data.map((row: IDisclosure, index: number) => (
          <DisclosureRow
            codelistUtils={codelistUtils}
            key={index}
            disclosure={row}
            alert={alerts[row.id]}
          />
        ))}
      </Table>
    </Fragment>
  )
}

interface IDisclosureRowProps {
  disclosure: IDisclosure
  alert: IDisclosureAlert
  codelistUtils: ICodelistProps
}

const DisclosureRow = (props: IDisclosureRowProps) => {
  const { disclosure, alert, codelistUtils } = props
  const navigate: NavigateFunction = useNavigate()
  const hasAlert: boolean = alert?.missingArt6

  return (
    <Row>
      <Cell>
        <RouteLink href={`/thirdparty/${disclosure.recipient.code}`}>
          {disclosure.recipient.shortName}
        </RouteLink>
      </Cell>
      <Cell>{disclosure.name}</Cell>
      <Cell>
        {
          <RouteLink href={`/document/${disclosure.documentId}`}>
            {disclosure.document?.name}
          </RouteLink>
        }
      </Cell>
      <Cell>{disclosure.recipientPurpose}</Cell>
      <Cell>{disclosure.description}</Cell>
      <Cell>
        {disclosure.legalBases && (
          <ListLegalBasesInTable legalBases={disclosure.legalBases} codelistUtils={codelistUtils} />
        )}
      </Cell>
      <Cell small>
        {hasAlert && canViewAlerts() && (
          <Button
            type="button"
            kind="tertiary"
            size="xsmall"
            icon={faExclamationCircle}
            tooltip={
              hasAlert ? `Varsler: Behandlingsgrunnlag for artikkel 6 mangler` : `Varsler: Nei`
            }
            onClick={() => navigate(`/alert/events/disclosure/${disclosure.id}`)}
          />
        )}
      </Cell>
    </Row>
  )
}

export default TableDisclosure
