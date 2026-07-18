export default function DisabilityGradeGuide() {
  const h2Style = {
    fontSize: 24,
    fontWeight: 800,
    margin: '50px 0 20px',
    letterSpacing: -0.8,
    paddingBottom: 8,
    borderBottom: '2px solid #1a1a1a',
    display: 'inline-block' as const,
  };

  const thMain = {
    borderBottom: '2px solid #1a1a1a',
    padding: '10px 8px',
    fontSize: 13,
    color: '#888',
  };

  const td = {
    padding: '10px 8px',
    borderBottom: '1px solid #eee',
  };

  const tdLast = {
    padding: '10px 8px',
    borderBottom: '2px solid #1a1a1a',
  };

  const grades: { grade: string; days: string; example: string; last?: boolean }[] = [
    { grade: '1급', days: '1,474일', example: '두 눈 실명, 사지 완전 마비' },
    { grade: '2급', days: '1,309일', example: '한 눈 실명 + 한 팔 완전 마비' },
    { grade: '3급', days: '1,155일', example: '두 손의 손가락 전부 상실' },
    { grade: '4급', days: '1,012일', example: '두 다리 무릎 위에서 절단' },
    { grade: '5급', days: '869일', example: '한 팔 완전 마비' },
    { grade: '6급', days: '737일', example: '한 팔의 3대 관절 중 2개 못 씀' },
    { grade: '7급', days: '616일', example: '한 눈 실명' },
    { grade: '8급', days: '495일', example: '한 손 엄지+검지 상실' },
    { grade: '9급', days: '385일', example: '한 손 엄지 상실' },
    { grade: '10급', days: '297일', example: '한 손 검지 상실' },
    { grade: '11급', days: '220일', example: '한 손 약지·소지 상실' },
    { grade: '12급', days: '154일', example: '척추 기립근에 뚜렷한 장해' },
    { grade: '13급', days: '99일', example: '흉터 5cm 이상' },
    { grade: '14급', days: '55일', example: '국부 신경 증상이 남은 경우', last: true },
  ];

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
          기초 정보
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
          산재 장해등급 총정리
          <br />
          1급부터 14급까지
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>일셈 편집부</p>
      </div>

      <p>
        치료가 끝난 후에도 후유장해가 남았다면 <strong>장해급여</strong>를 받을 수
        있습니다. 이때 장해의 정도에 따라 1급(가장 심함)부터 14급(가장 가벼움)까지
        등급이 매겨집니다. 등급에 따라 보상금이 크게 달라지기 때문에 정확히
        이해하는 것이 중요합니다.
      </p>

      <h2 style={h2Style}>장해등급별 보상일수</h2>

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
            <th style={{ ...thMain, textAlign: 'left' }}>등급</th>
            <th style={{ ...thMain, textAlign: 'right' }}>보상일수</th>
            <th style={{ ...thMain, textAlign: 'left' }}>대표 사례</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((row) => {
            const cell = row.last ? tdLast : td;
            return (
              <tr key={row.grade}>
                <td style={{ ...cell, fontWeight: 700 }}>{row.grade}</td>
                <td style={{ ...cell, textAlign: 'right' }}>{row.days}</td>
                <td style={{ ...cell, fontSize: 13, color: '#666' }}>
                  {row.example}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>
        ※ 장해보상일수 × 평균임금 = 장해급여 금액. 예) 평균임금 10만원 ×
        297일(10급) = 2,970만원
      </p>

      <h2 style={h2Style}>근골격계 질환의 장해등급 기준</h2>

      <p>
        산재에서 가장 흔한 근골격계 질환(허리디스크 등)의 장해등급은 아래와 같은
        기준으로 결정됩니다.
      </p>

      <div style={{ background: '#f8f8f8', padding: '28px 32px', margin: '32px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: 8,
                  color: '#888',
                  fontSize: 12,
                  borderBottom: '1px solid #ddd',
                }}
              >
                등급
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: 8,
                  color: '#888',
                  fontSize: 12,
                  borderBottom: '1px solid #ddd',
                }}
              >
                척추(허리) 기준
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 8, fontWeight: 700 }}>8급</td>
              <td style={{ padding: 8, fontSize: 13.5, color: '#555' }}>
                척추가 완전 강직된 경우
              </td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 700 }}>10급</td>
              <td style={{ padding: 8, fontSize: 13.5, color: '#555' }}>
                운동범위가 정상의 1/2 이하
              </td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 700 }}>12급</td>
              <td style={{ padding: 8, fontSize: 13.5, color: '#555' }}>
                기립근에 뚜렷한 장해, 추간판 2개 이상 탈출
              </td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 700 }}>14급</td>
              <td style={{ padding: 8, fontSize: 13.5, color: '#555' }}>
                국부에 신경 증상이 남은 경우
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style={h2Style}>장해급여, 연금 vs 일시금 선택</h2>

      <p>
        1급~7급은 <strong>연금 또는 일시금 중 선택</strong>할 수 있습니다.
        8급~14급은 일시금만 지급됩니다.
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
          💡 연금 vs 일시금, 뭐가 유리할까?
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
            <strong>연금</strong>: 매년 지급, 물가상승률 반영, 장기 수령 시 더
            유리
          </li>
          <li>
            <strong>일시금</strong>: 한 번에 목돈 수령, 단기 자금 필요 시 유리
          </li>
          <li>
            1~3급: 연금이 대체로 유리 &nbsp;|&nbsp; 4~7급: 개인 상황에 따라 판단
          </li>
        </ul>
      </div>

      <h2 style={h2Style}>내 장해등급에 따른 보상금 확인하기</h2>

      <p>
        장해등급별로 보상금이 크게 달라집니다. 일셈 계산기로 내 예상 보상금을
        확인해보세요.
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
