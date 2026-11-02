import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/toast';
import WeddingPage from './pages/weddingPage';

const mockResponse = (status, body) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });

const renderWeddingPage = () =>
  render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/wedding/w1']}>
        <Routes>
          <Route path="/wedding/:weddingId" element={<WeddingPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );

beforeEach(() => {
  global.fetch = jest.fn();
});

test('shows the couple and wedding details in the hero', async () => {
  fetch.mockReturnValue(
    mockResponse(200, {
      wedding: { _id: 'w1', title: 'Our Big Day', coupleName: 'Asha & Ravi', venue: 'Jaipur', date: '2026-12-12T00:00:00.000Z' },
      gifts: [],
      wishes: [],
    })
  );

  renderWeddingPage();

  expect(await screen.findByRole('heading', { name: 'Asha & Ravi' })).toBeInTheDocument();
  expect(screen.getByText('Our Big Day')).toBeInTheDocument();
  expect(screen.getByText(/Jaipur/)).toBeInTheDocument();
});

test('shows "Wedding not found" on 404', async () => {
  fetch.mockReturnValue(mockResponse(404, { message: 'Wedding not found' }));

  renderWeddingPage();

  expect(await screen.findByRole('heading', { name: 'Wedding not found' })).toBeInTheDocument();
});

test('booking a gift someone else already took shows the message and marks it booked', async () => {
  fetch
    .mockReturnValueOnce(
      mockResponse(200, {
        wedding: { _id: 'w1', title: 'Wedding', coupleName: 'A & B' },
        gifts: [{ _id: 'g1', name: 'Toaster', isBooked: false }, { _id: 'g2', name: 'Kettle', isBooked: false }],
        wishes: [],
      })
    )
    .mockReturnValueOnce(mockResponse(409, { message: 'Gift already booked' }));

  renderWeddingPage();

  fireEvent.click((await screen.findAllByText('Book Gift'))[0]);
  fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Sam' } });
  fireEvent.click(screen.getByText('Confirm Booking'));

  expect(await screen.findByText('Gift already booked')).toBeInTheDocument();
  await waitFor(() => expect(screen.getAllByText('Booked')).toHaveLength(1));
  // The list still renders both gifts.
  expect(screen.getByText('Toaster')).toBeInTheDocument();
  expect(screen.getByText('Kettle')).toBeInTheDocument();
});
