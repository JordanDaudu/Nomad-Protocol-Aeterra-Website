import { useLocation } from "wouter";
import { useEffect } from "react";

export default function SystemDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(`/systems/${params.id}`);
  }, [params.id, setLocation]);

  return null;
}
