import { Cell, HeadCell, Row, Table } from '../common/Table'

type AAregHjemmelDataTextProps = {
  data: string
}

export const AAregHjemmelDataText = (props: AAregHjemmelDataTextProps) => {
  const { data } = props
  const rawData = data ? prepareString(data).split('\n') : []

  const purposeList = rawData.filter((data) => data.match('Formål:')).map((purpose) => purpose.replace('Formål:', ''))
  const authoryList = rawData.filter((data) => data.match('Hjemmel:')).map((authory) => authory.replace('Hjemmel:', ''))
  const processorList = rawData.filter((data) => data.match('Behandlingsgrunnlag:')).map((processor) => processor.replace('Behandlingsgrunnlag:', ''))

  return (
    <div>
      <Table
        emptyText="Ikke angitt"
        headers={
          <>
            <HeadCell title="Formål med behandlingen" />
            <HeadCell title="NAVs hjemmel for utlevering" />
            <HeadCell title="Konsumentens hjemmel for behandlingen" />
          </>
        }
      >
        {purposeList.map((purpose: string, index: number) => (
          <Row key={purpose + '_' + index}>
            <Cell>
              <div>{purpose}</div>
            </Cell>
            <Cell>
              <div>{authoryList[index]}</div>
            </Cell>
            <Cell>
              <div>{processorList[index]}</div>
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  )
}
export default AAregHjemmelDataText

const prepareString = (text: string) => {
  return text.replace('\n\n', ' ').replace('\n\n\n', ' ')
}
