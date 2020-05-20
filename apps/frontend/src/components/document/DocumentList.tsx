import * as React from "react";
import {Block} from "baseui/block";
import {theme} from "../../util";
import {primitives} from "../../util/theme";
import {Label1} from "baseui/typography";
import {FlexGrid, FlexGridItem} from "baseui/flex-grid";
import RouteLink from "../common/RouteLink";
import {Document} from "../../constants"

const DocumentList = (props: { documents: Array<Document>, baseUrl: string }) => {

  const documents = props.documents
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((acc, cur) => {
      const letter = cur.name.toUpperCase()[0]
      acc[letter] = [...(acc[letter] || []), cur]
      return acc
    }, {} as { [letter: string]: Document[] })

  return (
    <>
      {
        Object.keys(documents).map(letter =>
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
              {documents[letter].map(document =>
                <FlexGridItem key={document.id}>
                  <RouteLink href={`${props.baseUrl}${document.id}`}>
                    {document.name}
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

export default DocumentList
