import Link from 'next/link';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import { slugify } from '@/lib/blog-utils';
import SanjaeCompensation1Min from '@/components/blog/posts/SanjaeCompensation1Min';
import SanjaeDocuments5 from '@/components/blog/posts/SanjaeDocuments5';
import SanjaeRejection4Steps from '@/components/blog/posts/SanjaeRejection4Steps';
import MusculoskeletalDiscGuide from '@/components/blog/posts/MusculoskeletalDiscGuide';
import PartTimeSanjaeGuide from '@/components/blog/posts/PartTimeSanjaeGuide';
import DisabilityGradeGuide from '@/components/blog/posts/DisabilityGradeGuide';
import InjuryLeavePayGuide from '@/components/blog/posts/InjuryLeavePayGuide';

function getText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    const el = node as { props?: { children?: ReactNode } };
    return getText(el.props?.children);
  }
  return '';
}

function parseJsonProp<T>(value: T | string | undefined): T | undefined {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

export function WarningBox({ children }: { children: ReactNode }) {
  return (
    <aside className="blog-warning-box" role="note">
      <strong className="blog-box-label">주의</strong>
      <div>{children}</div>
    </aside>
  );
}

export function TipBox({ children }: { children: ReactNode }) {
  return (
    <aside className="blog-tip-box" role="note">
      <strong className="blog-box-label">팁</strong>
      <div>{children}</div>
    </aside>
  );
}

export function SuccessBox({ children }: { children: ReactNode }) {
  return (
    <aside className="blog-success-box" role="note">
      <strong className="blog-box-label">안내</strong>
      <div>{children}</div>
    </aside>
  );
}

type Step = { title: string; desc: string };

export function StepGuide({
  steps,
}: {
  steps?: Step[] | string;
}) {
  const list = parseJsonProp<Step[]>(steps) ?? [];

  return (
    <ol className="blog-step-guide">
      {list.map((step, i) => (
        <li key={`${step.title}-${i}`} className="blog-step-item">
          <span className="blog-step-badge" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <p className="blog-step-title">{step.title}</p>
            <p className="blog-step-desc">{step.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CheckList({
  items,
  children,
}: {
  items?: string[] | string;
  children?: ReactNode;
}) {
  const list = parseJsonProp<string[]>(items);

  if (list && list.length > 0) {
    return (
      <ul className="blog-checklist">
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <ul className="blog-checklist">{children}</ul>;
}

export function CalculatorCTA({
  href = '/calc/average-wage',
  label = '일셈 계산기 바로가기',
}: {
  href?: string;
  label?: string;
}) {
  return (
    <div className="blog-calculator-cta">
      <div>
        <p className="blog-cta-title">내 상황에 맞는 금액, 바로 확인해보세요</p>
        <p className="blog-cta-desc">
          산재·퇴직·연차·4대보험까지 — 회원가입 없이 3분 안에 계산할 수 있습니다.
        </p>
      </div>
      <Link href={href} className="blog-cta-button">
        {label}
      </Link>
    </div>
  );
}

function Heading2({ children, ...props }: ComponentPropsWithoutRef<'h2'>) {
  const text = getText(children);
  const id = slugify(text);

  return (
    <h2 id={id} {...props}>
      {children}
    </h2>
  );
}

export const mdxComponents = {
  h2: Heading2,
  WarningBox,
  TipBox,
  SuccessBox,
  StepGuide,
  CheckList,
  CalculatorCTA,
  SanjaeCompensation1Min,
  SanjaeDocuments5,
  SanjaeRejection4Steps,
  MusculoskeletalDiscGuide,
  PartTimeSanjaeGuide,
  DisabilityGradeGuide,
  InjuryLeavePayGuide,
};
