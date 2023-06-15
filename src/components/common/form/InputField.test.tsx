import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vitest } from 'vitest';
import { InputField } from './InputField';

describe('<InputField />', () => {
  const testLabel = 'test-label';

  test('renders without errors', () => {
    render(<InputField aria-label={testLabel} />);
    expect(screen.getByLabelText(testLabel)).toBeInTheDocument();
  });

  test('calls onChange handler when input value changes', () => {
    const onChange = vitest.fn();
    render(<InputField aria-label={testLabel} onChange={onChange} />);
    const input = screen.getByLabelText(testLabel) as HTMLInputElement;
    const newValue = 'new value';
    userEvent.type(input, newValue);
    expect(onChange).toHaveBeenCalledTimes(newValue.length);
  });

  test('disables the input when disabled prop is true', () => {
    const onChange = vitest.fn();
    render(<InputField aria-label={testLabel} disabled />);
    const input = screen.getByLabelText(testLabel) as HTMLInputElement;
    const newValue = 'new value';
    userEvent.type(input, newValue);
    expect(input).toBeDisabled();
    expect(onChange).not.toHaveBeenCalledTimes(newValue.length);
  });
});
