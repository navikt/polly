import axios from 'axios'
import '../constants'
import { IPvkDokumentShort } from '../constants'
import { env } from '../util/env'

export const getPvkDokumentForBehandling = async (behandlingId: string) => {
  return (
    await axios.get<IPvkDokumentShort[]>(
      `${env.pollyBaseUrl}/etterlevelse/pvkdokument/behandling/${behandlingId}`
    )
  ).data
}
