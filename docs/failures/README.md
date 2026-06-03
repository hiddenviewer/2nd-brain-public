# 실패기록 작성 규칙

public site 실패기록은 같은 표시 오류나 빌드 문제를 반복하지 않기 위한 운영 지식이다.

## 파일명

`NNNN-short-kebab-case-title.md` 형식을 사용한다.

예:

- `0001-company-chart-label-overflow.md`
- `0002-financial-table-mobile-overflow.md`

## 템플릿

```md
# NNNN 제목

Date: YYYY-MM-DD
Status: Learned
Scope: public-site

## What Happened

무슨 문제가 있었는가.

## Impact

사용자 경험, 표시 데이터, 배포에 어떤 영향이 있었는가.

## Root Cause

왜 발생했는가.

## Fix

어떻게 고쳤는가.

## Prevention

다음에 같은 실수를 막기 위한 규칙.

## Related

관련 결정기록, 커밋, 파일, 루트 저장소 문서 링크.
```

