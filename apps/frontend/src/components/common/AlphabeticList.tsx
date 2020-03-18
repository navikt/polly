import * as React from "react";
import {Block} from "baseui/block";
import {theme} from "../../util";
import {primitives} from "../../util/theme";
import {Label1} from "baseui/typography";
import {FlexGrid, FlexGridItem} from "baseui/flex-grid";
import RouteLink from "./RouteLink";
import {Code, codelist, ListName} from "../../service/Codelist";

const AlphabeticList = (props:{listName:ListName, baseUrl:string}) => {

  const codes = codelist.getCodes(props.listName)
    .sort((a, b) => a.shortName.localeCompare(b.shortName))
    .reduce((acc, cur) => {
      const letter = cur.shortName.toUpperCase()[0]
      acc[letter] = [...(acc[letter] || []), cur]
      return acc
    }, {} as { [letter: string]: Code[] })

  return (
    <>
      {
        Object.keys(codes).map(letter =>
          <Block key={letter} marginBottom={theme.sizing.scale800}>

            <Block display='flex' alignItems='center' marginBottom={theme.sizing.scale800}>
              <Block
                width={theme.sizing.scale900}
                height={theme.sizing.scale900}
                backgroundColor={primitives.primary150}
                $style={{borderRadius: '50%'}}
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                <Label1 $style={{fontSize: '1.2em'}}>{letter}</Label1>
              </Block>

              <Block marginBottom={theme.sizing.scale800} marginRight={theme.sizing.scale400}/>
              <Block width='100%' $style={{borderBottomStyle: 'solid', borderBottomColor: theme.colors.mono500, borderBottomWidth: '2px'}}/>
            </Block>

            <FlexGrid flexGridRowGap={theme.sizing.scale600} flexGridColumnGap={theme.sizing.scale600} flexGridColumnCount={4}>
              {codes[letter].map(code =>
                <FlexGridItem key={code.code}>
                  <RouteLink href={`${props.baseUrl}${code.code}`}>
                    {code.shortName}
                  </RouteLink>
                </FlexGridItem>
              )}
            </FlexGrid>
          </Block>
        )
      }
    </>
  )
}

export default AlphabeticList
