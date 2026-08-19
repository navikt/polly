import { EPvkDokumentStatus, EPvkVurdering } from '@/constants'

export const pvkVurderingToText = (vurdering: EPvkVurdering) => {
  switch (vurdering) {
    case EPvkVurdering.ALLEREDE_UTFORT:
      return 'PVK allerede utført'
    case EPvkVurdering.SKAL_IKKE_UTFORE:
      return 'Vurdert at det ikke er behov for PVK'
    case EPvkVurdering.SKAL_UTFORE:
      return 'Vurdert at det er behov for PVK'
    default:
      return 'Ikke vurdert behov for PVK'
  }
}

export const pvkDokumentStatusToText = (status: EPvkDokumentStatus) => {
  switch (status) {
    case EPvkDokumentStatus.UNDERARBEID:
      return 'Underarbeid'
    case EPvkDokumentStatus.SENDT_TIL_PVO:
      return 'PVK ligger til vurdering hos Personvernombudet'
    case EPvkDokumentStatus.SENDT_TIL_PVO_FOR_REVURDERING:
      return 'PVK ligger til revurdering hos Personvernombudet'
    case EPvkDokumentStatus.VURDERT_AV_PVO:
      return 'PVK har fått tilbakemelding fra Personvernombudet'
    case EPvkDokumentStatus.VURDERT_AV_PVO_TRENGER_MER_ARBEID:
      return 'PVK har fått tilbakemelding fra Personvernombudet'
    case EPvkDokumentStatus.TRENGER_GODKJENNING:
      return 'PVK sendt til godkjenning hos risikoeier'
    case EPvkDokumentStatus.GODKJENT_AV_RISIKOEIER:
      return 'PVK godkjent av risikoeier'
    case EPvkDokumentStatus.PVO_UNDERARBEID:
      return 'Personvernombudet jobber med tilbakemelding'
    default:
      return 'Underarbeid'
  }
}

export const getPvkDokumentStatus = (
  status: EPvkDokumentStatus,
  hasPvkDocumentationStarted: boolean
) => {
  if (status === EPvkDokumentStatus.UNDERARBEID && hasPvkDocumentationStarted) {
    return 'påbegynt'
  } else if (status === EPvkDokumentStatus.UNDERARBEID && !hasPvkDocumentationStarted) {
    return 'ikke påbegynt'
  } else {
    return pvkDokumentStatusToText(status)
  }
}
