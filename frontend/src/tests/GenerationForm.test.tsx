import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { GenerationForm } from '../components/GenerationForm';

const mockOnGenerate = jest.fn();
const mockOnAbort = jest.fn();
const mockOnClearRestored = jest.fn();

const renderGenerationForm = (props = {}) => {
  const defaultProps = {
    onGenerate: mockOnGenerate,
    isGenerating: false,
    onAbort: mockOnAbort,
    canAbort: false,
    onClearRestored: mockOnClearRestored,
    hasSelectedImage: false,
    ...props,
  };

  return render(
    <BrowserRouter>
      <GenerationForm {...defaultProps} />
    </BrowserRouter>
  );
};

describe('GenerationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements', () => {
    renderGenerationForm();
    
    expect(screen.getByLabelText(/prompt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/style/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
  });

  it('disables form when generating', () => {
    renderGenerationForm({ isGenerating: true });
    
    expect(screen.getByLabelText(/prompt/i)).toBeDisabled();
    expect(screen.getByLabelText(/style/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled();
  });

  it('shows abort button when can abort', () => {
    renderGenerationForm({ canAbort: true });
    
    expect(screen.getByRole('button', { name: /abort/i })).toBeInTheDocument();
  });

  it('calls onGenerate with correct parameters', async () => {
    const user = userEvent.setup();
    renderGenerationForm();
    
    const promptInput = screen.getByLabelText(/prompt/i);
    const styleSelect = screen.getByLabelText(/style/i);
    const generateButton = screen.getByRole('button', { name: /generate/i });
    
    await user.type(promptInput, 'A beautiful sunset');
    await user.selectOptions(styleSelect, 'artistic');
    await user.click(generateButton);
    
    expect(mockOnGenerate).toHaveBeenCalledWith('A beautiful sunset', 'artistic');
  });

  it('does not submit with empty prompt', async () => {
    const user = userEvent.setup();
    renderGenerationForm();
    
    const generateButton = screen.getByRole('button', { name: /generate/i });
    await user.click(generateButton);
    
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it('calls onAbort when abort button is clicked', async () => {
    const user = userEvent.setup();
    renderGenerationForm({ canAbort: true });
    
    const abortButton = screen.getByRole('button', { name: /abort/i });
    await user.click(abortButton);
    
    expect(mockOnAbort).toHaveBeenCalled();
  });

  it('shows character count', async () => {
    const user = userEvent.setup();
    renderGenerationForm();
    
    const promptInput = screen.getByLabelText(/prompt/i);
    await user.type(promptInput, 'Test prompt');
    
    expect(screen.getByText('11/500 characters')).toBeInTheDocument();
  });
});
