import { faChartBar, faChartPie, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Tooltip } from '@navikt/ds-react'
import { Card } from 'baseui/card'
import { LabelLarge } from 'baseui/typography'
import * as _ from 'lodash'
import { Fragment, useReducer, useState } from 'react'
import { theme } from '../../util'
import { hideBorder, marginAll } from '../common/Style'

const cursor = { cursor: 'pointer' }

interface IChartData {
  label: string
  color?: string
  size: number
  onClick?: () => void
}

interface IChartDataExpanded extends IChartData {
  color: string
  fraction: number
  sizeFraction: number
  start: number
}

type TChartType = 'pie' | 'bar'

interface IChartProps {
  headerTitle?: string
  chartTitle: string
  leftLegend?: boolean
  total?: number
  data: IChartData[]
  size: number
  type?: TChartType
  hidePercent?: boolean
}

export const Chart = (props: IChartProps) => {
  const { headerTitle, size, total, data, chartTitle, leftLegend, hidePercent } = props
  const totSize = data.map((data: IChartData) => data.size).reduce((a, b) => a + b, 0)
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

  const splice: number = Math.random() * colorsBase.length
  const colors: string[] = [...colorsBase.slice(splice), ...colorsBase.slice(0, splice)]

  let s = 0
  const expData: IChartDataExpanded[] = data.map((d, idx) => {
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
        <div className={`ml-[${(size - 1) * 2 + 'px'}]`}>
          <LabelLarge marginLeft={theme.sizing.scale700}>{headerTitle}</LabelLarge>
        </div>
      )}
      <div>
        <Visualization
          data={expData}
          size={size}
          chartTitle={chartTitle}
          leftLegend={!!leftLegend}
          hidePercent={!!hidePercent}
          type={props.type || 'pie'}
        />
      </div>
    </>
  )
}

type TVisualizationProps = {
  data: IChartDataExpanded[]
  size: number
  chartTitle: string
  leftLegend: boolean
  type: TChartType
  hidePercent: boolean
}

