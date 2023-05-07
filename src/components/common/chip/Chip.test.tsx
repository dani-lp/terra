import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';

describe('<Chip />', () => {
  const testLabel = 'test-label';
  const testButtonLabel = 'test-button-label';

  test('renders with a label', () => {
    render(<Chip label={testLabel} />);
    expect(screen.getByText(testLabel)).toBeInTheDocument();
  });

  test('renders with a close button if onCloseClick is passed', () => {
    const onCloseClick = jest.fn();
    render(<Chip label={testLabel} onCloseClick={onCloseClick} onCloseLabel={testButtonLabel} />);
    const closeButton = screen.getByRole('button', { name: testButtonLabel });
    expect(closeButton).toBeInTheDocument();
    userEvent.click(closeButton);
    expect(onCloseClick).toHaveBeenCalled();
  });

  test('does not render a close button if onCloseClick is not passed', () => {
    render(<Chip label={testLabel} />);
    expect(screen.queryByRole('button', { name: testButtonLabel })).not.toBeInTheDocument();
  });
});
