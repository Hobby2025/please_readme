import React from 'react';
import { render, screen } from '@testing-library/react';
import { TechBadge } from '../TechBadge';

describe('TechBadge 컴포넌트', () => {
  it('기본 텍스트가 렌더링되어야 합니다', () => {
    render(<TechBadge tech="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('기본 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="Unknown" />);
    expect(screen.getByText('Unknown')).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('React 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="React" />);
    expect(screen.getByText('React')).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('TypeScript 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="TypeScript" />);
    expect(screen.getByText('TypeScript')).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('JavaScript 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="JavaScript" />);
    expect(screen.getByText('JavaScript')).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('Python 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="Python" />);
    expect(screen.getByText('Python')).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('Java 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="Java" />);
    expect(screen.getByText('Java')).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('Go 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="Go" />);
    expect(screen.getByText('Go')).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('Rust 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="Rust" />);
    expect(screen.getByText('Rust')).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('Kotlin 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="Kotlin" />);
    expect(screen.getByText('Kotlin')).toHaveClass('bg-purple-100', 'text-purple-800');
  });

  it('Swift 색상이 적용되어야 합니다', () => {
    render(<TechBadge tech="Swift" />);
    expect(screen.getByText('Swift')).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('Node.js 기술 스택의 색상이 정상적으로 적용되어야 합니다', () => {
    render(<TechBadge tech="Node.js" />);
    expect(screen.getByText('Node.js')).toHaveClass('bg-[#339933]');
  });

  it('Docker 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="Docker" />);
    const badge = screen.getByText('Docker');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('Kubernetes 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="Kubernetes" />);
    const badge = screen.getByText('Kubernetes');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('AWS 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="AWS" />);
    const badge = screen.getByText('AWS');
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('Git 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="Git" />);
    const badge = screen.getByText('Git');
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('Linux 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="Linux" />);
    const badge = screen.getByText('Linux');
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('MongoDB 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="MongoDB" />);
    const badge = screen.getByText('MongoDB');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('PostgreSQL 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="PostgreSQL" />);
    const badge = screen.getByText('PostgreSQL');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('Redis 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="Redis" />);
    const badge = screen.getByText('Redis');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('GraphQL 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="GraphQL" />);
    const badge = screen.getByText('GraphQL');
    expect(badge).toHaveClass('bg-pink-100', 'text-pink-800');
  });

  it('REST API 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="REST API" />);
    const badge = screen.getByText('REST API');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('CI/CD 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="CI/CD" />);
    const badge = screen.getByText('CI/CD');
    expect(badge).toHaveClass('bg-purple-100', 'text-purple-800');
  });

  it('테스트 색상이 올바르게 적용되어야 합니다', () => {
    render(<TechBadge tech="테스트" />);
    const badge = screen.getByText('테스트');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });
}); 