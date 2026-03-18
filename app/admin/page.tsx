"use client";

import { useEffect, useState, useCallback } from "react";
import { Order } from "@/lib/types";

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stock, setStock] = useState({ available: 0, total: 92 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, stockRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/stock"),
      ]);
      const ordersData = await ordersRes.json();
      const stockData = await stockRes.json();
      setOrders(ordersData.orders || []);
      setStock(stockData);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (orderId: string) => {
    if (!confirm("Weet je zeker dat je deze bestelling wilt verwijderen?")) return;

    setDeleting(orderId);
    try {
      const res = await fetch(`/api/order?id=${orderId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setStock((prev) => ({ ...prev, available: data.available }));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(null);
    }
  };

  const totalFlessen = orders.reduce((sum, o) => sum + o.aantal, 0);
  const totalBedrag = orders.reduce((sum, o) => sum + o.totaal, 0);

  return (
    <div className="min-h-screen bg-[#1B2444] text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-playfair text-3xl text-[#D4A843] mb-2">
          Admin — Limoncello Orders
        </h1>
        <p className="text-[#B8C0D4] text-sm mb-8">
          Tavola Rotonda 92
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[rgba(27,36,68,0.8)] border border-[rgba(212,168,67,0.3)] rounded-xl p-4 text-center">
            <p className="text-[#B8C0D4] text-xs uppercase tracking-wider mb-1">Beschikbaar</p>
            <p className="font-playfair text-3xl text-[#D4A843] font-bold">
              {loading ? "..." : stock.available}
              <span className="text-lg text-[#B8C0D4]">/{stock.total}</span>
            </p>
          </div>
          <div className="bg-[rgba(27,36,68,0.8)] border border-[rgba(212,168,67,0.3)] rounded-xl p-4 text-center">
            <p className="text-[#B8C0D4] text-xs uppercase tracking-wider mb-1">Verkocht</p>
            <p className="font-playfair text-3xl text-white font-bold">
              {loading ? "..." : totalFlessen}
            </p>
          </div>
          <div className="bg-[rgba(27,36,68,0.8)] border border-[rgba(212,168,67,0.3)] rounded-xl p-4 text-center">
            <p className="text-[#B8C0D4] text-xs uppercase tracking-wider mb-1">Omzet</p>
            <p className="font-playfair text-2xl text-[#D4A843] font-bold">
              {loading ? "..." : `€${totalBedrag.toFixed(2).replace(".", ",")}`}
            </p>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-lg text-white mb-4">
          Bestellingen ({orders.length})
        </h2>

        {loading ? (
          <p className="text-[#B8C0D4]">Laden...</p>
        ) : orders.length === 0 ? (
          <p className="text-[#B8C0D4]">Nog geen bestellingen.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[rgba(27,36,68,0.8)] border border-[rgba(212,168,67,0.2)] rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-white font-medium truncate">{order.naam}</p>
                    <span className="text-[#D4A843] font-bold whitespace-nowrap">
                      {order.aantal}x
                    </span>
                    <span className="text-[#D4A843] whitespace-nowrap">
                      €{order.totaal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#B8C0D4] text-xs">
                    <span>{order.telefoon}</span>
                    <span className="truncate">{order.email}</span>
                    <span>
                      {new Date(order.timestamp).toLocaleString("nl-NL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(order.id)}
                  disabled={deleting === order.id}
                  className="px-3 py-1.5 rounded-lg bg-[#E74C3C]/20 border border-[#E74C3C]/30 text-[#E74C3C] text-sm hover:bg-[#E74C3C]/30 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {deleting === order.id ? "..." : "Verwijder"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={() => { setLoading(true); fetchData(); }}
          className="mt-6 px-4 py-2 rounded-lg border border-[rgba(212,168,67,0.3)] text-[#D4A843] text-sm hover:bg-[rgba(212,168,67,0.1)] transition-colors"
        >
          Ververs
        </button>
      </div>
    </div>
  );
}
