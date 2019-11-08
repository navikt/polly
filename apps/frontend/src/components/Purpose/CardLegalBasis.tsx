import * as React from 'react';
import { Select, TYPE, Value } from 'baseui/select';
import { Block, BlockProps } from 'baseui/block'
import { Card } from 'baseui/card'
import { Input, StatefulInput } from 'baseui/input';
import { Label2 } from 'baseui/typography';
import { Button, KIND, SIZE as ButtonSize } from 'baseui/button';

const rowBlockBrops: BlockProps = {
    display: 'flex',
    marginBottom: '1rem'
}


const getParsedOptions = (codelist: any) => {
    if (!codelist) return []
    return Object.keys(codelist).reduce((acc: any, curr: any) => {
        return [...acc, { id: codelist[curr], code: curr }];
    }, []);
}

const CardLegalBasis = (props: any) => {
    const [gdpr, setGdpr] = React.useState<Value>([]);
    const [nationalLaw, setNationalLaw] = React.useState<Value>([]);
    const [description, setDescription] = React.useState("");
    const [error, setError] = React.useState()

    const { codelist, submit } = props

    const getValues = () => {
        if (gdpr.length < 1 && nationalLaw.length < 1 && description === "") {
            setError("Kunne ikke legge til. Fyll ut minst ett felt.")
            return null
        }

        setError(null)
        return {
            gdpr: gdpr.length > 0 ? gdpr[0].code : null,
            nationalLaw: nationalLaw.length > 0 ? nationalLaw[0].code : null,
            description: description
        }
    }

    return (
        <Card>
            <Label2 marginBottom="1rem">Nytt rettslig grunnlag</Label2>

            <Block {...rowBlockBrops} width="100%">
                <Select
                    options={getParsedOptions(codelist.GDPR_ARTICLE)}
                    labelKey="code"
                    valueKey="code"
                    placeholder="Velg GDPR artikkel"
                    maxDropdownHeight="300px"
                    type={TYPE.search}
                    onChange={({ value }) => setGdpr(value)}
                    value={gdpr}
                />
            </Block>
            <Block {...rowBlockBrops}>
                <Select
                    options={getParsedOptions(codelist.NATIONAL_LAW)}
                    labelKey="code"
                    valueKey="code"
                    placeholder="Velg nasjonal lov"
                    maxDropdownHeight="300px"
                    type={TYPE.search}
                    onChange={({ value }) => setNationalLaw(value)}
                    value={nationalLaw}
                />
            </Block>
            <Block {...rowBlockBrops}>
                <StatefulInput placeholder="Skriv inn beskrivelse" onChange={(event) => setDescription((event.target as HTMLInputElement).value)} />
            </Block>

            <Block width="100%" display="flex" justifyContent="space-between">
                <Button type='button' kind={KIND.secondary} size={ButtonSize.compact} onClick={() => submit(getValues())}>
                    Legg til rettslig grunnlag
                </Button>
                {error && <p>{error}</p>}
            </Block>
        </Card>


    )
}

export default CardLegalBasis