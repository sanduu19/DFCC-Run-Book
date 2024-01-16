import "./App.css"
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import MainLayout from "./components/MainLayout"
import UserLayout from "./components/UserLayout"
import UserLogin from "./components/UserLogin";
import Home from "./components/Home";
import Sheet from "./components/Sheet";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<UserLogin />}/>
      </Route>

      <Route path="user" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="sheet" element={<Sheet />} />
      </Route>
    </>,
  ),
)

function App() {
  return <RouterProvider router={router} />
}

export default App
