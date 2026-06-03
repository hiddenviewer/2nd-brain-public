# 0001 링크 배포 시 회사 데이터 함께 반영

Date: 2026-06-04
Status: Accepted
Scope: public-site

## Context

public site의 `export:links` 스크립트는 위키의 `02-wiki/sources/`와 `02-wiki/companies/`를 읽어 `src/data/links.json`과 `src/data/companies.json`을 함께 생성한다.

하지만 기존 publish 스크립트는 `src/data/links.json`만 커밋 대상으로 추가했다. 이 경우 회사 페이지가 생성되거나 재무 정보가 갱신되어도 `companies.json` 변경이 배포 커밋에 포함되지 않을 수 있었다.

## Decision

`publish:links` 실행 시 `src/data/links.json`과 `src/data/companies.json`을 함께 `git add`한다.

## Rationale

링크 목록과 회사 페이지는 같은 export 단계에서 생성되는 public 데이터다. 특히 Discord의 `d @기업` 명령이나 ingest 후처리로 회사 위키 페이지가 바뀌면 public site의 기업 목록과 기업별 재무 화면도 함께 최신화되어야 한다.

## Consequences

좋아지는 점:

- 회사 페이지 생성/갱신이 public site 데이터에 누락되지 않는다.
- 링크와 회사 데이터의 배포 단위가 일관된다.

감수할 점:

- 링크 변화가 없더라도 회사 데이터만 바뀐 경우 publish 커밋이 생길 수 있다.

## Related

- `scripts/publish-links.mjs`
- 루트 저장소 `docs/decisions/0001-dart-command-company-page-updater.md`

