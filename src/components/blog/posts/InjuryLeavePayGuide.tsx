export default function InjuryLeavePayGuide() {
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
          생활비
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
          산재 휴업급여,
          <br />
          얼마나·언제까지 받을 수 있나
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>일셈 편집부</p>
      </div>

      <p>&quot;일을 못 하는 동안 생활비는 어떻게 되나요?&quot;</p>

      <p>
        산재 상담에서 가장 많이 나오는 질문입니다. 치료비는 요양급여로 해결된다고
        쳐도, <strong>치료 기간 동안 들어갈 생활비</strong>가 가장 큰 걱정이죠. 이
        생활비가 바로 <strong>휴업급여</strong>입니다.
      </p>

      <h2 style={h2Style}>휴업급여, 얼마나 받을 수 있나</h2>

      <p>
        휴업급여는 <strong>평균임금의 70%</strong>입니다. 평균임금이 10만 원이라면
        하루에 7만 원을 받는 식입니다.
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
          ⚠️ 단, 최저 보장 금액이 있습니다
        </p>
        <p style={{ fontSize: 14.5, color: '#7f1d1d', margin: 0 }}>
          평균임금이 낮아 70% 계산액이 <strong>최저보상기준금액</strong>(2026년
          기준 1일 약 88,000원)보다 낮으면, 최저보상기준금액이 적용됩니다.
          저임금 근로자도 최소한의 생활은 보장받을 수 있다는 뜻입니다.
        </p>
      </div>

      <h2 style={h2Style}>언제까지 받을 수 있나</h2>

      <p>
        휴업급여는 <strong>요양(치료)이 종료될 때까지</strong> 받을 수 있습니다.
        의사가 &quot;더 이상 치료가 필요하지 않다&quot;(치유 판정)고 할 때까지
        계속됩니다.
      </p>

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
          휴업급여 지급 시점
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
            <strong>시작일</strong>: 요양(치료)으로 인해 취업하지 못한 날부터
          </li>
          <li>
            <strong>종료일</strong>: 의사의 치유 판정일까지 (또는 증상 고정일)
          </li>
          <li>
            <strong>지급 주기</strong>: 매월 1회, 신청한 달의 다음 달에 지급
          </li>
        </ul>
      </div>

      <p>
        예를 들어, 허리디스크로 3개월 요양 판정을 받았다면 그 3개월 동안 매월
        휴업급여를 받을 수 있습니다.
      </p>

      <h2 style={h2Style}>주의: 사업주가 먼저 지급하고 공단에 청구</h2>

      <p>
        휴업급여는 원칙적으로 <strong>사업주가 근로자에게 먼저 지급</strong>한
        후, 공단에 청구하여 돌려받는 구조입니다. 하지만 현실적으로 사업주가 먼저
        지급해주는 경우는 거의 없죠.
      </p>

      <div
        style={{
          background: '#eff6ff',
          borderLeft: '4px solid #3b82f6',
          padding: 24,
          borderRadius: '0 8px 8px 0',
          margin: '24px 0',
        }}
      >
        <p style={{ fontWeight: 700, color: '#2563eb', margin: '0 0 8px' }}>
          💡 사업주가 지급을 거부하면?
        </p>
        <p style={{ fontSize: 14.5, color: '#555', margin: 0 }}>
          근로자가 직접 공단에 <strong>&apos;휴업급여 직접 지급 청구서&apos;</strong>
          를 제출하면 됩니다. 사업주를 거치지 않고 공단이 근로자에게 직접
          지급합니다.
        </p>
      </div>

      <h2 style={h2Style}>휴업급여와 다른 소득의 관계</h2>

      <p>
        휴업급여를 받는 동안 <strong>다른 일을 해서 소득이 발생하면 휴업급여가
        감액</strong>
        될 수 있습니다. 요양에 전념하고 있다는 게 전제이기 때문입니다. 단,
        사업주가 지급하는 병가 급여나 위로금은 휴업급여와 별개로 받을 수
        있습니다.
      </p>

      <h2 style={h2Style}>내 예상 휴업급여 계산하기</h2>

      <p>
        휴업급여는 평균임금만 알면 간단히 계산할 수 있습니다. 하지만 평균임금
        산정에서 실수가 많기 때문에 계산기로 확인하는 게 가장 정확합니다.
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
          🚀 내 휴업급여, 얼마일까?
        </p>
        <p
          style={{
            fontSize: 14.5,
            color: 'rgba(255,255,255,0.8)',
            margin: '0 0 20px',
          }}
        >
          일셈 계산기로 1분 만에 확인하기
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
