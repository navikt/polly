import { BodyLong, InlineMessage, Link, SortState, Table } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getAlertForDisclosure } from '../../api/AlertApi'
import { IDisclosure, IDisclosureAlert } from '../../constants'
import { ICodelistProps } from '../../service/Codelist'
import { handleSort } from '../../util/handleTableSort'
import { ListLegalBasesInTable } from './LegalBasis'

type TTableDisclosureProps = {
  list: Array<IDisclosure>
  codelistUtils: ICodelistProps
}

type TAlerts = { [k: string]: IDisclosureAlert }

const TableDisclosure = ({ list, codelistUtils }: TTableDisclosureProps) => {
  const [alerts, setAlerts] = useState<TAlerts>({})
  const [sort, setSort] = useState<SortState>()

  let sortedData: IDisclosure[] = list

  const comparator = (a: IDisclosure, b: IDisclosure, orderBy: string): number => {
    switch (orderBy) {
      case 'recipient':
        return a.recipient.shortName.localeCompare(b.recipient.shortName)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'document':
        return (a.document?.name || '').localeCompare(b.document?.name || '')
      case 'recipientPurpose':
        return a.recipientPurpose.localeCompare(b.recipientPurpose)
      case 'description':
        return (a.description || '').localeCompare(b.description || '')
      case 'legalBases':
        return (a.legalBases[0].description || '').localeCompare(b.legalBases[0].description || '')
      default:
        return 0
    }
  }

  sortedData = sortedData.sort((a: IDisclosure, b: IDisclosure) => {
    if (sort) {
      return sort.direction === 'ascending'
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy)
    }
    return 1
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
    <Table size="small" sort={sort} onSortChange={(sortKey) => handleSort(sort, setSort, sortKey)}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader sortKey="recipient" className="w-1/6" sortable>
            Mottaker
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey="name" className="w-1/6" sortable>
            Navn på utlevering
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey="document" className="w-1/6" sortable>
            Dokument
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey="recipientPurpose" className="w-1/6" sortable>
            Formål med utlevering
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey="description" className="w-1/6" sortable>
            Ytterligere beskrivelse
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey="legalBases" className="w-1/6" sortable>
            Behandlingsgrunnlag
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedData.length === 0 ? (
          <BodyLong>Ingen utleveringer</BodyLong>
        ) : (
          sortedData.map((row: IDisclosure, index: number) => (
            <Table.Row key={index}>
              <Table.DataCell textSize="small">
                <Link href={`/thirdparty/${row.recipient.code}`}>{row.recipient.shortName}</Link>
              </Table.DataCell>
              <Table.DataCell textSize="small">{row.name}</Table.DataCell>
              <Table.DataCell textSize="small">
                <Link href={`/document/${row.documentId}`}>{row.document?.name}</Link>
              </Table.DataCell>
              <Table.DataCell textSize="small">{row.recipientPurpose}</Table.DataCell>
              <Table.DataCell textSize="small" className="break-all">
                {row.description}
              </Table.DataCell>
              <Table.DataCell textSize="small">
                {row.legalBases && (
                  <ListLegalBasesInTable
                    legalBases={row.legalBases}
                    codelistUtils={codelistUtils}
                  />
                )}
                {alerts[row.id] && alerts[row.id].missingArt6 && (
                  <InlineMessage size="small" status="warning">
                    <Link href={`/alert/events/disclosure/${row.id}`}>
                      Behandlingsgrunnlag for artikkel 6 mangler
                    </Link>
                  </InlineMessage>
                )}
              </Table.DataCell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  )
}

export default TableDisclosure
