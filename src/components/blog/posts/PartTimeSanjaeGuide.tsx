export default function PartTimeSanjaeGuide() {
  const h2Style = {
    fontSize: 24,
    fontWeight: 800,
    margin: '50px 0 20px',
    letterSpacing: -0.8,
    paddingBottom: 8,
    borderBottom: '2px solid #1a1a1a',
    display: 'inline-block' as const,
  };

  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        fontFamily: "'Pretendard','Noto Sans KR',sans-serif",
        color: '#1a1a1a',
        lineHeight: 1.9,
        fontSize: 16,
      }}
    >
      <div style={{ padding: '60px 0 36px', textAlign: 'center' }}>
        <p
          style={{
            fontSize: 12,
            color: '#999',
            letterSpacing: 3,
            marginBottom: 20,
          }}
        >
          취약계층
        </p>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 900,
            lineHeight: 1.3,
            letterSpacing: -1.5,
            margin: '0 0 10px',
          }}
        >
          알바·일용직도
          <br />
          산재보상 받을 수 있을까?
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>
          4분 읽기 &nbsp;·&nbsp; 일셈 편집부
        </p>
      </div>

      <p
        style={{
          fontSize: 20,
          fontWeight: 700,
          textAlign: 'center',
          padding: '40px 20px',
          margin: '36px 0',
          background: '#f0f4ff',
          borderRadius: 8,
        }}
      >
        &quot;알바라서 안 될 줄 알았는데
        <br />
        산재보상 받을 수 있다고요?&quot;
      </p>

      <p>
        네, 받을 수 있습니다. 정규직이든, 계약직이든, 아르바이트든, 일용직이든{' '}
        <strong>근로자라면 누구나 산재보상 대상</strong>입니다. 산재보험은 고용
        형태가 아니라 <strong>&apos;근로자&apos;라는 사실 하나만으로 적용</strong>
        됩니다.
      </p>

      <div
        style={{
          background: '#fef2f2',
          borderLeft: '4px solid #ef4444',
          padding: 24,
          borderRadius: '0 8px 8px 0',
          margin: '32px 0',
        }}
      >
        <p style={{ fontWeight: 700, color: '#dc2626', margin: '0 0 8px' }}>
          ⚠️ 사업주가 보험료를 안 냈다고요?
        </p>
        <p style={{ fontSize: 14.5, color: '#7f1d1d', margin: 0 }}>
          사업주가 산재보험에 가입하지 않았거나, 보험료를 체납했더라도{' '}
          <strong>
            근로자의 산재보상 청구 권리는 전혀 영향을 받지 않습니다.
          </strong>{' '}
          공단이 사업주에게 별도로 추징할 뿐입니다.
        </p>
      </div>

      <h2 style={h2Style}>알바·일용직 산재, 이것만 알면 됩니다</h2>

      <div style={{ background: '#f8f8f8', padding: '28px 32px', margin: '32px 0' }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: '#888',
            letterSpacing: 1,
            margin: '0 0 16px',
          }}
        >
          알바·일용직 산재 핵심 정리
        </p>
        <ul
          style={{
            margin: 0,
            padding: '0 0 0 18px',
            fontSize: 14.5,
            color: '#555',
            lineHeight: 2.3,
          }}
        >
          <li>
            <strong>적용 대상</strong>: 1인 이상 모든 사업장의 근로자 (주 15시간
            미만도 포함)
          </li>
          <li>
            <strong>보상 범위</strong>: 정규직과 완전히 동일
            (요양·휴업·장해·유족·간병급여 전부)
          </li>
          <li>
            <strong>평균임금</strong>: 일용직은 고용노동부가 고시하는 직종별
            평균임금 적용 가능
          </li>
          <li>
            <strong>신청 방법</strong>: 정규직과 동일한 절차 (요양급여신청서 +
            소견서 + 증빙자료)
          </li>
        </ul>
      </div>

      <h2 style={h2Style}>알바·일용직이라서 오히려 유리한 점</h2>

      <p>
        의외로 알바나 일용직은 <strong>오히려 더 유리한 부분</strong>도 있습니다.
      </p>

      <div style={{ margin: '24px 0' }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>① 평균임금이 낮으면?</p>
        <p style={{ fontSize: 14.5, color: '#666', margin: '0 0 20px' }}>
          평균임금이 최저보상기준금액보다 낮으면,{' '}
          <strong>최저보상기준금액</strong>을 적용받아 더 받을 수 있습니다.
          2026년 기준 1일 약 88,000원입니다.
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          ② 근무 기간이 짧으면?
        </p>
        <p style={{ fontSize: 14.5, color: '#666', margin: '0 0 20px' }}>
          근속 기간이 짧아 평균임금 산정이 어려우면{' '}
          <strong>통상근로계수</strong>를 적용하거나, 같은 직종 근로자의
          평균임금을 기준으로 삼을 수 있습니다.
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>③ 계약서가 없으면?</p>
        <p style={{ fontSize: 14.5, color: '#666', margin: 0 }}>
          근로계약서가 없어도 산재 신청은 가능합니다. 통장 입금 내역, 사업주와의
          대화 내역, 근무 사진 등으로 근로 사실만 입증하면 됩니다.
        </p>
      </div>

      <h2 style={h2Style}>실제 사례</h2>

      <div
        style={{
          background: '#eff6ff',
          borderLeft: '4px solid #3b82f6',
          padding: 24,
          borderRadius: '0 8px 8px 0',
          margin: '24px 0',
        }}
      >
        <p style={{ fontWeight: 700, color: '#2563eb', margin: '0 0 12px' }}>
          사례: 편의점 알바생
        </p>
        <p style={{ fontSize: 14.5, color: '#555', margin: 0 }}>
          주 15시간 근무하던 편의점 알바생이 야간 근무 중 강도에게 폭행당해
          부상을 입었습니다. 사업주는 &quot;알바니까 산재 해당 안 된다&quot;고
          했지만, 공단은 <strong>업무상 재해로 인정</strong>하고 요양급여와
          휴업급여를 지급했습니다.
        </p>
      </div>

      <div
        style={{
          background: '#eff6ff',
          borderLeft: '4px solid #3b82f6',
          padding: 24,
          borderRadius: '0 8px 8px 0',
          margin: '24px 0',
        }}
      >
        <p style={{ fontWeight: 700, color: '#2563eb', margin: '0 0 12px' }}>
          사례: 건설 일용직
        </p>
        <p style={{ fontSize: 14.5, color: '#555', margin: 0 }}>
          현장에 나온 지 이틀 만에 추락사고를 당한 건설 일용직 노동자. 근무
          기간이 짧아 평균임금 산정이 어려웠지만,{' '}
          <strong>건설업 직종별 평균임금</strong>을 적용받아 정당한 보상을
          받았습니다.
        </p>
      </div>

      <h2 style={h2Style}>알바·일용직 산재, 지금 바로 알아보세요</h2>

      <p>
        고용 형태 때문에 산재 신청을 망설이지 마세요. 산재보상은{' '}
        <strong>모든 근로자의 당연한 권리</strong>입니다.
      </p>

      <div
        style={{
          textAlign: 'center',
          background: '#1e3a5f',
          borderRadius: 12,
          padding: '32px 24px',
          margin: '40px 0',
          color: '#fff',
        }}
      >
        <p style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>
          🚀 알바·일용직도 산재보상 받을 수 있습니다
        </p>
        <p
          style={{
            fontSize: 14.5,
            color: 'rgba(255,255,255,0.8)',
            margin: '0 0 20px',
          }}
        >
          일셈 계산기로 예상 보상금을 먼저 확인해보세요
        </p>
        <a
          href="https://ilsem.vercel.app"
          style={{
            display: 'inline-block',
            background: '#fff',
            color: '#1e3a5f',
            fontWeight: 700,
            fontSize: 15,
            padding: '14px 36px',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          일셈 계산기 바로가기
        </a>
      </div>

      <div
        style={{
          textAlign: 'center',
          color: '#bbb',
          fontSize: 12,
          padding: '40px 0 20px',
          borderTop: '1px solid #eee',
          marginTop: 40,
        }}
      >
        ⓒ 2026 일셈(ilsem) &nbsp;·&nbsp; 본 글은 정보 제공 목적이며 법률 자문을
        대신하지 않습니다.
      </div>
    </div>
  );
}
