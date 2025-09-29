# 🗓️ Working Days API

API REST desarrollada en TypeScript con Express para calcular fechas hábiles en Colombia, sumando días y horas laborales a una fecha base. Ideal para procesos bancarios, bots RPA y automatización de flujos con reglas de negocio.

---

## 🚀 Características

- Cálculo de fechas hábiles según calendario colombiano
- Soporte para días y horas laborales
- Validación automática de parámetros
- Arquitectura modular y escalable
- Despliegue listo para Render

---

## 🌐 Uso en Producción (Entrega)

La API está desplegada y lista para usar en la siguiente URL pública:

**Endpoint principal:**
```
https://working-days-api-o-capta.onrender.com/calculate
```

**Ejemplo de uso:**
```
https://working-days-api-o-capta.onrender.com/calculate?days=2&hours=4&date=2025-09-29T08:00:00-05:00
```

**Respuesta de éxito:**
```json
{ "date": "2025-10-01T17:00:00.000Z" }
```

**Respuesta de error (sin parámetros):**
```json
{ "error": "InvalidParameters", "message": "Se debe proporcionar al menos \"days\" o \"hours\"." }
```

---

## 📦 Instalación local (opcional)

```bash
git clone https://github.com/camilo961009/Capta.git
cd Capta/working-days-api
npm install
npm run build
npm start
```
La API estará disponible en `http://localhost:10000/calculate`.

---

## 📑 Contrato de la API

- **GET /calculate**
  - Parámetros:
    - `days`: número de días hábiles a sumar (opcional)
    - `hours`: número de horas hábiles a sumar (opcional)
    - `date`: fecha base en formato UTC ISO 8601 (opcional)
  - Respuesta:
    - Éxito: `{ "date": "fecha_calculada_en_UTC" }`
    - Error: `{ "error": "InvalidParameters", "message": "Detalle del error" }`

---

## 🔗 Repositorio

[https://github.com/camilo961009/Capta](https://github.com/camilo961009/Capta)