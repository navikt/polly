import React, { useReducer, useState } from 'react'
import { Block } from 'baseui/block'
import { theme } from '../../util'
import { LabelLarge } from 'baseui/typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faChartPie, faCircle } from '@fortawesome/free-solid-svg-icons'
import { Card } from 'baseui/card'
import { hideBorder, marginAll } from '../common/Style'
import * as _ from 'lodash'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'

const cursor = { cursor: 'pointer' }

interface ChartData {
  label: string
  color?: string
  size: number
  onClick?: () => void
}

interface ChartDataExpanded extends ChartData {
  color: string
  fraction: number
  sizeFraction: number
  start: number
}

type ChartType = 'pie' | 'bar'

interface ChartProps {
  headerTitle?: string
  chartTitle: string
  leftLegend?: boolean
  total?: number
  data: ChartData[]
  size: number
  type?: ChartType
  hidePercent?: boolean
}

export const Chart = (props: ChartProps) => {
  const { headerTitle, size, total, data, chartTitle, leftLegend, hidePercent } = props
  const totSize = data.map((d) => d.size).reduce((a, b) => a + b, 0)
  const totalFraction = total !== undefined ? total : totSize

  const colorsBase = [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',

    // original palette
    // '#2196f3',
    // '#03a9f4',
    // '#00bcd4',
    // '#009688',
    // '#4caf50',
    // '#8bc34a',
    // '#cddc39',
    // '#ffeb3b',
    // '#ffc107',
    // '#ff9800',
    // '#ff5722',
    // '#f44336',
    // '#e91e63',
    // '#9c27b0',
    // '#673ab7',
    // '#3f51b5',
    // '#795548',

    // Nav farger
    // '#C30000',
    // '#FF9100',
    // '#A2AD00',
    // '#06893A',
    // '#634689',
    // '#005B82',
    // '#0067C5',
    // '#66CBEC',
  ]

  const splice = Math.random() * colorsBase.length
  const colors = [...colorsBase.slice(splice), ...colorsBase.slice(0, splice)]

  let s = 0
  const expData: ChartDataExpanded[] = data.map((d, idx) => {
    // last color can't be same color as first color, as they are next to each other
    const colorIndex = data.length - 1 === colors.length && idx >= data.length - 1 ? idx + 1 : idx
    const pieData = {
      ...d,
      color: d.color || colors[colorIndex % colors.length],
      start: s,
      sizeFraction: totSize === 0 ? 0 : d.size / totSize,
      fraction: totalFraction === 0 ? 0 : d.size / totalFraction,
    }
    s += pieData.sizeFraction
    return pieData
  })

  return (
    <>
      {headerTitle && (
        <Block marginLeft={(size - 1) * 2 + 'px'}>
          <LabelLarge marginLeft={theme.sizing.scale700}>{headerTitle}</LabelLarge>
        </Block>
      )}
      <Block>
        <Visualization data={expData} size={size} chartTitle={chartTitle} leftLegend={!!leftLegend} hidePercent={!!hidePercent} type={props.type || 'pie'} />
      </Block>
    </>
  )
}

type VisualizationProps = {
  data: ChartDataExpanded[]
  size: number
  chartTitle: string
  leftLegend: boolean
  type: ChartType
  hidePercent: boolean
}

const Visualization = (props: VisualizationProps) => {
  const { size, data, chartTitle, leftLegend, hidePercent } = props
  const [hover, setHover] = useState<number>(-1)
  const [type, toggle] = useReducer((old) => (old === 'bar' ? 'pie' : 'bar'), props.type)

  let noChartData = !data.length || !data.reduce((p, c) => p + c.size, 0)
  return (
    <Block position="relative">
      <Card
        overrides={{
          Root: {
            style: hideBorder,
          },
          Contents: {
            style: { ...marginAll(theme.sizing.scale400) },
          },
          Body: { style: { marginBottom: 0 } },
        }}
      >
        <div onMouseLeave={() => setHover(-1)}>
          <Block display="flex" alignItems="center" flexDirection={leftLegend ? 'row-reverse' : 'row'} maxWidth={'fit-content'} flexWrap>
            {!noChartData && (
              <Block>
                {type === 'pie' && <PieChart data={data} radius={size} hover={hover} setHover={setHover} />}
                {type === 'bar' && <BarChart data={data} size={size} hover={hover} setHover={setHover} />}
              </Block>
            )}
            <Block marginLeft={theme.sizing.scale200} marginRight={theme.sizing.scale200} marginTop={noChartData ? theme.sizing.scale400 : undefined}>
              <LabelLarge marginBottom={theme.sizing.scale300}>{chartTitle}</LabelLarge>
              {!noChartData &&
                data.map((d, idx) => (
                  <div key={idx} onMouseOver={() => setHover(idx)} onClick={d.onClick}>
                    <Block backgroundColor={idx === hover ? theme.colors.accent50 : theme.colors.white} $style={cursor} display="flex" alignItems="center">
                      <FontAwesomeIcon icon={faCircle} color={d.color} />
                      <Block minWidth={theme.sizing.scale1000} display="flex" justifyContent="flex-end">
                        {d.size}
                      </Block>
                      {!hidePercent && (
                        <Block minWidth={theme.sizing.scale1000} display="flex" justifyContent="flex-end">
                          {(d.fraction * 100).toFixed(0)}%
                        </Block>
                      )}
                      <Block marginLeft={theme.sizing.scale400}>{d.label}</Block>
                    </Block>
                  </div>
                ))}
              {noChartData && <Block $style={{ ...marginAll(theme.sizing.scale100) }}>Ingen</Block>}
            </Block>
          </Block>
        </div>
      </Card>

      <div onClick={toggle} style={{ position: 'absolute', top: '5px', left: '5px' }}>
        <CustomizedStatefulTooltip content={type === 'bar' ? 'Kakediagram' : 'Søyledriagram'}>
          <Block $style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={type === 'bar' ? faChartPie : faChartBar} />
          </Block>
        </CustomizedStatefulTooltip>
      </div>
    </Block>
  )
}

