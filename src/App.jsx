import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import OrderDetails from "./components/OrderDetails";
import Lloginn from "./components/Lloginn";
import Header from "./components/Header";
import CompletedOrders from "./components/CompletedOrders";

function App() {
  // Orders state (later can move to Spring Boot backend)
  const [orders, setOrders] = useState([
    {
      id: "101",
      customer: "Akhil",
      contact: "9999999999",
      merchant: "M001",
      status: "CREATED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          status: "CREATED",
          time: new Date().toISOString(),
          source: "SYSTEM",
        },
      ],
    },
    {
      id: "102",
      customer: "Rahul",
      contact: "8888888888",
      merchant: "M002",
      status: "IN_TRANSIT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          status: "IN_TRANSIT",
          time: new Date().toISOString(),
          source: "SYSTEM",
        },
      ],
    },
  ]);

  const [nextId, setNextId] = useState(103);

  // AUTH STATE (SINGLE ADMIN)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      {/* HEADER */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={<Lloginn setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard
                orders={orders}
                setOrders={setOrders}
                nextId={nextId}
                setNextId={setNextId}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* COMPLETED ORDERS */}
        <Route
          path="/completed-orders"
          element={
            isLoggedIn ? (
              <CompletedOrders orders={orders} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ORDER DETAILS */}
        <Route
          path="/order/:id"
          element={
            isLoggedIn ? (
              <OrderDetails orders={orders} setOrders={setOrders} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
