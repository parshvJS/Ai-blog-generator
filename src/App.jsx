import { Route, Router, Routes } from "react-router-dom"
import AiChat from "./pages/AiChat"
import Home from "./pages/Home"
import Root_layout from "./components/custom/Root_layout"

export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<Root_layout />}>
          <Route index path="/dashboard" element={<AiChat />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}
