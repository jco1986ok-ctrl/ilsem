export default function SanjaeDocuments5() {
  const h2Style = {
    fontSize: 24,
    fontWeight: 800,
    margin: '50px 0 20px',
    letterSpacing: -0.8,
    paddingBottom: 8,
    borderBottom: '2px solid #1a1a1a',
    display: 'inline-block' as const,
  };

  const checkItemStyle = {
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
          실전 준비
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
          산재 신청 서류,
          <br />
          이 5가지만 챙기면 끝
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>
          4분 읽기 &nbsp;·&nbsp; 일셈 편집부
        </p>
      </div>

      <p>&quot;서류가 너무 많아서 못 하겠어요.&quot;</p>

      <p>
        산재 상담을 하다 보면 가장 많이 듣는 말입니다. 실제로 근로복지공단
        홈페이지에 들어가면 수십 가지 서식이 나열되어 있어서, 어디서부터
        시작해야 할지 막막하죠.
      </p>

      <p>
        하지만 <strong>진짜 필요한 건 딱 5가지</strong>입니다. 이 5가지만
        제대로 챙기면 산재 신청, 생각보다 어렵지 않습니다.
      </p>

      <h2 style={h2Style}>준비물 1: 요양급여신청서</h2>

      <p>
        산재 신청의 첫 관문이자 <strong>가장 기본이 되는 서류</strong>
        입니다.
      </p>

      <div
        style={{
          background: '#eff6ff',
          borderLeft: '4px solid #3b82f6',
          padding: '20px 22px',
          borderRadius: '0 8px 8px 0',
          margin: '24px 0',
        }}
      >
        <p style={{ fontWeight: 700, color: '#2563eb', margin: '0 0 8px' }}>
          💡 작성 팁
        </p>
        <ul
          style={{
            fontSize: 14.5,
            color: '#555',
            margin: 0,
            paddingLeft: 18,
          }}
        >
          <li>
            재해 발생 경위는 <strong>구체적으로</strong> (언제, 어디서, 무엇을
            하다가, 어떻게 다쳤는지)
          </li>
          <li>목격자가 있다면 반드시 기재</li>
          <li>
            사업주 날인은 거부 시 &apos;사업주 날인 거부 사유서&apos; 별도 제출
            가능
          </li>
        </ul>
      </div>

      <p>
        근로복지공단 지사 방문 시 직접 작성하거나, 공단 홈페이지에서 다운로드해
        미리 작성해 가면 훨씬 수월합니다.
      </p>

      <h2 style={h2Style}>준비물 2: 의사 소견서 (진단서)</h2>

      <p>
        병원에서 발급받는 <strong>의학적 근거</strong>입니다. 이 서류 하나로
        산재 승인 여부가 크게 갈립니다.
      </p>

      <div
        style={{
          background: '#fef2f2',
          borderLeft: '4px solid #ef4444',
          padding: '20px 22px',
          borderRadius: '0 8px 8px 0',
          margin: '24px 0',
        }}
      >
        <p style={{ fontWeight: 700, color: '#dc2626', margin: '0 0 8px' }}>
          ⚠️ 반드시 확인하세요
        </p>
        <p style={{ fontSize: 14.5, color: '#7f1d1d', margin: 0 }}>
          소견서에 <strong>&apos;업무와 관련된 상병으로 판단됨&apos;</strong>{' '}
          또는 <strong>&apos;업무관련성 있음&apos;</strong>이라는 문구가 반드시
          포함되어야 합니다. 단순 진단명만 적힌 일반 진단서로는 부족합니다.
        </p>
      </div>

      <p>
        담당 의사에게 &quot;산재 신청용 소견서&quot;라고 정확히 말씀하세요. 일반
        진단서와 서식이 다릅니다.
      </p>

      <h2 style={h2Style}>준비물 3: 임금 증빙 자료</h2>

      <p>
        평균임금 산정의 근거가 되는 자료입니다. 보상금 액수를 좌우하는 핵심
        서류입니다.
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
          임금 증빙으로 인정되는 것들
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
          <li>급여명세서 (최근 3개월)</li>
          <li>급여 통장 입금 내역</li>
          <li>근로계약서 (임금 항목 기재된 것)</li>
          <li>사업주가 발급한 재직증명서</li>
        </ul>
      </div>

      <p>
        사업주가 급여명세서 발급을 거부하면, 통장 입금 내역만으로도 증빙이
        가능합니다. 고용노동부에 진정을 넣으면 사업주가 발급하도록 강제할 수도
        있습니다.
      </p>

      <h2 style={h2Style}>준비물 4: 사업주 확인서 (또는 거부사유서)</h2>

      <p>
        사업주가 산재를 인정하고 서명해주면 가장 수월하지만, 현실은 그렇지 않은
        경우가 더 많습니다.
      </p>

      <p>
        사업주가 서명을 거부하더라도 걱정하지 마세요.{' '}
        <strong>사업주 날인 없이도 산재 신청은 가능</strong>합니다. 대신
        &apos;사업주 확인 거부 사유서&apos;를 함께 제출하면 됩니다.
      </p>

      <p>
        사업주에게 산재 신청 사실을 통보한 카톡, 문자, 녹취록은 반드시
        보관해두세요. 추후 분쟁 시 중요한 증거가 됩니다.
      </p>

      <h2 style={h2Style}>준비물 5: 업무관련성 입증 자료</h2>

      <p>
        특히 <strong>근골격계 질환, 뇌심혈관 질환</strong>은 &apos;업무 때문에
        생긴 병&apos;이라는 걸 본인이 증명해야 합니다.
      </p>

      <div
        style={{
          background: '#f0f4ff',
          padding: 24,
          borderRadius: 8,
          margin: '24px 0',
        }}
      >
        <p style={{ fontWeight: 700, color: '#2563eb', margin: '0 0 12px' }}>
          ✅ 챙겨두면 도움 되는 자료
        </p>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 14.5,
            color: '#555',
            lineHeight: 2.2,
          }}
        >
          <li>근무시간 기록 (출퇴근 카드, 근태 기록)</li>
          <li>작업 일지, 업무 보고서</li>
          <li>동료 목격자 진술서</li>
          <li>사업주와 나눈 카톡·문자·녹취</li>
          <li>현장 사진, CCTV 영상</li>
        </ul>
      </div>

      <h2 style={h2Style}>서류 준비 체크리스트</h2>

      <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
        <li style={checkItemStyle}>
          ☐ 요양급여신청서 (공단 방문 또는 다운로드)
        </li>
        <li style={checkItemStyle}>
          ☐ 의사 소견서 (업무관련성 명시 필수)
        </li>
        <li style={checkItemStyle}>
          ☐ 급여명세서 또는 입금 내역 (최근 3개월)
        </li>
        <li style={checkItemStyle}>
          ☐ 사업주 확인서 (거부 시 거부사유서)
        </li>
        <li style={checkItemStyle}>
          ☐ 업무관련성 입증 자료 (작업일지, 진술서, 사진)
        </li>
      </ul>

      <h2 style={h2Style}>신청 전, 내 보상금부터 확인하세요</h2>

      <p>
        서류 준비와 함께 <strong>내가 받을 수 있는 보상금이 얼마인지</strong>{' '}
        미리 아는 것도 중요합니다. 그래야 공단의 결정이 적정한지 판단할 수
        있습니다.
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
          🚀 예상 보상금, 1분 만에 확인하기
        </p>
        <p
          style={{
            fontSize: 14.5,
            color: 'rgba(255,255,255,0.8)',
            margin: '0 0 20px',
          }}
        >
          회원가입 없이 바로 계산 · 모든 데이터는 내 기기에만 저장
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
