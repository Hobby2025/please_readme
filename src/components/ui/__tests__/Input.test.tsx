import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input 컴포넌트', () => {
  it('라벨과 함께 렌더링되어야 합니다', () => {
    render(<Input label="이메일" />);
    expect(screen.getByText('이메일')).toBeInTheDocument();
  });

  it('입력값이 변경되어야 합니다', () => {
    const handleChange = jest.fn();
    render(<Input label="이메일" onChange={handleChange} />);
    
    const input = screen.getByLabelText('이메일');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test@example.com');
  });

  it('에러 메시지가 표시되어야 합니다', () => {
    render(<Input label="이메일" error="유효하지 않은 이메일입니다." />);
    expect(screen.getByText('유효하지 않은 이메일입니다.')).toBeInTheDocument();
  });

  it('비활성화 상태일 때 입력이 불가능해야 합니다', () => {
    render(<Input label="이메일" disabled />);
    expect(screen.getByLabelText('이메일')).toBeDisabled();
  });

  it('placeholder가 표시되어야 합니다', () => {
    render(<Input label="이메일" placeholder="이메일을 입력하세요" />);
    expect(screen.getByPlaceholderText('이메일을 입력하세요')).toBeInTheDocument();
  });

  it('required 속성이 적용되어야 합니다', () => {
    render(<Input label="이메일" required />);
    expect(screen.getByLabelText('이메일')).toBeRequired();
  });
}); 