import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vitest } from 'vitest';
import { TextareaField } from './TextareaField';

describe('<TextareaField />', () => {
  const testLabel = 'test-label';

  test('renders without errors', () => {
    render(<TextareaField aria-label={testLabel} />);
    expect(screen.getByLabelText(testLabel)).toBeInTheDocument();
  });

  test('calls onChange handler when textarea value changes', () => {
    const onChange = vitest.fn();
    render(<TextareaField aria-label={testLabel} onChange={onChange} />);
    const textarea = screen.getByLabelText(testLabel) as HTMLTextAreaElement;
    const newValue = 'new value';
    userEvent.type(textarea, newValue);
    expect(onChange).toHaveBeenCalledTimes(newValue.length);
  });

  test('disables the textarea when disabled prop is true', () => {
    const onChange = vitest.fn();
    render(<TextareaField aria-label={testLabel} disabled />);
    const textarea = screen.getByLabelText(testLabel) as HTMLTextAreaElement;
    const newValue = 'new value';
    userEvent.type(textarea, newValue);
    expect(textarea).toBeDisabled();
    expect(onChange).not.toHaveBeenCalledTimes(newValue.length);
  });
});