const BarChart = (props: { data: ChartDataExpanded[]; size: number; hover: number; setHover: (i: number) => void }) => {
  const { data, size, hover, setHover } = props
  const max = _.max(data.map((d) => d.sizeFraction))!
  const maxVal = _.max(data.map((d) => d.size))!
  return (
    <svg height={size * 3} width={size * 3} viewBox="0 0 1150 1150" style={{ transform: 'scaleY(-1)' }}>
      <style>{'text {' + 'transform: scaleY(-1);' + 'font: italic 40px sans-serif;' + '}'}</style>

      <path d={'M 0 100 l 1100 0 l 0 -5 l -1100 0 '} fill="black" />
      <path d={'M 100 0 l 0 1100 l -5 0 l 0 -1100 '} fill="black" />

      {_.range(0, 11).map((i) => (
        <React.Fragment key={i}>
          <g transform={`translate(0 ${105 + i * 100})`}>
            <text>{(maxVal * i * 0.1).toFixed(0)}</text>
          </g>
          <path d={`M 80 ${100 + i * 100} l 1010 0 l 0 -1 l -1010 0 `} fill="black" />
        </React.Fragment>
      ))}

      {data.map((d, idx) => (
        <Bar
          key={idx}
          idx={idx}
          size={d.sizeFraction * (1 / max)}
          totalSize={data.length}
          start={d.start}
          color={d.color}
          hover={idx === hover}
          onMouseOver={() => setHover(idx)}
          onClick={d.onClick}
        />
      ))}
    </svg>
  )
}

const Bar = (props: PartProps) => {
  const { idx, size, color, totalSize, hover, onClick } = props
  const width = 1000 / (totalSize * 1.3)
  const d = `
      M ${120 + (idx / totalSize) * 1000} 100
      l 0 ${1000 * size}
      l ${width} 0
      l 0 ${-1000 * size}
      `
  const dHover = `
      M ${120 + (idx / totalSize) * 1000} 100
      l 0 ${1050}
      l ${width} 0
      l 0 ${-1050}
      `
  return (
    <>
      <path d={dHover} fill={hover ? theme.colors.accent100 : 'transparent'} fillOpacity={0.5} onMouseOver={props.onMouseOver} />
      <path d={d} fill={color} onMouseOver={props.onMouseOver} onClick={onClick} style={cursor} />
    </>
  )
}

const PieChart = (props: { data: ChartDataExpanded[]; radius: number; hover: number; setHover: (i: number) => void }) => {
  const { data, radius, hover, setHover } = props
  return (
    <svg height={radius * 2} width={radius * 2} viewBox="-1.1 -1.1 2.2 2.2" style={{ transform: 'rotate(-90deg)' }}>
      {data.map((d, idx) => (
        <Wedge
          key={idx}
          idx={idx}
          size={d.sizeFraction}
          totalSize={data.length}
          start={d.start}
          color={d.color}
          onMouseOver={() => setHover(idx)}
          onClick={d.onClick}
          hover={idx === hover}
        />
      ))}
    </svg>
  )
}

const pi = 3.1415926
const tau = 2 * pi

type PartProps = {
  idx: number
  totalSize: number

  size: number
  start: number
  color: string
  hover: boolean
  onMouseOver: () => void
  onClick?: () => void
}

const Wedge = (props: PartProps) => {
  const { size, start, color, hover, onClick } = props
  const scale = hover ? 1.05 : 1
  const d = `
  M ${Math.cos(start * tau) * scale} ${Math.sin(start * tau) * scale}
  A ${scale} ${scale} 0 ${size >= 0.5 ? 1 : 0} 1 ${Math.cos((start + size) * tau) * scale} ${Math.sin((start + size) * tau) * scale}
  L 0 0
  `
  return <path d={d} fill={color} onMouseOver={props.onMouseOver} onClick={onClick} style={cursor} />
}
