import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UploadStep from '../components/UploadStep'

describe('UploadStep', () => {
  it('renders the drop area, upload button and camera button', () => {
    render(<UploadStep onFileReady={vi.fn()} />)

    expect(screen.getByRole('region', { name: 'Area de carga de factura' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subir archivo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tomar foto' })).toBeInTheDocument()
  })

  it('shows a preview when a valid JPG file is selected', async () => {
    const user = userEvent.setup()

    render(<UploadStep onFileReady={vi.fn()} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['jpg-binary'], 'factura.jpg', { type: 'image/jpeg' })

    await user.upload(input, file)

    expect(await screen.findByAltText('Vista previa de factura.jpg')).toBeInTheDocument()
  })

  it('shows an error when an invalid txt file is selected', async () => {
    const user = userEvent.setup({ applyAccept: false })

    render(<UploadStep onFileReady={vi.fn()} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['text'], 'factura.txt', { type: 'text/plain' })

    await user.upload(input, file)

    expect(await screen.findByText('Formato no permitido. Use JPG, PNG o PDF.')).toBeInTheDocument()
  })

  it('keeps the continue button disabled when there is no file', () => {
    render(<UploadStep onFileReady={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled()
  })

  it('enables the continue button after loading a valid file', async () => {
    const user = userEvent.setup()

    render(<UploadStep onFileReady={vi.fn()} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['jpg-binary'], 'factura.jpg', { type: 'image/jpeg' })

    await user.upload(input, file)

    expect(screen.getByRole('button', { name: 'Continuar' })).toBeEnabled()
  })

  it('clears the file and preview when delete is clicked', async () => {
    const user = userEvent.setup()

    render(<UploadStep onFileReady={vi.fn()} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['jpg-binary'], 'factura.jpg', { type: 'image/jpeg' })

    await user.upload(input, file)
    await user.click(screen.getByRole('button', { name: 'Eliminar archivo' }))

    expect(screen.queryByAltText('Vista previa de factura.jpg')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled()
  })
})
