export default function SanjaeRejection4Steps() {
  const h2Style = {
    fontSize: 24,
    fontWeight: 800,
    margin: '50px 0 20px',
    letterSpacing: -0.8,
    paddingBottom: 8,
    borderBottom: '2px solid #1a1a1a',
    display: 'inline-block' as const,
  };

  const thStyle = {
    borderBottom: '2px solid #1a1a1a',
    padding: '14px 8px',
    fontSize: 13,
    color: '#888',
    textAlign: 'left' as const,
  };

  const tdStyle = {
    padding: '12px 8px',
    borderBottom: '1px solid #eee',
  };

  const tdLastStyle = {
    padding: '12px 8px',
    borderBottom: '2px solid #1a1a1a',
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
          분쟁 대응
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
          산재 승인 거부당했을 때
          <br />
          대처법 4단계
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>
          일셈 편집부
        </p>
      </div>

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
          ⚠️ 산재 불승인, 포기하지 마세요
        </p>
        <p style={{ fontSize: 14.5, color: '#7f1d1d', margin: 0 }}>
          산재 신청의 약 30%가 1차에서 불승인됩니다. 하지만 이 중 상당수가{' '}
          <strong>이의신청이나 재심사를 통해 뒤집힙니다.</strong>
        </p>
      </div>

      <h2 style={h2Style}>1단계: 불승인 사유를 정확히 파악하라</h2>

      <p>
        공단에서 보내온 <strong>&apos;요양불승인통지서&apos;</strong>를 꼼꼼히
        읽으세요. 불승인 사유는 크게 세 가지로 나뉩니다.
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
          주요 불승인 사유 3가지
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
            <strong>업무관련성 부족</strong> → &quot;업무와 상병 간 인과관계를
            인정하기 어려움&quot;
          </li>
          <li>
            <strong>기존 질환</strong> → &quot;퇴행성 변화로 업무 외적 요인에
            의한 것&quot;
          </li>
          <li>
            <strong>증거 부족</strong> → &quot;재해 발생 경위를 입증할 객관적
            자료 미비&quot;
          </li>
        </ul>
      </div>

      <p>
        불승인 사유를 알아야 <strong>어떤 증거를 추가로 준비할지</strong> 전략을
        세울 수 있습니다.
      </p>

      <h2 style={h2Style}>2단계: 추가 증거를 확보하라</h2>

      <p>불승인 사유별로 준비해야 할 추가 자료가 다릅니다.</p>

      <div style={{ margin: '24px 0' }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          업무관련성이 부족하다고 나왔다면?
        </p>
        <p style={{ fontSize: 14.5, color: '#666', margin: '0 0 20px' }}>
          → 동료 진술서, 작업 동영상, 근무시간 로그, 업무 매뉴얼, 사업장
          구조·환경 사진
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          기존 질환(퇴행성)이라고 나왔다면?
        </p>
        <p style={{ fontSize: 14.5, color: '#666', margin: '0 0 20px' }}>
          → 과거 건강검진 기록(이상 없었음 증명), 작업 강도·반복 횟수 기록, 의사
          추가 소견서(&quot;기존 질환이 업무로 인해 급격히 악화됨&quot; 명시)
        </p>

        <p style={{ fontWeight: 700, marginBottom: 4 }}>
          증거가 부족하다고 나왔다면?
        </p>
        <p style={{ fontSize: 14.5, color: '#666', margin: 0 }}>
          → CCTV 열람 요청, 목격자 재진술, 사고 당일 상황 재구성 자료,
          사업주와의 통화 녹취록
        </p>
      </div>

      <h2 style={h2Style}>3단계: 이의신청 (심사청구) 하라</h2>

      <p>
        불승인 통지를 받은 날로부터 <strong>90일 이내</strong>에 근로복지공단
        본부에 심사청구를 할 수 있습니다.
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
          💡 심사청구 꿀팁
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
            불승인 사유를 <strong>하나씩 반박</strong>하는 형식으로 작성
          </li>
          <li>새로운 의사 소견서 첨부 필수</li>
          <li>전문가(노무사) 도움을 받으면 승인율이 크게 올라갑니다</li>
        </ul>
      </div>

      <h2 style={h2Style}>4단계: 재심사 청구 및 행정소송</h2>

      <p>
        심사청구도 기각되면 <strong>산업재해보상보험재심사위원회</strong>에
        재심사 청구가 가능합니다. 그래도 안 되면 행정법원에 소송을 제기할 수
        있습니다.
      </p>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '32px 0',
          fontSize: 14.5,
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>단계</th>
            <th style={thStyle}>기관</th>
            <th style={thStyle}>기한</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>1차 심사청구</td>
            <td style={tdStyle}>근로복지공단 본부</td>
            <td style={tdStyle}>불승인 후 90일 이내</td>
          </tr>
          <tr>
            <td style={tdStyle}>2차 재심사청구</td>
            <td style={tdStyle}>재심사위원회</td>
            <td style={tdStyle}>심사청구 기각 후 90일 이내</td>
          </tr>
          <tr>
            <td style={tdLastStyle}>행정소송</td>
            <td style={tdLastStyle}>행정법원</td>
            <td style={tdLastStyle}>재심사 기각 후 90일 이내</td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: 14, color: '#888' }}>
        ※ 행정소송까지 가면 전문가(산재 전문 노무사 또는 변호사)의 도움이 반드시
        필요합니다.
      </p>

      <h2 style={h2Style}>불승인, 혼자 대응하지 마세요</h2>

      <p>
        산재 불승인은 누구에게나 찾아올 수 있습니다. 중요한 건{' '}
        <strong>포기하지 않고 절차대로 대응하는 것</strong>입니다.
      </p>

      <p>
        일셈 계산기로 예상 보상금을 먼저 확인해보세요. 내가 받을 수 있는 금액을
        알고 있으면 불승인에 대응할 때도 훨씬 유리합니다.
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
