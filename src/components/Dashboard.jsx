import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getOrders,
  createOrder
} from "../service/Service";

function Dashboard({ orders, setOrders }) {
  const [showForm, setShowForm] = useState(false);
  const [merchantFilter, setMerchantFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* =========================
     LOAD ORDERS FROM BACKEND
     ========================= */
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Error loading orders", error);
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

  /* =========================
     FILTER LOGIC
     ========================= */
  const merchants = ["ALL", ...new Set(orders.map(o => o.merchant))];

  const activeStatuses = ["CREATED", "PICKED_UP", "IN_TRANSIT"];

  const filteredOrders = orders.filter(o => {
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

    return (
      activeStatuses.includes(o.status) &&
      dateMatch &&
      merchantMatch &&
      statusMatch &&
      searchMatch
    );
  });

  /* =========================
     CREATE ORDER (POST API)
     ========================= */
  const addOrder = async (customer, contact, merchant) => {
    try {
      const payload = {
        customer,
        contact,
        merchant,
        status: "CREATED"
      };

      await createOrder(payload);
      await loadOrders();
      setShowForm(false);
    } catch (error) {
      console.error("Create order failed", error);
      alert("Failed to create order");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders Dashboard</h2>

      {/* =========================
         FILTERS
         ========================= */}
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
        <option value="CREATED">CREATED</option>
        <option value="PICKED_UP">PICKED_UP</option>
        <option value="IN_TRANSIT">IN_TRANSIT</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <button onClick={() => setShowForm(true)}>+ Create Order</button>

      <Link to="/completed-orders">
        <button>View Completed Orders</button>
      </Link>

      <br /><br />

      {/* =========================
         ORDERS TABLE
         ========================= */}
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
                    marginRight: "8px"
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

      {/* =========================
         CREATE ORDER FORM
         ========================= */}
      {showForm && (
        <CreateOrderForm
          onAdd={addOrder}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

/* =========================
   CREATE ORDER FORM
   ========================= */
function CreateOrderForm({ onAdd, onClose }) {
  const [customer, setCustomer] = useState("");
  const [contact, setContact] = useState("");
  const [merchant, setMerchant] = useState("");

  const submit = () => {
    if (!customer || !contact || !merchant) {
      alert("Fill all fields");
      return;
    }

    if (contact.length !== 10) {
      alert("Contact number must be 10 digits");
      return;
    }

    onAdd(customer, contact, merchant);
  };

  return (
    <div style={{ border: "1px solid black", padding: "10px", marginTop: "15px" }}>
      <h4>Create Order</h4>

      <input placeholder="Customer Name" value={customer} onChange={e => setCustomer(e.target.value)} />
      <input
        type="tel"
        placeholder="Contact Number"
        value={contact}
        maxLength={10}
        onChange={e => setContact(e.target.value.replace(/\D/g, ""))}
      />
      <input placeholder="Merchant (M001)" value={merchant} onChange={e => setMerchant(e.target.value)} />

      <br /><br />

      <button onClick={submit}>Create</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default Dashboard;
