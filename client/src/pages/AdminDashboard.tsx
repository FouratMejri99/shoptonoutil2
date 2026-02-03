import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/admin/employees");
  }, [setLocation]);

  return null;
}
