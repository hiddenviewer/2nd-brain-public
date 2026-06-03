import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

const repoRoot = new URL('../', import.meta.url)
const vaultRoot = new URL('../../', repoRoot)
const sourceDir = new URL('02-wiki/sources/', vaultRoot)
const inboxDir = new URL('00-inbox/', vaultRoot)
const companyDir = new URL('02-wiki/companies/', vaultRoot)
const outputPath = new URL('src/data/links.json', repoRoot)

const domainToCategory = {
  'ai-agents': 'ai',
  apple: 'apple',
  ios: 'apple',
  'kr-stocks': 'investing',
  'cross-domain': 'general',
}

const categoryLabels = {
  ai: 'AI 에이전트',
  apple: 'Apple',
  investing: '한국 주식',
  language: '언어',
  travel: '여행',
  general: '기타',
}

const urlPattern = /https?:\/\/[^\s`"'<>)]*/g

function readFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const data = {}
  for (const line of match[1].split('\n')) {
    const pair = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/)
    if (!pair) continue

    const [, key, rawValue] = pair
    const value = rawValue.trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    } else {
      data[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }
  return data
}

function cleanUrl(url) {
  return url.replace(/[.,;:!?，。]+$/g, '')
}

function shouldSkipUrl(url) {
  return url.includes('discord.com/channels/')
}

function inferInboxCategory(metadata) {
  const haystack = [
    metadata.title,
    metadata.summary,
    metadata.body,
    metadata.link_type,
  ].filter(Boolean).join(' ').toLowerCase()

  if (/(apple|ios|iphone|mac|wwdc|swift|xcode)/i.test(haystack)) return 'apple'
  if (/(주식|투자|증권|kospi|kosdaq|공시|실적|반도체|배터리|환율|금리)/i.test(haystack)) return 'investing'
  if (/(영어|english|일본어|japanese|日本語)/i.test(haystack)) return 'language'
  if (/(여행|travel|hotel|flight|항공|숙소)/i.test(haystack)) return 'travel'
  if (/(ai|llm|agent|에이전트|claude|codex|gemini|mcp|harness|프롬프트)/i.test(haystack)) return 'ai'
  return 'general'
}

function inferStatus(fileName, frontmatter) {
  const text = `${fileName} ${(frontmatter.title || '')} ${(frontmatter.tags || []).join(' ')}`
  if (/inaccessible|접근 불가|확인 불가/i.test(text)) return 'review'
  return 'public'
}

function inferDescription(markdown) {
  const overview = markdown.match(/## 자료 개요\n\n([\s\S]*?)(?:\n\n## |\n## |$)/)
  if (!overview) return ''
  return overview[1]
    .replace(/\s+/g, ' ')
    .replace(/`/g, '')
    .trim()
    .slice(0, 220)
}

function normalizeText(value) {
  return String(value || '')
    .replace(urlPattern, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

async function loadCompanyCatalog() {
  let files = []
  try {
    files = (await readdir(companyDir))
      .filter((file) => file.endsWith('.md'))
      .sort()
  } catch {
    return []
  }

  const companies = []
  for (const file of files) {
    const id = basename(file, '.md')
    const markdown = await readFile(join(companyDir.pathname, file), 'utf8')
    const frontmatter = readFrontmatter(markdown)
    const label = frontmatter.title || id
    const aliases = [
      id,
      label,
      frontmatter.ticker,
      ...(Array.isArray(frontmatter.aliases) ? frontmatter.aliases : []),
    ].filter(Boolean)

    companies.push({
      id,
      label,
      ticker: frontmatter.ticker || '',
      sector: frontmatter.sector || '',
      sources: Array.isArray(frontmatter.sources) ? frontmatter.sources : [],
      aliases: [...new Set(aliases.map((alias) => String(alias).trim()).filter(Boolean))],
    })
  }
  return companies
}

function detectCompanies({ sourceId = '', frontmatter = {}, markdown = '', metadata = {}, companies = [] }) {
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : []
  const sourceRefs = Array.isArray(frontmatter.sources) ? frontmatter.sources : []
  const matchText = normalizeText([
    sourceId,
    frontmatter.title,
    tags.join(' '),
    metadata.title,
    metadata.summary,
    metadata.body,
  ].filter(Boolean).join(' '))

  const detected = companies.filter((company) => {
    if (company.sources.includes(sourceId)) return true
    if (sourceRefs.some((source) => company.sources.includes(source))) return true
    if (tags.includes(company.id)) return true
    if (markdown.includes(`[[${company.id}`)) return true
    return company.aliases.some((alias) => {
      const normalized = normalizeText(alias)
      return normalized.length >= 2 && matchText.includes(normalized)
    })
  })

  return detected.map(({ id, label, ticker, sector }) => ({ id, label, ticker, sector }))
}

async function main() {
  const companies = await loadCompanyCatalog()
  const sourceFiles = (await readdir(sourceDir))
    .filter((file) => file.endsWith('.md'))
    .sort()

  const linksByUrl = new Map()

  for (const file of sourceFiles) {
    const filePath = join(sourceDir.pathname, file)
    const markdown = await readFile(filePath, 'utf8')
    const frontmatter = readFrontmatter(markdown)
    const urls = [...new Set((markdown.match(urlPattern) || []).map(cleanUrl))]
      .filter((url) => !shouldSkipUrl(url))

    if (urls.length === 0) continue

    const sourceId = basename(file, '.md')
    const category = domainToCategory[frontmatter.domain] || 'general'
    const status = inferStatus(file, frontmatter)
    const detectedCompanies = detectCompanies({ sourceId, frontmatter, markdown, companies })

    for (const url of urls) {
      linksByUrl.set(url, {
        title: frontmatter.title || sourceId,
        url,
        category,
        categoryLabel: categoryLabels[category] || category,
        status,
        updated: frontmatter.updated || '',
        sourceNote: sourceId,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.filter((tag) => tag !== 'source') : [],
        description: inferDescription(markdown),
        companies: detectedCompanies,
      })
    }
  }

  let inboxFiles = []
  try {
    inboxFiles = (await readdir(inboxDir))
      .filter((file) => file.endsWith('.metadata.json'))
      .sort()
  } catch {
    inboxFiles = []
  }

  for (const file of inboxFiles) {
    const filePath = join(inboxDir.pathname, file)
    const metadata = JSON.parse(await readFile(filePath, 'utf8'))
    const url = cleanUrl(metadata.source_url || '')
    if (!url || shouldSkipUrl(url) || linksByUrl.has(url)) continue

    const category = inferInboxCategory(metadata)
    const sourceNote = basename(file, '.metadata.json')
    const detectedCompanies = detectCompanies({ sourceId: sourceNote, metadata, companies })
    linksByUrl.set(url, {
      title: metadata.title || sourceNote,
      url,
      category,
      categoryLabel: categoryLabels[category] || category,
      status: 'pending',
      updated: (metadata.captured_at || '').slice(0, 10),
      sourceNote,
      tags: ['inbox', metadata.link_type].filter(Boolean),
      description: metadata.summary || '',
      companies: detectedCompanies,
    })
  }

  const links = Array.from(linksByUrl.values())

  links.sort((a, b) => {
    const byCategory = a.category.localeCompare(b.category)
    if (byCategory !== 0) return byCategory
    return a.title.localeCompare(b.title, 'ko')
  })

  await mkdir(new URL('src/data/', repoRoot), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(links, null, 2)}\n`)
  console.log(`Exported ${links.length} links to ${outputPath.pathname}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
