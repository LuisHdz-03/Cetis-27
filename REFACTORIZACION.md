# Refactorización de Layouts - Reutilización de Código y Bluetooth Global

## 📁 Archivos Creados

### 1. `contexts/BluetoothContext.tsx`

**Propósito**: Manejar el estado del Bluetooth de forma global en toda la app.

**Características**:

- ✅ Estado compartido entre todas las pantallas (Inicio y Credenciales)
- ✅ El Bluetooth NO se reinicia al cambiar de tab
- ✅ Un solo punto de control para toda la lógica de Bluetooth
- ✅ Hook `useBluetooth()` para fácil acceso desde cualquier componente

```typescript
const { isEnabled, toggleBluetooth } = useBluetooth();
```

---

### 2. `components/BluetoothHeader.tsx`

**Propósito**: Componente reutilizable para el header con control de Bluetooth.

**Características**:

- ✅ Header con título "CETIS 27"
- ✅ Switch de Bluetooth que mantiene su estado
- ✅ Ícono que cambia según el estado (bluetooth / bluetooth-outline)
- ✅ Texto dinámico: "Encendido" / "Apagado"

---

### 3. `components/TopTabsLayout.tsx`

**Propósito**: Componente genérico para layouts con Material Top Tabs.

**Características**:

- ✅ Configuración centralizada de estilos de tabs
- ✅ Recibe array de screens como props
- ✅ Incluye automáticamente el BluetoothHeader
- ✅ SafeAreaView para dispositivos con notch

**Uso**:

```typescript
<TopTabsLayout
  screens={[
    { name: "asistencias", title: "Asistencias" },
    { name: "reportes", title: "Reportes" },
  ]}
  initialRouteName="asistencias"
/>
```

---

## 🔄 Archivos Modificados

### 1. `app/(tabs)/_layout.tsx`

**Cambio**: Envuelto en `<BluetoothProvider>`

- ✅ Ahora todos los tabs hijos tienen acceso al contexto de Bluetooth

### 2. `app/(tabs)/(inicio)/_layout.tsx`

**Antes**: ~60 líneas con lógica duplicada
**Ahora**: ~10 líneas usando `TopTabsLayout`

```typescript
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
```

### 3. `app/(tabs)/(credenciales)/_layout.tsx`

**Antes**: ~60 líneas con lógica duplicada
**Ahora**: ~10 líneas usando `TopTabsLayout`

```typescript
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
```

---

## ✨ Ventajas de esta Refactorización

### 🎯 Reutilización de Código

- **Antes**: ~120 líneas duplicadas entre ambos layouts
- **Ahora**: ~20 líneas en total (componente compartido de ~50 líneas)
- **Reducción**: ~70% menos código

### 🔌 Bluetooth Sincronizado

- ✅ El estado del Bluetooth se mantiene al cambiar entre tabs
- ✅ Si enciendes Bluetooth en "Inicio", sigue encendido en "Credenciales"
- ✅ NO hay interferencias entre vistas
- ✅ Un solo switch controla el estado global

### 🛠️ Mantenibilidad

- ✅ Cambios en el header se aplican a todas las pantallas automáticamente
- ✅ Estilos centralizados en `navStyles`
- ✅ Lógica de Bluetooth en un solo lugar
- ✅ Fácil agregar nuevas funcionalidades (conectar dispositivo BLE real)

### 🚀 Escalabilidad

- ✅ Fácil agregar más tabs usando el mismo componente
- ✅ Puedes agregar más pantallas solo definiendo el array de screens
- ✅ El contexto puede extenderse con más funcionalidades (dispositivo conectado, señal, etc.)

---

## 🔮 Próximos Pasos

### Para implementar Bluetooth real:

1. Instalar librería: `expo install expo-bluetooth` o similar
2. Modificar `BluetoothContext.tsx` en la función `toggleBluetooth()`:
   ```typescript
   const toggleBluetooth = async () => {
     if (!isEnabled) {
       // Conectar dispositivo
       await connectBluetoothDevice();
     } else {
       // Desconectar dispositivo
       await disconnectBluetoothDevice();
     }
     setIsEnabled(!isEnabled);
   };
   ```

### Para agregar más información:

```typescript
interface BluetoothContextType {
  isEnabled: boolean;
  toggleBluetooth: () => void;
  deviceName?: string; // Nombre del dispositivo conectado
  signalStrength?: number; // Fuerza de señal
  isConnecting: boolean; // Estado de conexión
}
```

---

## 📝 Ejemplo de Uso del Context

Si quieres usar el Bluetooth en cualquier otra pantalla:

```typescript
import { useBluetooth } from "@/contexts/BluetoothContext";

export default function MiPantalla() {
  const { isEnabled, toggleBluetooth } = useBluetooth();

  return (
    <View>
      <Text>Bluetooth está: {isEnabled ? "ON" : "OFF"}</Text>
      <Button onPress={toggleBluetooth} title="Toggle" />
    </View>
  );
}
```
