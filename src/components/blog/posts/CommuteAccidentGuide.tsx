export default function CommuteAccidentGuide() {
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

  const thBase = {
    borderBottom: '2px solid #1a1a1a',
    padding: '10px 8px',
    fontSize: 13,
    color: '#888',
    textAlign: 'left' as const,
    width: '50%',
  };

  const tdCell = {
    padding: '10px 8px',
    borderBottom: '1px solid #eee',
    fontSize: 13.5,
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
          사고 유형
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
          출퇴근 사고,
          <br />
          이제 산재 인정될까?
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>일셈 편집부</p>
      </div>

      <p>
        2018년 이전까지 출퇴근 중 사고는 산재로 인정되지 않았습니다. 하지만{' '}
        <strong>2018년 1월 1일부터 산재보험법 개정</strong>으로 출퇴근 재해도
        산재로 인정받을 수 있게 되었습니다. 그런데 여전히 많은 분들이 이 사실을
        모르고 있습니다.
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
          ⚠️ 핵심: &apos;통상적인 경로와 방법&apos;이어야 한다
        </p>
        <p style={{ fontSize: 14.5, color: '#7f1d1d', margin: 0 }}>
          출퇴근 산재가 인정되려면 <strong>사업주가 제공한 교통수단</strong>을
          이용하거나, <strong>통상적인 경로와 방법</strong>으로 출퇴근하던
          중이어야 합니다.
        </p>
      </div>

      <h2 style={h2Style}>출퇴근 산재 인정 조건</h2>

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
          <li>사업주가 제공한 교통수단 이용 중 사고</li>
          <li>통상적인 경로와 방법으로 출퇴근 중 사고</li>
          <li>출퇴근 경로에서의 일탈이나 중단이 없어야 함</li>
        </ul>
      </div>

      <p>
        여기서 <strong>&apos;통상적인&apos;</strong>이라는 말이 중요합니다. 평소
        다니던 길, 평소 이용하던 교통수단이어야 합니다. 갑자기 다른 길로 샛다가
        사고가 나면 인정받기 어렵습니다.
      </p>

      <h2 style={h2Style}>인정되는 경우 vs 인정되지 않는 경우</h2>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '32px 0',
          fontSize: 14,
        }}
      >
        <thead>
          <tr>
            <th style={{ ...thBase, background: '#f0fdf4' }}>
              ✅ 인정되는 경우
            </th>
            <th style={{ ...thBase, background: '#fef2f2' }}>
              ❌ 인정되기 어려운 경우
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdCell}>집 → 회사 최단 경로 도보 중 넘어짐</td>
            <td style={tdCell}>출근길에 은행 들렀다가 사고</td>
          </tr>
          <tr>
            <td style={tdCell}>회사 통근버스 안에서 사고</td>
            <td style={tdCell}>퇴근길 술자리 후 귀가 중 사고</td>
          </tr>
          <tr>
            <td style={tdCell}>대중교통 이용 중 교통사고</td>
            <td style={tdCell}>평소와 전혀 다른 먼 길로 샛다가 사고</td>
          </tr>
          <tr>
            <td style={tdCell}>자전거·킥보드로 출퇴근 중 사고</td>
            <td style={tdCell}>무면허·음주운전 중 사고</td>
          </tr>
          <tr>
            <td style={{ padding: '10px 8px', fontSize: 13.5 }}>
              아이 어린이집 들렀다 회사 가는 길 (일상적 양육)
            </td>
            <td style={{ padding: '10px 8px', fontSize: 13.5 }}>
              출장으로 먼 지역 가는 길은 별도 출장 규정 적용
            </td>
          </tr>
        </tbody>
      </table>

      <h2 style={h2Style}>출퇴근 산재, 보상 범위는?</h2>

      <p>
        출퇴근 재해로 인정되면 <strong>일반 산재와 동일한 혜택</strong>을
        받습니다.
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
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 14.5,
            color: '#555',
            lineHeight: 2.3,
          }}
        >
          <li>요양급여 (치료비 전액)</li>
          <li>휴업급여 (평균임금의 70%)</li>
          <li>장해급여 (후유장해 시)</li>
          <li>간병급여 (필요시)</li>
        </ul>
      </div>

      <h2 style={h2Style}>사고 직후, 이것만은 꼭 하세요</h2>

      <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
        <li style={checkItem}>
          ☐ 경찰에 신고하고 교통사고 사실확인원 발급받기
        </li>
        <li style={checkItem}>
          ☐ 사고 위치·시간이 출퇴근 경로임을 증명할 수 있는 자료 확보 (CCTV,
          내비게이션 기록)
        </li>
        <li style={checkItem}>
          ☐ 병원 진단서에 사고 경위와 부상 부위를 정확히 기재
        </li>
        <li style={checkItem}>
          ☐ 사업주에게 즉시 사고 사실 통보 (문자·카톡 기록 남기기)
        </li>
      </ul>

      <h2 style={h2Style}>자동차보험 vs 산재보험, 중복은?</h2>

      <p>
        출퇴근 교통사고는 자동차보험과 산재보험 모두 적용 가능합니다. 다만{' '}
        <strong>동일한 항목에 대해 이중 수령은 불가능</strong>합니다. 치료비는
        자동차보험에서 먼저 지급하고, 부족한 부분이나 휴업손해는 산재보험으로
        청구하는 식의 조정이 필요합니다.
      </p>

      <div style={{ textAlign: 'center', margin: '48px 0' }}>
        <a
          href="https://ilsem.vercel.app"
          style={{
            display: 'inline-block',
            background: '#1a1a1a',
            color: '#fff',
            padding: '16px 48px',
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: -0.3,
          }}
        >
          일셈 계산기 바로가기 →
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
