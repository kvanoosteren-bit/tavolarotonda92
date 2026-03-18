"use client";

import { useEffect, useState, useCallback } from "react";
import Hero from "@/components/Hero";
import StockCounter from "@/components/StockCounter";
import OrderForm from "@/components/OrderForm";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";
import { StockResponse } from "@/lib/types";

export default function Home() {
  const [stock, setStock] = useState<StockResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch("/api/stock");
      const data = await res.json();
      if (typeof data.available === "number" && typeof data.total === "number") {
        setStock(data);
      } else {
        setStock({ available: 90, total: 92 });
      }
    } catch (error) {
      console.error("Failed to fetch stock:", error);
      setStock({ available: 90, total: 92 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const handleOrderSuccess = (newAvailable: number) => {
    setStock({ available: newAvailable, total: 92 });
  };

  return (
    <main className="flex-1">
      <Hero />
      <StockCounter
        available={stock?.available ?? 0}
        total={stock?.total ?? 92}
        loading={loading}
      />
      <OrderForm
        available={stock?.available ?? 0}
        onOrderSuccess={handleOrderSuccess}
      />
      <VideoSection />
      <Footer />
    </main>
  );
}
