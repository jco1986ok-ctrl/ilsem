export default function MusculoskeletalDiscGuide() {
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
          근골격계 산재,
          <br />
          허리디스크로 인정받는 법
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>
          2026. 07. 18 &nbsp;·&nbsp; 5분 읽기 &nbsp;·&nbsp; 일셈 편집부
        </p>
      </div>

      <p>
        근골격계 질환은 전체 산재 승인 건수의 <strong>60% 이상</strong>을
        차지할 만큼 가장 흔한 산재 유형입니다. 하지만 동시에{' '}
        <strong>가장 많이 불승인되는 유형</strong>이기도 합니다.
      </p>

      <p>
        왜일까요? 허리디스크나 목디스크 같은 근골격계 질환은
        &apos;퇴행성&apos;(나이가 들면서 자연스럽게 생기는 변화)과 구분하기
        어렵기 때문입니다. 공단은 업무 때문인지, 그냥 나이가 들어서 생긴 건지
        판단해야 하죠.
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
          ⚠️ 근골격계 산재의 핵심
        </p>
        <p style={{ fontSize: 14.5, color: '#7f1d1d', margin: 0 }}>
          <strong>
            &quot;업무 때문에 병이 생겼거나, 업무 때문에 기존 질환이 급격히
            악화되었다&quot;
          </strong>
          는 걸 증명하는 것이 전부입니다.
        </p>
      </div>

      <h2 style={h2Style}>산재 인정을 위한 3가지 핵심 조건</h2>

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
          공단이 보는 3가지 기준
        </p>
        <ol
          style={{
            margin: 0,
            padding: '0 0 0 20px',
            fontSize: 14.5,
            color: '#555',
            lineHeight: 2.3,
          }}
        >
          <li>
            <strong>반복성</strong> — 특정 동작을 장기간 반복했는가?
          </li>
          <li>
            <strong>과중성</strong> — 육체적 부담이 상당했는가?
          </li>
          <li>
            <strong>시간적 밀접성</strong> — 증상 발생 시기와 업무 기간이
            겹치는가?
          </li>
        </ol>
      </div>

      <h2 style={h2Style}>반드시 준비해야 할 증거 4가지</h2>

      <div style={{ margin: '24px 0' }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          ① 작업 내용 상세 기록
        </p>
        <p style={{ fontSize: 14.5, color: '#666', margin: '0 0 20px' }}>
          하루 몇 시간, 어떤 자세로, 몇 kg을, 몇 회 반복했는지 구체적으로
          기록하세요. &quot;무거운 물건을 들었다&quot;보다{' '}
          <strong>
            &quot;하루 8시간 동안 20kg 박스를 시간당 30회씩 반복해서
            상차했다&quot;
          </strong>
          가 훨씬 강력합니다.
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          ② MRI 등 영상의학 자료
        </p>
        <p style={{ fontSize: 14.5, color: '#666', margin: '0 0 20px' }}>
          X-ray보다 MRI가 진단 가치가 높습니다. 디스크 탈출 정도, 신경 압박
          여부가 명확히 보여야 합니다.{' '}
          <strong>산재 신청 전에 반드시 MRI를 찍으세요.</strong>
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          ③ 의사 소견서에 &apos;업무관련성&apos; 명시
        </p>
        <p style={{ fontSize: 14.5, color: '#666', margin: '0 0 20px' }}>
          단순히 &apos;추간판탈출증&apos; 진단만으로는 부족합니다. 담당 의사에게{' '}
          <strong>
            &quot;이 환자의 질환은 업무와 상당한 인과관계가 있다고
            판단됩니다&quot;
          </strong>
          라는 문구를 소견서에 넣어달라고 요청하세요.
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          ④ 과거 건강검진 기록
        </p>
        <p style={{ fontSize: 14.5, color: '#666', margin: 0 }}>
          입사 전이나 과거 건강검진에서{' '}
          <strong>허리 관련 이상 소견이 없었다</strong>는 기록이 있으면,
          &apos;원래 아픈 사람&apos;이 아니라는 결정적 증거가 됩니다.
        </p>
      </div>

      <h2 style={h2Style}>근골격계 산재 인정 직종</h2>

      <p>
        공단은 직종별로 근골격계 부담 정도를 평가합니다. 아래 직종들은 비교적
        인정 가능성이 높은 편입니다.
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
        <ul
          style={{
            fontSize: 14.5,
            color: '#555',
            margin: 0,
            paddingLeft: 18,
            lineHeight: 2.3,
          }}
        >
          <li>건설 현장 근로자 (인력 운반, 철근 작업 등)</li>
          <li>택배·물류·창고 근로자 (반복적 중량물 취급)</li>
          <li>요양보호사·간병인 (환자 체위 변경, 이동 보조)</li>
          <li>조리사·주방 보조 (장시간 서서 반복 작업)</li>
          <li>제조업 라인 작업자 (반복 동작·부자연스러운 자세)</li>
          <li>청소·미화원 (장시간 구부정한 자세)</li>
        </ul>
      </div>

      <h2 style={h2Style}>예상 보상금도 미리 확인하세요</h2>

      <p>
        허리디스크 산재가 인정되면 휴업급여, 장해급여, 요양급여를 받을 수
        있습니다. 장해등급은 주로 10~14급 사이에서 결정됩니다.
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
          🚀 허리디스크 산재, 얼마나 받을 수 있을까?
        </p>
        <p
          style={{
            fontSize: 14.5,
            color: 'rgba(255,255,255,0.8)',
            margin: '0 0 20px',
          }}
        >
          일셈 계산기로 1분 만에 예상 보상금 확인하기
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
