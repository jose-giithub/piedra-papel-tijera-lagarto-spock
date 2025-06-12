# 🚀 Despliegue en Producción

**Autor**: Jose Rodríguez  

## Redes sociales 🌐

**Portfolio**🔗[Enlace portfolio:](https://portfolio.jose-rodriguez-blanco.es)
**LinkedIn**🔗[Enlace LinkedIn:](https://www.linkedin.com/in/joseperfil/)
**GitHub**🔗[Enlace GitHub:](https://github.com/jose-giithub)

Guía paso a paso para desplegar el juego de Piedra, Papel, Tijeras, Lagarto, Spock en tu servidor usando Docker y Nginx Proxy Manager.

## 🚧 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Servidor VPS basado en Linux
- ✅ Dominio o subdominio configurados y que apuntes al ip de tu servidor
- ✅ Usuario no root con permisos sudo y docker
- ✅ Docker instalado y funcionando
- ✅ Nginx Proxy Manager configurado y operativo
- ✅ Aplicación web desarrollada y testeada en local

> 💡 **Tip**: Puedes encontrar información sobre la configuración inicial del VPS en:

- Documento Drive

🔗[Configurar VPS desde 0 paso a paso, tutorial Drive:](https://docs.google.com/document/d/1RMoX8kUR3lRntgdGNtjpnFPkNULrNoSefXUzDBEabOE/edit?usp=sharing)

- Tutorial en GhiHab

🔗[Configurar VPS desde 0 paso a paso, tutorial GitHab:](https://github.com/jose-giithub/vps-demo/tree/main)


## 📂 Estructura del Proyecto

Asegúrate de que tu proyecto tenga esta estructura:

```
📂juegopiedrapapel/
├── 📂node_modules
├── 📄Dockerfile
├── 📄docker-compose.yaml
├── 📄package.json
├── 📄package-lock.json
├── 📄server.js
└── 📂public/
    ├── 📄index.html
    ├── 📂CSS/
    │   └── 📄styles.css
    └── 📂JS/
        └── 📄main.js
```

## 🛠️ Pasos de Instalación

### 1. Preparar el Directorio

```bash
cd /home/jose/servers
mkdir juegopiedrapapel
cd juegopiedrapapel
```

### 2. Configurar Docker

Los archivos necesarios están incluidos en este repositorio:

- **`docker-compose.yaml`**: Configuración del contenedor
- **`Dockerfile`**: Imagen base de Node.js 18
- **`server.js`**: Servidor configurado para producción

> ⚠️ **Importante**: El archivo `server.js` ya está configurado para funcionar en producción. Si has estado trabajando en local, asegúrate de usar la versión para local.

### 3. Archivos Necesarios

Copia todos los archivos del repositorio al directorio del servidor:

- `package.json` y `package-lock.json`
- Directorio `public/` completo con todos sus archivos
- ⚠️ No copies `node_modules` (Docker lo generará automáticamente cuando subas el contenedor)

### 4. Configuración de WebSocket

El archivo `main.js` ya incluye la configuración automática para WebSocket que funciona tanto en desarrollo como en producción:

```javascript
// Detección automática del protocolo
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const servidor = new WebSocket(`${protocol}//${window.location.host}`);
```

## 🚀 Levantar el Contenedor

Una vez que todos los archivos estén en su lugar:

```bash
cd /home/jose/servers/juegopiedrapapel
docker compose up -d --build
```

## 🌐 Configurar Nginx Proxy Manager

1. **Acceder a Nginx Proxy Manager**: `http://IP-DEL-SERVIDOR:81`

2. **Crear nuevo Proxy Host**:
   - **Domain Names**: `tu.subdominio.es`
   - **Forward Hostname/IP**: `nodejs-app-piedraPapel`
   - **Forward Port**: `3000`
   - **Scheme**: `http`

3. **Configuraciones importantes**:
   - ✅ **Block Common Exploits**: Activado
   - ✅ **Websocket Support**: Activado **(🚨Crítico para el funcionamiento)**

4. **SSL (Recomendado)**:
   - ✅ **SSL Certificate**: Activado
   - ✅ **Force SSL**: Activado  
   - ✅ **HTTP/2 Support**: Activado

## ✅ Verificar el Despliegue

Una vez configurado, verifica que todo funcione:

- **🌐**: `http://tu.subdominio.es` 

## 🔧 Comandos Útiles

```bash
# Ver logs del contenedor
docker logs nodejs-app-piedraPapel

# Reiniciar el contenedor
docker restart nodejs-app-piedraPapel

# Parar y eliminar el contenedor
docker compose down

# Reconstruir y levantar
docker compose up -d --build
```

## ⚠️ Notas Importantes

- El juego solo permite **2 jugadores simultáneos**
- Asegúrate de que **Websocket Support** esté activado en Nginx Proxy Manager
- El contenedor se reiniciará automáticamente si falla (`restart: unless-stopped`)
- Todos los archivos estáticos deben estar en el directorio `public/`

## 🎮 ¿Listo para Jugar?

Una vez desplegado, comparte la URL con un amigo y ¡que comience la batalla de Piedra, Papel, Tijeras, Lagarto, Spock! 🦎🖖