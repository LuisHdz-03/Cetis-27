import { TopTabsLayout } from "@/components/TopTabsLayout";
import React from "react";

export default function InicioLayout() {
  return (
    <TopTabsLayout
      screens={[
        { name: "asistencias", title: "Asistencias" },
        { name: "reportes", title: "Reportes" },
      ]}
      initialRouteName="asistencias"
    />
  );
}
