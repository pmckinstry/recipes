import { render, screen } from '@testing-library/react';
import MainContent from '@/components/MainContent';

describe('MainContent', () => {
  it('renders children with correct styling', () => {
    render(
      <MainContent>
        <div data-testid='test-content'>Test content</div>
      </MainContent>
    );

    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Test content');
  });

  it('applies correct CSS classes', () => {
    render(
      <MainContent>
        <div>Test content</div>
      </MainContent>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass(
      'min-h-[calc(100vh-4rem)]',
      'bg-gray-50',
      'pt-8',
      'pb-12'
    );
  });

  it('renders container with correct styling', () => {
    render(
      <MainContent>
        <div>Test content</div>
      </MainContent>
    );

    const container = screen.getByRole('main').firstChild;
    expect(container).toHaveClass('container', 'mx-auto', 'px-4');
  });

  it('renders multiple children correctly', () => {
    render(
      <MainContent>
        <div data-testid='child-1'>Child 1</div>
        <div data-testid='child-2'>Child 2</div>
        <div data-testid='child-3'>Child 3</div>
      </MainContent>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });
});
