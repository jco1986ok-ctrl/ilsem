export default function CardioOverworkGuide() {
  const h2Style = {
    fontSize: 24,
    fontWeight: 800,
    margin: '50px 0 20px',
    letterSpacing: -0.8,
    paddingBottom: 8,
    borderBottom: '2px solid #1a1a1a',
    display: 'inline-block' as const,
  };

  const checkItem = {
    padding: '10px 0 10px 30px',
    position: 'relative' as const,
    fontSize: 15,
    color: '#334155',
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
          질환별 가이드
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
          뇌심혈관 산재,
          <br />
          과로 입증하는 결정적 증거 3가지
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>일셈 편집부</p>
      </div>

      <p>
        뇌출혈, 심근경색, 뇌경색 같은 뇌심혈관 질환은{' '}
        <strong>골든타임이 생명을 좌우하는 응급 질환</strong>입니다. 살아남더라도
        심각한 후유장해가 남는 경우가 많죠. 그런데 이 질환들은 근골격계 질환보다{' '}
        <strong>산재 인정이 훨씬 까다롭습니다.</strong>
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
          ⚠️ 뇌심혈관 산재의 현실
        </p>
        <p style={{ fontSize: 14.5, color: '#7f1d1d', margin: 0 }}>
          1차 신청에서 불승인되는 비율이 매우 높습니다. 하지만{' '}
          <strong>
            제대로 된 증거를 갖춰 재심사까지 가면 승인율이 크게 올라갑니다
          </strong>
          . 처음부터 증거를 철저히 준비하는 게 핵심입니다.
        </p>
      </div>

      <h2 style={h2Style}>공단이 보는 과로 인정 기준</h2>

      <p>
        근로복지공단은 뇌심혈관 질환의 업무관련성을 판단할 때{' '}
        <strong>&apos;과로 기준&apos;</strong>을 적용합니다.
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
          과로 인정 3가지 기준
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
            <strong>단기 과로</strong>: 발병 전 1주일 이내 업무량·시간이
            일상보다 30% 이상 증가
          </li>
          <li>
            <strong>만성 과로</strong>: 발병 전 3개월 이상 지속적으로 과중한
            업무 (주 60시간 이상)
          </li>
          <li>
            <strong>특별한 스트레스</strong>: 발병 직전 극심한 정신적 스트레스
            상황 발생
          </li>
        </ul>
      </div>

      <h2 style={h2Style}>결정적 증거 ①: 근무시간 기록</h2>

      <p>
        뇌심혈관 산재에서 <strong>가장 강력한 증거는 근무시간</strong>입니다.
        출퇴근 기록, 업무용 PC 로그, 이메일 발송 시간, 카톡·문자 업무 지시 시간
        등이 모두 증거가 됩니다.
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
          💡 사업주가 근무기록을 숨기면?
        </p>
        <p style={{ fontSize: 14.5, color: '#555', margin: 0 }}>
          사업장 CCTV, 경비업체 출입 기록, 동료 증언으로 대체 가능합니다.{' '}
          <strong>발병 전 1주일, 4주일, 12주일의 근무 패턴</strong>을 각각
          정리해서 제출하세요.
        </p>
      </div>

      <h2 style={h2Style}>결정적 증거 ②: 업무 내용 및 강도 입증</h2>

      <p>
        단순히 &apos;오래 일했다&apos;보다{' '}
        <strong>어떤 강도의 일을 했는지</strong>가 중요합니다.
      </p>

      <div style={{ margin: '24px 0' }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>수집해야 할 자료</p>
        <ul
          style={{
            paddingLeft: 20,
            fontSize: 14.5,
            color: '#666',
            margin: 0,
            lineHeight: 2.2,
          }}
        >
          <li>업무일지, 작업보고서, 프로젝트 일정표</li>
          <li>야간·휴일 근무를 입증할 수 있는 메신저 대화</li>
          <li>업무량 폭증을 보여주는 생산량·처리 건수 데이터</li>
          <li>인력 부족 상황을 입증할 조직도·인사 발령 기록</li>
          <li>
            특별히 스트레스가 컸던 사건(사고·클레임·감사·인사 불이익 등)의
            정황
          </li>
        </ul>
      </div>

      <h2 style={h2Style}>결정적 증거 ③: 기존 건강 상태와의 대비</h2>

      <p>
        공단이 가장 많이 사용하는 불승인 사유가{' '}
        <strong>&quot;기존 지병(고혈압·당뇨 등) 때문에 발병한 것&quot;</strong>
        입니다. 이에 대비하려면:
      </p>

      <div style={{ background: '#f8f8f8', padding: '28px 32px', margin: '32px 0' }}>
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
            과거 건강검진 기록 — 기존 질환이 <strong>관리되고 있었음</strong>을
            증명
          </li>
          <li>약물 복용 이력 — 정상적으로 치료 중이었음</li>
          <li>
            주치의 소견서 — &quot;기존 질환만으로는 이 정도 발병이 설명되지
            않으며, <strong>과로가 직접적 원인</strong>&quot;이라는 의학적 소견
          </li>
        </ul>
      </div>

      <p>
        기존 질환이 있더라도{' '}
        <strong>
          &quot;업무상 과로가 기존 질환을 급격히 악화시켰다&quot;
        </strong>
        는 논리로 산재 인정을 받을 수 있습니다.
      </p>

      <h2 style={h2Style}>가족이 할 수 있는 일</h2>

      <p>
        뇌심혈관 질환은 환자 본인이 의식 불명이거나 사망한 경우가 많아,{' '}
        <strong>가족이 직접 증거를 수집해야 합니다</strong>.
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
        <li style={checkItem}>
          ☐ 환자의 휴대폰에서 업무 관련 카톡·문자·통화 기록 확보
        </li>
        <li style={checkItem}>
          ☐ 회사 동료들에게 업무 강도·근무시간에 대한 진술 요청
        </li>
        <li style={checkItem}>☐ 발병 당시 상황을 목격한 사람의 진술 확보</li>
        <li style={checkItem}>
          ☐ 사업장 출입 기록·CCTV 열람 요청 (거부 시 경찰·노동청 협조 요청)
        </li>
      </ul>

      <h2 style={h2Style}>뇌심혈관 산재, 보상금은 얼마나 될까</h2>

      <p>
        뇌심혈관 질환은 장해등급이 1~3급으로 높게 나오는 경우가 많아 보상금도
        상당합니다. 사망 시 유족급여도 지급됩니다. 일셈 계산기로 미리 예상
        금액을 확인해보세요.
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
          🚀 뇌심혈관 산재, 예상 보상금 확인하기
        </p>
        <p
          style={{
            fontSize: 14.5,
            color: 'rgba(255,255,255,0.8)',
            margin: '0 0 20px',
          }}
        >
          일셈 계산기로 1분 만에 계산
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
