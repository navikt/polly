import { InformationSquareIcon } from '@navikt/aksel-icons'
import { InfoCard, List, ReadMore } from '@navikt/ds-react'
import { useParams } from 'next/navigation'
import { FunctionComponent, useEffect, useState } from 'react'
import { TPathParams } from '@/components/mainPages/ProcessPage'
import { EProcessStatus, IProcess } from '@/constants'
import { EListName, ICode } from '@/constants/codelistConstant'
import { ICodelistProps } from '@/provider/kodeverkProvider'
import { env } from '@/util/env'
import { useQueryParam } from '@/util/hooks'
import { useLocation } from '@/util/router'
import ProcessPageButtonGroup from '../common/processPageButtonGroup'

type TProps = {
  overordnetBehandling: IProcess
  codelistUtils: ICodelistProps
}

const UnderordnetBehandlingList: FunctionComponent<TProps> = ({
  overordnetBehandling,
  codelistUtils,
}) => {
  const params = useParams<TPathParams>()
  const current_location = useLocation()
  const { code } = params
  const filter = useQueryParam<EProcessStatus>('filter')

  const [exportHref, setExportHref] = useState<string>('')
  const [, setErrorProcessModal] = useState<string>('')
  const [, setCreateProcessModalKey] = useState<number>(0)
  const [, setShowCreateProcessModal] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      const pathName: string = current_location.pathname.split('/')[1]
      if (pathName === 'seksjon') {
        setExportHref(`${env.pollyBaseUrl}/export/process?section=${code}`)
      } else if (pathName === 'team') {
        setExportHref(`${env.pollyBaseUrl}/export/process?productTeam=${code}`)
      }
    })()
  }, [code, filter])

  return (
    <div className='mt-5'>
      <ReadMore header='Om overordnede og underordnede behandlinger' className='mb-5'>
        Behandlingen{' '}
        <strong>
          B{overordnetBehandling.number}{' '}
          {overordnetBehandling.purposes
            .map((purpose: ICode) => codelistUtils.getShortname(EListName.PURPOSE, purpose.code))
            .join(', ')}
          : {overordnetBehandling.name}
        </strong>{' '}
        kan brukes som overordnet behandling. Dette kan gjøres hvis:
        <List as='ul' className='my-5'>
          <List.Item>
            den underordnede behandlingen har, eller skal ha, samme overordnet behandlingsaktivitet
            som B${overordnetBehandling.number}.
          </List.Item>
          <List.Item>
            det ønskes samlet mange behandlinger under samme, overordnet behandling, nemlig B$
            {overordnetBehandling.number}.
          </List.Item>
        </List>
        Koblingen oppretter du ved å redigere den behandlingen som skal bli underordnet denne. Les
        mer om overordnede og underordnede behandlinger (åpner i en ny fane).
      </ReadMore>

      <div className='w-full flex justify-end my-5'>
        <ProcessPageButtonGroup
          isEditable={true}
          exportHref={exportHref}
          setErrorProcessModal={setErrorProcessModal}
          setCreateProcessModalKey={setCreateProcessModalKey}
          setShowCreateProcessModal={setShowCreateProcessModal}
          process={overordnetBehandling}
        />
      </div>

      {overordnetBehandling.underordnetBehandlinger?.length === 0 && (
        <InfoCard data-color='info'>
          <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
            Det finnes ingen underordnede behandlinger, men det er mulig å velge denne behandlingen
            som overordnet.
          </InfoCard.Message>
        </InfoCard>
      )}
    </div>
  )
}

export default UnderordnetBehandlingList
