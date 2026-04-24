import { extractInvoiceData, aiServiceConfig } from '../services/aiService'

describe('extractInvoiceData', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.stubEnv('VITE_AI_SERVICE_URL', 'https://ai.example.test')
    vi.stubEnv('VITE_AI_TIMEOUT_MS', '25')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  it('posts the file as multipart/form-data and returns mapped data', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          provider: { value: 'Proveedor Test', confidence: 0.9 },
          invoiceNumber: { value: 'F-100', confidence: 0.95 },
          date: { value: '2026-04-24', confidence: 0.88 },
          currency: { value: 'USD', confidence: 0.97 },
          subtotal: { value: 200, confidence: 0.91 },
          tax: { value: 36, confidence: 0.84 },
          total: { value: 236, confidence: 0.93 },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const file = new File(['demo'], 'invoice.png', { type: 'image/png' })
    const result = await extractInvoiceData(file)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://ai.example.test/extract',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
        signal: expect.any(AbortSignal),
      }),
    )

    const request = fetchMock.mock.calls[0]?.[1]
    expect(request?.body).toBeInstanceOf(FormData)
    expect((request?.body as FormData).get('invoice')).toBe(file)

    expect(result.provider.value).toBe('Proveedor Test')
    expect(result.tax.confidence).toBe(0.84)
  })

  it('throws a descriptive error for HTTP failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('server error', { status: 503 }),
    )

    const file = new File(['demo'], 'invoice.pdf', { type: 'application/pdf' })

    await expect(extractInvoiceData(file)).rejects.toThrow('Error del servicio de IA: 503')
  })

  it('handles timeouts with AbortController', async () => {
    vi.useFakeTimers()

    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async (_input, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'))
        })
      })
    })

    const file = new File(['demo'], 'invoice-timeout.pdf', { type: 'application/pdf' })
    const pendingRequest = extractInvoiceData(file)
    const expectation = expect(pendingRequest).rejects.toThrow(
      'La solicitud al servicio de IA excedio el tiempo de espera.',
    )

    await vi.advanceTimersByTimeAsync(25)

    await expectation
  })

  it('uses the default timeout when env config is missing or invalid', async () => {
    vi.stubEnv('VITE_AI_TIMEOUT_MS', 'invalid')

    const setTimeoutSpy = vi.spyOn(window, 'setTimeout')
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          provider: { value: 'Proveedor Test', confidence: 0.9 },
          invoiceNumber: { value: 'F-100', confidence: 0.95 },
          date: { value: '2026-04-24', confidence: 0.88 },
          currency: { value: 'USD', confidence: 0.97 },
          subtotal: { value: 200, confidence: 0.91 },
          tax: { value: 36, confidence: 0.84 },
          total: { value: 236, confidence: 0.93 },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    await extractInvoiceData(new File(['demo'], 'invoice.png', { type: 'image/png' }))

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), aiServiceConfig.DEFAULT_AI_TIMEOUT)
  })
})
