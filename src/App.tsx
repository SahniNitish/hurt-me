import { Navigate, Route, Routes } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { BudgetPage } from "./pages/BudgetPage";
import { HomePage } from "./pages/HomePage";
import { TodoPage } from "./pages/TodoPage";
import { WorkoutsPage } from "./pages/WorkoutsPage";

export default function App() {
  return (
    <div className="min-h-[100dvh] font-body text-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}