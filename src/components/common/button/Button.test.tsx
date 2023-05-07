import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('<Button />', () => {
  const testLabel = 'test-label';

  test('renders without errors', () => {
    render(<Button aria-label={testLabel} />);
    expect(screen.getByLabelText(testLabel)).toBeInTheDocument();
  });

  test('renders the correct content', () => {
    const content = 'test content';
    render(<Button aria-label={testLabel}>{content}</Button>);
    expect(screen.getByLabelText(testLabel)).toHaveTextContent(content);
  });

  test('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button aria-label={testLabel} onClick={onClick} />);
    userEvent.click(screen.getByLabelText(testLabel));
    expect(onClick).toHaveBeenCalled();
  });

  test('disables the button when disabled prop is true', () => {
    render(<Button aria-label={testLabel} disabled />);
    expect(screen.getByLabelText(testLabel)).toBeDisabled();
  });

  test('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    render(<Button aria-label={testLabel} onClick={onClick} disabled />);
    userEvent.click(screen.getByLabelText(testLabel));
    expect(onClick).not.toHaveBeenCalled();
  });
});
