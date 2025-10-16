import { TopTabsLayout } from "@/components/TopTabsLayout";
import React from "react";

export default function CredencialesLayout() {
  return (
    <TopTabsLayout
      screens={[
        { name: "qr", title: "QR" },
        { name: "credencial", title: "Credencial" },
      ]}
      initialRouteName="qr"
    />
  );
}
