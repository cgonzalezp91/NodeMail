'use strict'

const defaults = require('lodash/fp/defaults')
const forEach = require('lodash/fp/foreach')
const pretty = require('pretty')

const DEFAULT_CONFIG = {
  tidy: true,
  headers: null,
  border: null
}

module.exports = (data, config) => {
  if (!Array.isArray(data)) throw new Error('html-tableify: Data must be array of object.')
  config = defaults(config || {}, DEFAULT_CONFIG)
  if (!config.headers) {
    let headers = []
    forEach(data[0] || {}, (value, key) => headers.push({
      name: key
    }))
    config.headers = headers
  }
  let $heads = config.headers.map(hd => `<th style="border-color:#5c87b2; border-style:solid; border-width:thin; padding: 5px;">${hd.title || capitalize(hd.name)}</th>`)
  let $header = `<tr style="background-color:AliceBlue;">${$heads.join('')}</tr>`
  let $rows = data.map(rowData => {
    let $tds = config.headers.map(hd => `<td style=" border-color:#5c87b2; border-style:solid; border-width:thin; padding: 5px;">${rowData[hd.name] || ''}</td>`)
    return `<tr style="color:#555555;">${$tds.join('')}</tr>`
  })
  let $body = `${$rows.join('')}`
  let $metadata = '<meta http-equiv="Content-Type" content="text/html; charset=us-ascii">'
  let $table = `<table width="400" style="border-collapse:collapse; text-align:center; font-size: 12px;">`
  let rst = `${$metadata}${$table}${$header}${$body}</table>`
  return config.tidy ? pretty(rst) : rst
}
