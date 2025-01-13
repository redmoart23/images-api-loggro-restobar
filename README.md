# Aplicación de Procesamiento y Gestión de Imágenes

Esta aplicación proporciona una API REST para procesar y almacenar imágenes, incluyendo la conversión de imágenes JPG/JPEG a PNG, su almacenamiento en un bucket de AWS S3, y la gestión de metadatos en una base de datos MongoDB utilizando Prisma.

### Autor 
Rafael Eduardo Monsalve Arboleda

## Despliegue 
Este proyecto está desplegado en `NorthFlank`, el link es: https://example.com y la documentacion esta en https://example.com/api/docs


## Funcionalidades

1. **Subir y procesar imágenes**: Recibe imágenes JPG/JPEG, las convierte a PNG y las guarda en AWS S3.
2. **Consultar imágenes entre fechas**: Permite obtener una lista de imágenes subidas entre un rango de fechas.
3. **Estadísticas de imágenes**: Proporciona estadísticas sobre las imágenes subidas, agrupadas por fecha y hora.

## Requisitos

- Node.js >= 14
- MongoDB (local o en la nube)
- Cuenta de AWS (para el almacenamiento en S3)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/redmoart23/images-api-loggro-restobar.git
cd images-api-loggro-restobar
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar las variables de entorno
Copia el archivo .env.example a un nuevo archivo .env:

```bash
cp .env.example .env
```

Modifica las siguientes variables en el archivo .env para configurarlas correctamente:

- AWS_ACCESS_KEY_ID: Tu clave de acceso de AWS.
- AWS_SECRET_ACCESS_KEY: Tu clave secreta de AWS.
- AWS_REGION: La región de AWS donde se encuentra tu bucket S3.
- AWS_S3_BUCKET_NAME: El nombre del bucket de S3 donde se guardarán las imágenes.
- MONGODB_URI: La URI de conexión a tu base de datos MongoDB.
- PRISMA_LOG_LEVEL: Nivel de logs de Prisma (opcional).


### 4. Ejecutar la aplicación
Con todas las configuraciones listas, ejecuta la aplicación en modo desarrollo:

```bash
npm run start:dev
```
La API estará disponible en http://localhost:3000.


### 5. Acceder a la documentación de la API
La API está documentada utilizando Swagger. Para acceder a la documentación, abre el siguiente endpoint en tu navegador:

```bash
http://localhost:3000/api/docs
```


Aquí podrás ver todos los endpoints disponibles, sus parámetros y ejemplos de respuesta.

## Estructura de la aplicación
- **`/src:`** Contiene todo el código fuente de la API.
- **`/modules:`** Cada módulo (como imágenes, usuarios, etc.) tiene su propia carpeta.
- **`/services:`** Servicios que contienen la lógica de negocio.
- **`/controllers:`** Controladores que gestionan las solicitudes HTTP.
- **`/prisma:`** Archivos relacionados con Prisma y la base de datos.
- **`/prisma/schema.prisma:`** El esquema de Prisma que define el modelo de datos para MongoDB.


## Tecnologías utilizadas
- NestJS: Framework para construir aplicaciones backend escalables.
- Prisma: ORM para interactuar con la base de datos MongoDB.
- AWS S3: Servicio de almacenamiento en la nube para guardar las imágenes procesadas.
- MongoDB: Base de datos NoSQL para almacenar metadatos de las imágenes subidas.
- Swagger: Documentación interactiva de la API.

### Contribuciones

Si deseas contribuir al proyecto, puedes hacer un fork del repositorio y abrir un pull request. Asegúrate de que tu código esté bien documentado y cubierto por pruebas.

### **Explicación del contenido**:

1. **Instalación**: Instrucciones detalladas para clonar el repositorio, instalar dependencias y configurar las variables de entorno.
2. **Variables de Entorno**: Detalles sobre las variables necesarias para configurar AWS S3 y MongoDB, además de la referencia al archivo `.env.example`.
3. **Estructura de la Aplicación**: Se explica cómo está organizada la aplicación, mencionando los principales directorios.
4. **Swagger**: Se hace referencia a la documentación interactiva de la API utilizando Swagger, disponible en `/api/docs`.
5. **Tecnologías**: Se mencionan las principales tecnologías utilizadas, como NestJS, Prisma, AWS S3 y MongoDB.
6. **Contribuciones y Licencia**: Instrucciones sobre cómo contribuir y la licencia del proyecto.

