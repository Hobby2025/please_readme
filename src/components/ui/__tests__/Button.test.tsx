import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button 컴포넌트', () => {
  it('기본 버튼이 렌더링되어야 합니다', () => {
    render(<Button>버튼</Button>);
    expect(screen.getByText('버튼')).toBeInTheDocument();
  });

  it('다양한 크기가 올바르게 적용되어야 합니다', () => {
    const { rerender } = render(<Button size="sm">작은 버튼</Button>);
    expect(screen.getByText('작은 버튼')).toHaveClass('h-8', 'px-3', 'py-1.5', 'text-sm');

    rerender(<Button size="default">중간 버튼</Button>);
    expect(screen.getByText('중간 버튼')).toHaveClass('h-10', 'px-4', 'py-2', 'text-base');

    rerender(<Button size="lg">큰 버튼</Button>);
    expect(screen.getByText('큰 버튼')).toHaveClass('h-12', 'px-6', 'py-3', 'text-lg');
  });

  it('다양한 변형이 올바르게 적용되어야 합니다', () => {
    const { rerender } = render(<Button variant="default">기본</Button>);
    expect(screen.getByText('기본')).toHaveClass('bg-blue-600', 'text-white');

    rerender(<Button variant="secondary">보조</Button>);
    expect(screen.getByText('보조')).toHaveClass('bg-gray-200', 'text-gray-900');

    rerender(<Button variant="outline">외곽선</Button>);
    expect(screen.getByText('외곽선')).toHaveClass('border', 'border-gray-300');

    rerender(<Button variant="ghost">고스트</Button>);
    expect(screen.getByText('고스트')).toHaveClass('hover:bg-gray-100');

    rerender(<Button variant="link">링크</Button>);
    expect(screen.getByText('링크')).toHaveClass('text-blue-600', 'underline-offset-4');
  });

  it('로딩 상태일 때 스피너가 표시되어야 합니다', () => {
    render(<Button isLoading>로딩</Button>);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('로딩')).not.toBeInTheDocument();
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('비활성화 상태가 올바르게 적용되어야 합니다', () => {
    render(<Button disabled>비활성화</Button>);
    
    const button = screen.getByText('비활성화');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none');
  });
}); 