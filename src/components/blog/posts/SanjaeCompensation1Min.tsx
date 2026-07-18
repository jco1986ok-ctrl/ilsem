export default function SanjaeCompensation1Min() {
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
          계산 가이드
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
          산재보상금,
          <br />
          1분 만에 계산하는 법
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', marginTop: 20 }}>
          일셈 편집부
        </p>
      </div>

      <p>산업재해를 당하면 누구나 제일 먼저 드는 생각이 있습니다.</p>

      <p
        style={{
          fontSize: 20,
          fontWeight: 700,
          textAlign: 'center',
          padding: '40px 20px',
          margin: '36px 0',
          borderTop: '1px solid #ddd',
          borderBottom: '1px solid #ddd',
        }}
      >
        &quot;그래서 도대체 얼마나 받을 수 있는 거지?&quot;
      </p>

      <p>
        근로복지공단에 전화해도, 인터넷을 뒤져도 시원한 답은 없습니다. 이유는
        간단합니다. 산재보상금은{' '}
        <strong>공식 하나로 딱 떨어지지 않기 때문</strong>입니다.
      </p>

      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          margin: '50px 0 20px',
          letterSpacing: -0.8,
          paddingBottom: 8,
          borderBottom: '2px solid #1a1a1a',
          display: 'inline-block',
        }}
      >
        산재보상금, 이렇게 구성됩니다
      </h2>

      <p>
        내가 받을 수 있는 산재보상금은 크게 5가지 항목으로 나뉩니다. 각각 계산
        기준이 다르기 때문에 하나씩 이해하는 게 중요합니다.
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
          산재보상금 5대 항목
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
            <strong>요양급여</strong> — 치료비·수술비·약제비 (실비 지급)
          </li>
          <li>
            <strong>휴업급여</strong> — 치료 기간 동안의 생활비 (평균임금의 70%)
          </li>
          <li>
            <strong>장해급여</strong> — 치료 후 후유장해가 남았을 때 일시금
            또는 연금
          </li>
          <li>
            <strong>간병급여</strong> — 다른 사람의 도움이 필요할 때 간병 비용
          </li>
          <li>
            <strong>유족급여</strong> — 사망 시 유족에게 지급되는 보상금
          </li>
        </ul>
      </div>

      <p>
        이 중에서도 <strong>휴업급여와 장해급여</strong>가 금액이 가장 크고,
        계산이 복잡해서 실수하기 쉬운 항목입니다.
      </p>

      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          margin: '50px 0 20px',
          letterSpacing: -0.8,
          paddingBottom: 8,
          borderBottom: '2px solid #1a1a1a',
          display: 'inline-block',
        }}
      >
        가장 중요한 숫자: 평균임금
      </h2>

      <p>
        산재보상금 계산의 출발점은 <strong>평균임금</strong>입니다. 평균임금이
        얼마냐에 따라 모든 보상금이 달라집니다.
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
          ⚠️ 가장 흔한 실수
        </p>
        <p style={{ fontSize: 14.5, color: '#7f1d1d', margin: 0 }}>
          평균임금 ≠ 월급 ÷ 30일
        </p>
        <p style={{ fontSize: 14, color: '#991b1b', margin: '8px 0 0' }}>
          올바른 계산은{' '}
          <strong>재해 전 3개월간 받은 임금 총액 ÷ 그 기간의 총 일수</strong>
          입니다. 상여금, 연장수당, 식대, 교통비까지 모두 포함해야 합니다.
        </p>
      </div>

      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          margin: '50px 0 20px',
          letterSpacing: -0.8,
          paddingBottom: 8,
          borderBottom: '2px solid #1a1a1a',
          display: 'inline-block',
        }}
      >
        일셈 계산기로 1분 만에 끝내기
      </h2>

      <p>
        이 복잡한 계산을 손으로 하려면 한 시간 넘게 걸립니다. 그래서{' '}
        <a
          href="https://ilsem.vercel.app"
          style={{ color: '#2563eb', fontWeight: 600 }}
        >
          일셈(ilsem)
        </a>
        을 만들었습니다. 회원가입도, 개인정보도 필요 없습니다.
      </p>

      <div style={{ margin: '36px 0' }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#ddd',
              lineHeight: 1,
              minWidth: 50,
            }}
          >
            01
          </div>
          <div style={{ paddingTop: 8 }}>
            <strong
              style={{ display: 'block', fontSize: 16, marginBottom: 4 }}
            >
              기본 정보 입력
            </strong>
            <span style={{ fontSize: 14, color: '#777' }}>
              재해일, 입사일, 월 평균 급여를 입력하세요. 3개월 평균치면
              충분합니다.
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#ddd',
              lineHeight: 1,
              minWidth: 50,
            }}
          >
            02
          </div>
          <div style={{ paddingTop: 8 }}>
            <strong
              style={{ display: 'block', fontSize: 16, marginBottom: 4 }}
            >
              재해 유형 선택
            </strong>
            <span style={{ fontSize: 14, color: '#777' }}>
              사고성인지, 질병인지 선택하면 보상 체계가 자동으로 맞춰집니다.
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#ddd',
              lineHeight: 1,
              minWidth: 50,
            }}
          >
            03
          </div>
          <div style={{ paddingTop: 8 }}>
            <strong
              style={{ display: 'block', fontSize: 16, marginBottom: 4 }}
            >
              예상 보상금 확인
            </strong>
            <span style={{ fontSize: 14, color: '#777' }}>
              휴업급여, 장해급여, 특별급여 등 항목별 금액이 한눈에 표로
              나옵니다.
            </span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 14, color: '#888', margin: '32px 0' }}>
        ※ 2026년 7월 개정된 최저임금·장해등급별 보상일수·최고보상한도까지 전부
        반영
      </p>

      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          margin: '50px 0 20px',
          letterSpacing: -0.8,
          paddingBottom: 8,
          borderBottom: '2px solid #1a1a1a',
          display: 'inline-block',
        }}
      >
        실제 사례로 보는 차이
      </h2>

      <p>
        월 300만 원, 35세 건설 근로자가{' '}
        <span
          style={{ background: '#dbeafe', fontWeight: 700, padding: '0 2px' }}
        >
          10급 장해
        </span>
        를 입은 경우입니다.
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
            <th
              style={{
                borderBottom: '2px solid #1a1a1a',
                padding: '14px 8px',
                fontSize: 13,
                color: '#888',
                letterSpacing: 1,
                textAlign: 'left',
              }}
            >
              보상 항목
            </th>
            <th
              style={{
                borderBottom: '2px solid #1a1a1a',
                padding: '14px 8px',
                fontSize: 13,
                color: '#888',
                letterSpacing: 1,
                textAlign: 'right',
              }}
            >
              일반 계산
            </th>
            <th
              style={{
                borderBottom: '2px solid #1a1a1a',
                padding: '14px 8px',
                fontSize: 13,
                color: '#888',
                letterSpacing: 1,
                textAlign: 'right',
              }}
            >
              일셈 계산
            </th>
            <th
              style={{
                borderBottom: '2px solid #1a1a1a',
                padding: '14px 8px',
                fontSize: 13,
                color: '#888',
                letterSpacing: 1,
                textAlign: 'right',
              }}
            >
              차이
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '14px 8px', borderBottom: '1px solid #eee' }}>
              휴업급여 (90일)
            </td>
            <td
              style={{
                padding: '14px 8px',
                borderBottom: '1px solid #eee',
                textAlign: 'right',
              }}
            >
              630만 원
            </td>
            <td
              style={{
                padding: '14px 8px',
                borderBottom: '1px solid #eee',
                textAlign: 'right',
                color: '#2563eb',
                fontWeight: 700,
              }}
            >
              718만 원
            </td>
            <td
              style={{
                padding: '14px 8px',
                borderBottom: '1px solid #eee',
                textAlign: 'right',
                color: '#dc2626',
                fontWeight: 600,
              }}
            >
              +88만
            </td>
          </tr>
          <tr>
            <td style={{ padding: '14px 8px', borderBottom: '1px solid #eee' }}>
              장해급여 (10급)
            </td>
            <td
              style={{
                padding: '14px 8px',
                borderBottom: '1px solid #eee',
                textAlign: 'right',
              }}
            >
              1,480만 원
            </td>
            <td
              style={{
                padding: '14px 8px',
                borderBottom: '1px solid #eee',
                textAlign: 'right',
                color: '#2563eb',
                fontWeight: 700,
              }}
            >
              1,690만 원
            </td>
            <td
              style={{
                padding: '14px 8px',
                borderBottom: '1px solid #eee',
                textAlign: 'right',
                color: '#dc2626',
                fontWeight: 600,
              }}
            >
              +210만
            </td>
          </tr>
          <tr>
            <td style={{ padding: '14px 8px', borderBottom: '1px solid #eee' }}>
              특별급여
            </td>
            <td
              style={{
                padding: '14px 8px',
                borderBottom: '1px solid #eee',
                textAlign: 'right',
                color: '#ccc',
              }}
            >
              미반영
            </td>
            <td
              style={{
                padding: '14px 8px',
                borderBottom: '1px solid #eee',
                textAlign: 'right',
                color: '#2563eb',
                fontWeight: 700,
              }}
            >
              240만 원
            </td>
            <td
              style={{
                padding: '14px 8px',
                borderBottom: '1px solid #eee',
                textAlign: 'right',
                color: '#dc2626',
                fontWeight: 600,
              }}
            >
              +240만
            </td>
          </tr>
          <tr style={{ background: '#fafafa' }}>
            <td
              style={{
                padding: '14px 8px',
                fontWeight: 700,
                borderBottom: '2px solid #1a1a1a',
              }}
            >
              합계
            </td>
            <td
              style={{
                padding: '14px 8px',
                textAlign: 'right',
                fontWeight: 700,
                borderBottom: '2px solid #1a1a1a',
              }}
            >
              2,110만 원
            </td>
            <td
              style={{
                padding: '14px 8px',
                textAlign: 'right',
                fontWeight: 700,
                color: '#2563eb',
                borderBottom: '2px solid #1a1a1a',
              }}
            >
              2,648만 원
            </td>
            <td
              style={{
                padding: '14px 8px',
                textAlign: 'right',
                fontWeight: 700,
                color: '#dc2626',
                borderBottom: '2px solid #1a1a1a',
              }}
            >
              +538만 원
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        같은 재해, 같은 조건인데도 계산 방식을 제대로 적용하느냐에 따라{' '}
        <strong>538만 원</strong>이라는 큰 차이가 발생합니다.
      </p>

      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          margin: '50px 0 20px',
          letterSpacing: -0.8,
          paddingBottom: 8,
          borderBottom: '2px solid #1a1a1a',
          display: 'inline-block',
        }}
      >
        마치며
      </h2>

      <p>
        산재보상금은 타고난 권리입니다. 하지만 그 권리를 제대로 행사하려면{' '}
        <strong>내가 얼마나 받을 수 있는지 먼저 아는 것</strong>이 첫걸음입니다.
      </p>

      <p>
        공단에서 제시하는 금액을 그냥 받아들이지 마세요. 1분만 투자해서 일셈
        계산기로 내 예상 금액을 확인해보세요. 아는 만큼 받을 수 있습니다.
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
