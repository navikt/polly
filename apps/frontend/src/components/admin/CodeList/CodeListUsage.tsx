import { Button, Label, Loader, Select, Table } from '@navikt/ds-react'
import { createRef, useEffect, useState } from 'react'
import { replaceCodelistUsage } from '../../../api'
import { CodeUsage, ObjectType } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'
import { ObjectLink } from '../../common/RouteLink'

const UsageTable = (props: { usage: CodeUsage }) => {
  const { usage } = props
  const informationTypes = !!usage.informationTypes.length
  const processes = !!usage.processes.length
  const processors = !!usage.processors.length
  const dpProcesses = !!usage.dpProcesses.length
  const policies = !!usage.policies.length
  const disclosures = !!usage.disclosures.length
  const documents = !!usage.documents.length

  const rows = usage
    ? Math.max(
        usage.informationTypes.length,
        usage.processes.length,
        usage.processors.length,
        usage.dpProcesses.length,
        usage.policies.length,
        usage.disclosures.length,
        usage.documents.length,
      )
    : -1

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {informationTypes && <Table.ColumnHeader>Opplysningstype</Table.ColumnHeader>}
          {processes && <Table.ColumnHeader>Behandling</Table.ColumnHeader>}
          {processors && <Table.ColumnHeader>Databehandlere</Table.ColumnHeader>}
          {dpProcesses && <Table.ColumnHeader>NAV som databehandler</Table.ColumnHeader>}
          {policies && <Table.ColumnHeader>Polis</Table.ColumnHeader>}
          {disclosures && <Table.ColumnHeader>Utleveringer</Table.ColumnHeader>}
          {documents && <Table.ColumnHeader>Dokumenter</Table.ColumnHeader>}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Array.from(Array(rows).keys()).map((index) => {
          const it = usage.informationTypes[index]
          const po = usage.policies[index]
          const pr = usage.processes[index]
          const pro = usage.processors[index]
          const dpr = usage.dpProcesses[index]
          const di = usage.disclosures[index]
          const doc = usage.documents[index]
          return (
            <Table.Row key={index}>
              {informationTypes && (
                <Table.DataCell>
                  {it && (
                    <ObjectLink id={it.id} type={ObjectType.INFORMATION_TYPE} withHistory={true}>
                      {it.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {processes && (
                <Table.DataCell>
                  {pr && (
                    <ObjectLink id={pr.id} type={ObjectType.PROCESS} withHistory={true}>
                      {codelist
                        .getShortnames(
                          ListName.PURPOSE,
                          pr.purposes.map((p) => p.code),
                        )
                        .join(', ')}{' '}
                      {pr.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {processors && (
                <Table.DataCell>
                  {pr && (
                    <ObjectLink id={pro.id} type={ObjectType.PROCESSOR} withHistory={true}>
                      {pro.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {dpProcesses && (
                <Table.DataCell>
                  {dpr && (
                    <ObjectLink id={dpr.id} type={ObjectType.DP_PROCESS} withHistory={true}>
                      {dpr.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {policies && (
                <Table.DataCell>
                  {po && (
                    <ObjectLink id={po.id} type={ObjectType.POLICY} withHistory={true}>
                      {codelist.getShortnames(ListName.PURPOSE, po.purposes).join(', ')} {po.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {disclosures && (
                <Table.DataCell>
                  {di && (
                    <ObjectLink id={di.id} type={ObjectType.DISCLOSURE} withHistory={true}>
                      {di.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {documents && (
                <Table.DataCell>
                  {doc && (
                    <ObjectLink id={doc.id} type={ObjectType.DOCUMENT} withHistory={true}>
                      {doc.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export const Usage = (props: { usage?: CodeUsage; refresh: () => void }) => {
  const [showReplace, setShowReplace] = useState(false)
  const [newValue, setNewValue] = useState<string>()
  const ref = createRef<HTMLDivElement>()

  const { usage, refresh } = props

  useEffect(() => {
    setShowReplace(false)
    setTimeout(() => ref.current && window.scrollTo({ top: ref.current.offsetTop }), 200)
  }, [usage])

  const replace = async () => {
    if (newValue) {
      await replaceCodelistUsage(usage!.listName, usage!.code, newValue).then(() => refresh())
    }
  }

  return (
    <div className="mt-8" ref={ref}>
      <div className="flex justify-between mib-2">
        <Label>Bruk</Label>
        {!!usage?.inUse && (
          <Button type="button" variant="secondary" onClick={() => setShowReplace(true)}>
            Erstatt all bruk
          </Button>
        )}
      </div>

      {showReplace && usage && usage.listName && (
        <div className="flex m-4 justify-end">
          <Select label="Velg ny verdi" hideLabel className="mr-4" value={newValue} onChange={(params) => setNewValue(params.target.value)}>
            <option value="">Ny verdi</option>
            {codelist.getParsedOptions(usage.listName).map((code, index) => (
              <option key={index + '_' + code.label} value={code.label}>
                {code.label}
              </option>
            ))}
          </Select>

          <Button type="button" onClick={replace} disabled={!newValue}>
            Erstatt
          </Button>
        </div>
      )}

      {usage && <UsageTable usage={usage} />}
      {!usage && <Loader />}
    </div>
  )
}
