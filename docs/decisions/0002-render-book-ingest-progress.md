# 0002 Book ingest 결과를 목차 중심 학습 페이지로 표시

Date: 2026-07-12
Status: Accepted
Scope: public-site

## Context

Book ingest는 책 전체 목차를 먼저 저장하고 장별 상세 요약을 작은 배치로 보강한다. 따라서 public site는 완성된 문서만 표시하는 방식보다, 완료·대기·실패 장을 한 화면에서 구분하고 진행률을 보여줄 필요가 있다.

## Decision

- `scripts/export-links.mjs`가 `02-wiki/books/*/book-state.json`을 `src/data/books.json`으로 내보낸다.
- `/books/`에 책 목록과 상세 요약 진행률을 표시한다.
- `/books/<id>/`는 왼쪽에 책 전용 목차, 오른쪽에 책 개요와 장별 내용을 배치한다.
- 완료된 장은 상세 내용을 표시하고, 대기·실패 장은 현재 상태와 원문 링크를 표시한다.
- 데스크톱에서는 목차를 sticky로 유지하고 모바일에서는 제한 높이 목록으로 전환한다.

## Rationale

긴 책은 순차 처리 중에도 학습 가치가 있다. 목차와 진행 상태를 함께 보여주면 사용자는 현재 읽을 수 있는 장과 아직 처리되지 않은 장을 구분하고, 필요한 장의 원문으로 이동할 수 있다.

## Consequences

좋아지는 점:

- 책 전체 구조와 처리 진행률을 한눈에 볼 수 있다.
- 장별 상세 요약이 추가될 때 같은 페이지가 점진적으로 성장한다.
- 긴 본문에서도 책 목차를 잃지 않고 이동할 수 있다.

감수할 점:

- `books.json`이 새로운 public 생성 데이터로 관리된다.
- 대기 장이 많은 초기 페이지에는 상태 안내가 본문보다 많을 수 있다.

## Related

- `scripts/export-links.mjs`
- `src/pages/books/index.astro`
- `src/pages/books/[book].astro`
- 루트 저장소 `docs/decisions/0002-wikidocs-book-ingest-batching.md`

