import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../service/Service";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");

  // Status colors
  const statusColors = {
    CREATED: "#3b82f6",
    PICKED_UP: "#8b5cf6",
    IN_TRANSIT: "#f97316",
    DELIVERED: "#22c55e",
    CANCELLED: "#ef4444",
  };

  const validTransitions = {
    CREATED: ["PICKED_UP", "CANCELLED"],
    PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
    IN_TRANSIT: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  /* =========================
     LOAD ORDER BY ID
     ========================= */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /* =========================
     UPDATE ORDER STATUS
     ========================= */
  const handleStatusUpdate = async () => {
    if (!newStatus) {
      alert("Select a status");
      return;
    }

    const currentStatus = order.status.toUpperCase();
    const nextStatus = newStatus.toUpperCase();

    if (!validTransitions[currentStatus].includes(nextStatus)) {
      alert(`Invalid status transition from ${currentStatus} to ${nextStatus}`);
      return;
    }

    try {
      // Call backend API
      const res = await updateOrderStatus(order.id, nextStatus);
      setOrder(res.data);
      setNewStatus("");
      alert("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <h3>Order not found</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order Details</h2>

      <p><b>Order ID:</b> {order.id}</p>
      <p><b>Customer:</b> {order.customer}</p>
      <p><b>Merchant:</b> {order.merchant}</p>
      <p>
        <b>Current Status:</b>{" "}
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: statusColors[order.status],
            marginRight: "8px",
          }}
        />
        {order.status}
      </p>
      <p><b>Created At:</b> {new Date(order.createdAt).toLocaleString()}</p>
      <p><b>Last Updated:</b> {new Date(order.updatedAt).toLocaleString()}</p>

      <hr />

      <h3>Update Status</h3>
      <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
        <option value="">Select Status</option>
        <option value="CREATED">CREATED</option>
        <option value="PICKED_UP">PICKED_UP</option>
        <option value="IN_TRANSIT">IN_TRANSIT</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <button onClick={handleStatusUpdate} style={{ marginLeft: "10px" }}>
        Update
      </button>

      <hr />

      <h3>Status History</h3>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Status</th>
            <th>Time</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {order.history && order.history.map((h, index) => (
            <tr key={index}>
              <td>
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: statusColors[h.status],
                    marginRight: "8px",
                  }}
                />
                {h.status}
              </td>
              <td>{new Date(h.time).toLocaleString()}</td>
              <td>{h.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <Link to="/dashboard">⬅ Back to Dashboard</Link>
    </div>
  );
}

export default OrderDetails;
