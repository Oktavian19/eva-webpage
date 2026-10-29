import { createBrowserRouter, RouterProvider } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
