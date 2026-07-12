import links from '../src/data/links.json' with { type: 'json' }

const needsRepair = (link) => {
  const tags = link.tags || []
  const source = `${link.title || ''} ${link.sourceNote || ''}`.toLowerCase()
  return (
    link.status === 'dead' ||
    link.captureRepair?.status === 'manual_review' ||
    tags.includes('inaccessible') ||
    source.includes('inaccessible') ||
    source.includes('접근 불가')
  )
}

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

const rows = links
  .filter(needsRepair)
  .sort((a, b) => (b.updated || '').localeCompare(a.updated || ''))
  .map((link) => ({
    updated: link.updated || '-',
    status: link.status || '-',
    reason: link.captureRepair?.reason || 'legacy',
    retry: link.captureRepair?.retry_result || '-',
    domain: getDomain(link.url),
    sourceNote: link.sourceNote || '-',
    title: link.title || '-',
    url: link.url,
  }))

if (rows.length === 0) {
  console.log('접근 불가·보강 필요 링크가 없습니다.')
  process.exit(0)
}

console.log(`접근 불가·보강 필요 링크: ${rows.length}개\n`)
console.table(
  rows.map((row, index) => ({
    '#': index + 1,
    updated: row.updated,
    status: row.status,
    reason: row.reason,
    retry: row.retry,
    domain: row.domain,
    sourceNote: row.sourceNote,
    title: row.title.slice(0, 60),
  })),
)
console.log('\n수동 확인 URL:')
for (const row of rows) {
  console.log(`- ${row.sourceNote}: ${row.url}`)
}
