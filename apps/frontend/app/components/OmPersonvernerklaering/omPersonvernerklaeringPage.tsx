'use client'

import { BodyLong, Heading, List, Radio, RadioGroup } from '@navikt/ds-react'
import { TConsentValue } from '@/util/analytics/innblikk'
import { useConsent } from '@/util/analytics/useConsent'

const OmPersonvernerklaeringPage = () => {
  const { consent, setConsent } = useConsent()

  const handleConsentChange = (value: TConsentValue) => {
    setConsent(value)
  }

  return (
    <>
      <div>
        <Heading size='large' level='1' spacing>
          Personvernerklæring for Behandlingskatalogen
        </Heading>
        <BodyLong spacing>
          Denne personvernerklæringen beskriver hvordan Arbeids- og velferdsetaten ved Team
          datajegerne behandler dine personopplysninger som ansatt ved bruk av Behandlingskatalogen
        </BodyLong>

        <BodyLong className='mb-3'>Med Innblikk måler vi:</BodyLong>
        <List className='mb-6'>
          <List.Item>antall besøk på ulike sider</List.Item>
          <List.Item>varigheten på besøkene</List.Item>
          <List.Item>hvordan ansatte navigerer mellom de ulike sidene</List.Item>
          <List.Item>hvilke knapper som trykkes på og når</List.Item>
        </List>
        <BodyLong className='mb-3'>Med Innblikk måler vi ikke:</BodyLong>
        <List className='mb-6'>
          <List.Item>inndata i fritekstboks og søkefelt</List.Item>
          <List.Item>
            andre felter som kan inneholde personopplysninger eller pseudonymiserte
            personopplysninger
          </List.Item>
        </List>

        <RadioGroup
          className='mb-6'
          legend='Samtykke til måling med Innblikk'
          value={consent}
          onChange={handleConsentChange}
          name='samtykkeTilInnblikk'
        >
          <Radio value='accepted'>Godkjenn bruk av Innblikk</Radio>
          <Radio value='rejected'>Ikke godkjenn bruk av Innblikk</Radio>
        </RadioGroup>
      </div>
    </>
  )
}

export default OmPersonvernerklaeringPage
