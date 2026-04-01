import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import AddClientPopup from '../components/AddClientPopup';

// Ensure the test environment is cleaned up after each execution
afterEach(() => {
    cleanup();
});

describe('AddClientPopup - DNI & NIE Validation', () => {
    // Basic props required to render the component correctly
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
    };

    it('should accept a valid Spanish DNI (8 numbers and 1 letter)', () => {
        render(<AddClientPopup {...defaultProps} />);

        // Find the DNI input field using its placeholder text
        const dniInput = screen.getByPlaceholderText('DNI ...');

        // Simulate the user typing a valid DNI
        fireEvent.change(dniInput, { target: { value: '12345678Z' } });

        // Verify that the input accurately reflects the entered value
        expect(dniInput).toHaveValue('12345678Z');

        // Ensure no error message related to invalid DNI format is displayed
        // We use queryByText because it safely returns null if not found
        const errorMessage = screen.queryByText(/dni inválido|incorrecto/i);
        expect(errorMessage).not.toBeInTheDocument();
    });

    it('should show an error or fail validation when the DNI is too short', () => {
        render(<AddClientPopup {...defaultProps} />);

        const dniInput = screen.getByPlaceholderText('DNI ...');

        // Simulate typing a DNI format that is clearly too short (e.g., 4 numbers)
        fireEvent.change(dniInput, { target: { value: '1234Z' } });

        // Trigger the blur event, which often triggers validation in forms
        fireEvent.blur(dniInput);

        // Check if an error message appears (e.g., "Mínimo 9 caracteres", "DNI Invalido", etc.)
        // This test expects the component to eventually implement error rendering text
        const errorMessage = screen.getByText(/inválido|incorrecto|error/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('should fail validation when the DNI is missing a letter', () => {
        render(<AddClientPopup {...defaultProps} />);

        const dniInput = screen.getByPlaceholderText('DNI ...');

        // Simulate typing only numbers without the trailing letter
        fireEvent.change(dniInput, { target: { value: '12345678' } });
        fireEvent.blur(dniInput);

        // Assert that the component displays an error indicating invalid format
        const errorMessage = screen.getByText(/inválido|incorrecto|error/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('should fail validation when the DNI or NIE contains special characters', () => {
        render(<AddClientPopup {...defaultProps} />);

        const dniInput = screen.getByPlaceholderText('DNI ...');

        // Test with DNI format containing special characters
        fireEvent.change(dniInput, { target: { value: '123456-Z' } });
        fireEvent.blur(dniInput);
        let errorMessage = screen.getByText(/inválido|incorrecto|error/i);
        expect(errorMessage).toBeInTheDocument();

        // Test with NIE format containing special characters
        fireEvent.change(dniInput, { target: { value: 'X123@567Z' } });
        fireEvent.blur(dniInput);
        errorMessage = screen.getByText(/inválido|incorrecto|error/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('should accept a valid Spanish NIE (1 letter, 7 numbers, 1 letter)', () => {
        render(<AddClientPopup {...defaultProps} />);

        const dniInput = screen.getByPlaceholderText('DNI ...');

        // Simulate typing a valid NIE
        fireEvent.change(dniInput, { target: { value: 'X1234567Z' } });

        // Verify that the input reflects the value
        expect(dniInput).toHaveValue('X1234567Z');

        // Ensure no error message is displayed
        const errorMessage = screen.queryByText(/dni inválido|incorrecto|error/i);
        expect(errorMessage).not.toBeInTheDocument();
    });

    it('should show an error or fail validation when the NIE is too short', () => {
        render(<AddClientPopup {...defaultProps} />);

        const dniInput = screen.getByPlaceholderText('DNI ...');

        // Simulate typing an NIE format that is too short
        fireEvent.change(dniInput, { target: { value: 'X123Z' } });
        fireEvent.blur(dniInput);

        const errorMessage = screen.getByText(/inválido|incorrecto|error/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('should fail validation when the NIE is missing the final letter', () => {
        render(<AddClientPopup {...defaultProps} />);

        const dniInput = screen.getByPlaceholderText('DNI ...');

        // Simulate typing an NIE missing the trailing letter
        fireEvent.change(dniInput, { target: { value: 'X1234567' } });
        fireEvent.blur(dniInput);

        const errorMessage = screen.getByText(/inválido|incorrecto|error/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
