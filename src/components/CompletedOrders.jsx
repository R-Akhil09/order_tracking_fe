import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../service/Service";

function CompletedOrders() {
  const [orders, setOrders] = useState([]);
  const [merchantFilter, setMerchantFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* =========================
     LOAD COMPLETED ORDERS
     ========================= */
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  /* =========================
     STATUS COLORS
     ========================= */
  const statusColors = {
    CREATED: "#3b82f6",
    PICKED_UP: "#8b5cf6",
    IN_TRANSIT: "#f97316",
    DELIVERED: "#22c55e",
    CANCELLED: "#ef4444",
  };

  const completedStatuses = ["DELIVERED", "CANCELLED"];
  const completedOrders = orders.filter(o =>
    completedStatuses.includes(o.status)
  );

  const merchants = ["ALL", ...new Set(orders.map(o => o.merchant))];

  /* =========================
     FILTER LOGIC
     ========================= */
  const filteredOrders = completedOrders.filter(o => {
    const orderDate = new Date(o.createdAt);

    const dateMatch =
      (!fromDate || orderDate >= new Date(fromDate)) &&
      (!toDate || orderDate <= new Date(toDate));

    const merchantMatch =
      merchantFilter === "ALL" || o.merchant === merchantFilter;

    const statusMatch =
      statusFilter === "ALL" || o.status === statusFilter;

    const searchMatch =
      o.id.toString().includes(search) ||
      o.customer.toLowerCase().includes(search.toLowerCase());

    return dateMatch && merchantMatch && statusMatch && searchMatch;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Completed Orders</h2>

      {/* Filters */}
      <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
      <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />

      <input
        placeholder="Search Order / Customer"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <select value={merchantFilter} onChange={e => setMerchantFilter(e.target.value)}>
        {merchants.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="ALL">All Status</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <br /><br />

      {/* Orders Table */}
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Contact</th>
            <th>Merchant</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(o => (
            <tr key={o.id}>
              <td>
                <Link to={`/order/${o.id}`}>{o.id}</Link>
              </td>
              <td>{o.customer}</td>
              <td>{o.contact}</td>
              <td>{o.merchant}</td>
              <td>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: statusColors[o.status],
                    marginRight: "8px",
                  }}
                />
                {o.status}
              </td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>{new Date(o.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <Link to="/dashboard">⬅ Back to Dashboard</Link>
    </div>
  );
}

export default CompletedOrders;