const Visualization = (props: TVisualizationProps) => {
  const { size, data, chartTitle, leftLegend, hidePercent } = props
  const [hover, setHover] = useState<number>(-1)
  const [type, toggle] = useReducer((old) => (old === 'bar' ? 'pie' : 'bar'), props.type)

  const noChartData = !data.length || !data.reduce((p, c) => p + c.size, 0)

  return (
    <div className="relative">
      <Button variant="tertiary-neutral" size="xsmall" onClick={toggle}>
        <Tooltip content={type === 'bar' ? 'Kakediagram' : 'Søylediagram'}>
          <FontAwesomeIcon icon={type === 'bar' ? faChartPie : faChartBar} />
        </Tooltip>
      </Button>
      <Card
        overrides={{
          Root: {
            style: hideBorder,
          },
          Action: {},
          Contents: {
            style: { ...marginAll(theme.sizing.scale400) },
          },
          Body: { style: { marginBottom: 0 } },
        }}
        hasThumbnail={(placeHolder: { readonly thumbnail?: string | undefined }) => {
          return !!placeHolder
        }}
      >
        <div onMouseLeave={() => setHover(-1)}>
          <div
            className={`flex items-center ${leftLegend ? 'flex-row-reverse' : 'flex-row'} max-w-fit flex-wrap`}
          >
            {!noChartData && (
              <div>
                {type === 'pie' && (
                  <PieChart data={data} radius={size} hover={hover} setHover={setHover} />
                )}
                {type === 'bar' && (
                  <BarChart data={data} size={size} hover={hover} setHover={setHover} />
                )}
              </div>
            )}
            <div className={`mx-1.5 ${noChartData ? 'mt-2.5' : ''}`}>
              <LabelLarge marginBottom={theme.sizing.scale300}>{chartTitle}</LabelLarge>
              {!noChartData &&
                data.map((data: IChartDataExpanded, index) => (
                  <div
                    key={index}
                    tabIndex={-1}
                    role="button"
                    onFocus={() => setHover(index)}
                    onMouseOver={() => setHover(index)}
                    onClick={data.onClick}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && data.onClick) {
                        data.onClick()
                      }
                    }}
                  >
                    <div
                      className={`${index === hover ? 'bg-[#EFF3FE]' : 'bg-white'} cursor-pointer flex items-center`}
                    >
                      <FontAwesomeIcon icon={faCircle} color={data.color} />
                      <div className="min-w-10 flex justify-end">{data.size}</div>
                      {!hidePercent && (
                        <div className="min-w-10 flex justify-end">
                          {(data.fraction * 100).toFixed(0)}%
                        </div>
                      )}
                      <div className="ml-2.5">{data.label}</div>
                    </div>
                  </div>
                ))}
              {noChartData && <div className="m-1">Ingen</div>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

interface IBarChartProps {
  data: IChartDataExpanded[]
  size: number
  hover: number
  setHover: (i: number) => void
}

const BarChart = (props: IBarChartProps) => {
  const { data, size, hover, setHover } = props
  const max = _.max(data.map((data) => data.sizeFraction))
  const maxVal = _.max(data.map((data) => data.size))

  return (
    <>
      {max && maxVal && (
        <svg
          height={size * 3}
          width={size * 3}
          viewBox="0 0 1150 1150"
          style={{ transform: 'scaleY(-1)' }}
        >
          <style>
            {'text {' + 'transform: scaleY(-1);' + 'font: italic 40px sans-serif;' + '}'}
          </style>
          <path d={'M 0 100 l 1100 0 l 0 -5 l -1100 0 '} fill="black" />
          <path d={'M 100 0 l 0 1100 l -5 0 l 0 -1100 '} fill="black" />

          {_.range(0, 11).map((i) => (
            <Fragment key={i}>
              <g transform={`translate(0 ${105 + i * 100})`}>
                <text>{(maxVal * i * 0.1).toFixed(0)}</text>
              </g>
              <path d={`M 80 ${100 + i * 100} l 1010 0 l 0 -1 l -1010 0 `} fill="black" />
            </Fragment>
          ))}

          {data.map((dataItem: IChartDataExpanded, index: number) => (
            <Bar
              key={index}
              idx={index}
              size={dataItem.sizeFraction * (1 / max)}
              totalSize={data.length}
              start={dataItem.start}
              color={dataItem.color}
              hover={index === hover}
              onMouseOver={() => setHover(index)}
              onClick={dataItem.onClick}
            />
          ))}
        </svg>
      )}
    </>
  )
}

const Bar = (props: TPartProps) => {
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
      <path
        d={dHover}
        fill={hover ? theme.colors.accent100 : 'transparent'}
        fillOpacity={0.5}
        onMouseOver={props.onMouseOver}
      />
      <path d={d} fill={color} onMouseOver={props.onMouseOver} onClick={onClick} style={cursor} />
    </>
  )
}

const PieChart = (props: {
  data: IChartDataExpanded[]
  radius: number
  hover: number
  setHover: (i: number) => void
}) => {
  const { data, radius, hover, setHover } = props

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      viewBox="-1.1 -1.1 2.2 2.2"
      style={{ transform: 'rotate(-90deg)' }}
    >
      {data.map((dataItem: IChartDataExpanded, index: number) => (
        <Wedge
          key={index}
          idx={index}
          size={dataItem.sizeFraction}
          totalSize={data.length}
          start={dataItem.start}
          color={dataItem.color}
          onMouseOver={() => setHover(index)}
          onClick={dataItem.onClick}
          hover={index === hover}
        />
      ))}
    </svg>
  )
}

const pi = 3.1415926
const tau = 2 * pi

type TPartProps = {
  idx: number
  totalSize: number
  size: number
  start: number
  color: string
  hover: boolean
  onMouseOver: () => void
  onClick?: () => void
}

const Wedge = (props: TPartProps) => {
  const { size, start, color, hover, onClick } = props
  const scale = hover ? 1.05 : 1
  const d = `
  M ${Math.cos(start * tau) * scale} ${Math.sin(start * tau) * scale}
  A ${scale} ${scale} 0 ${size >= 0.5 ? 1 : 0} 1 ${Math.cos((start + size) * tau) * scale} ${Math.sin((start + size) * tau) * scale}
  L 0 0
  `
  return (
    <path d={d} fill={color} onMouseOver={props.onMouseOver} onClick={onClick} style={cursor} />
  )
}
