import { createBrowserRouter, RouterProvider } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
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
  {
    path: '/login',
    element: <LoginPage />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
