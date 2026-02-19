import os
import shutil
import subprocess
import sys

def run_command(command, cwd=None):
    print(f"Ejecutando: {command}")
    try:
        # Si es una lista, usar shell=False (más seguro y maneja mejor los espacios/argumentos)
        # Si es string, mantener shell=True (compatibilidad)
        use_shell = isinstance(command, str)
        subprocess.check_call(command, shell=use_shell, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"Error ejecutando '{command}': {e}")
        sys.exit(1)

def get_command_path(command):
    # Intentar encontrar en PATH
    path = shutil.which(command)
    if path:
        return command # Si está en PATH, usar el comando directo
    
    # Si no, buscar en rutas estándar de Node.js en Windows
    common_paths = [
        f"C:\\Program Files\\nodejs\\{command}.cmd",
        f"C:\\Program Files (x86)\\nodejs\\{command}.cmd",
        f"C:\\Program Files\\nodejs\\{command}.exe", # Fallback para node.exe
    ]
    
    for p in common_paths:
        if os.path.exists(p):
            print(f"Comando '{command}' no encontrado en PATH. Usando ruta absoluta: {p}")
            return p # Devolver ruta SIN comillas para uso en lista
            
    return command 
    

def setup_nextjs():
    # 1. Definir nombre temporal para la instalación
    # Npm no permite guiones bajos al inicio
    temp_app_name = "temp-next-app"
    
    # Asegurar que Node.js esté en el PATH para subprocesos
    nodejs_path = r"C:\Program Files\nodejs"
    if nodejs_path not in os.environ["PATH"]:
        print(f"Añadiendo {nodejs_path} al PATH del proceso.")
        os.environ["PATH"] += os.pathsep + nodejs_path
    
    npx_cmd = get_command_path("npx")
    npm_cmd = get_command_path("npm")
    
    if os.path.exists("package.json"):
        print("package.json ya existe. Saltando creación de proyecto Next.js.")
    else:
        print("Inicializando proyecto Next.js en carpeta temporal...")
        # 2. Crear app en subcarpeta
        if os.path.exists(temp_app_name):
            print(f"Carpeta temporal {temp_app_name} encontrada. Saltando creación.")
        else:
            # Usar npm init next-app es más robusto que npx directo a veces
            # npm init next-app transforma args a create-next-app
            # En Windows, ejecutar .cmd requiere shell=True O invocar cmd /c explícitamente si shell=False
            cmd_create = ["cmd", "/c", npm_cmd,
                "init",
                "-y", # Forzar yes a npm init (instalar paquete si falta)
                "next-app",
                temp_app_name,
                "--", # Separador de args para npm init vs el paquete
                "--yes",
            "--typescript",
            "--tailwind",
            "--eslint",
            "--app",
            "--src-dir",
            "--import-alias", "@/*",
            "--use-npm",
            "--no-git"
        ]
        run_command(cmd_create)

        # 3. Mover archivos a la raíz
        print("Moviendo archivos a la raíz...")
        for item in os.listdir(temp_app_name):
            source = os.path.join(temp_app_name, item)
            destination = os.path.join(".", item)
            
            if os.path.exists(destination):
                # Si es un directorio y ya existe (ej: .gitignore), podríamos querer fusionar o saltar.
                # Para create-next-app, los conflictos suelen ser .gitignore o README.
                # Vamos a reemplazar el .gitignore de next sobre el nuestro si es necesario, 
                # o mejor, leemos el contenido y lo anexamos si fuera crítico.
                # En este caso, simplemente si existe, lo dejamos (prioridad al entorno agente)
                # EXCEPTO si es package.json (que no debería existir por el check previo).
                print(f"Advertencia: {item} ya existe en la raíz. Se mantiene la versión original.")
                if os.path.isdir(source):
                     shutil.rmtree(source) # Limpiar
                else:
                     os.remove(source)
            else:
                shutil.move(source, destination)

        # 4. Limpiar carpeta temporal
        os.rmdir(temp_app_name)
        print("Estructura base de Next.js movida exitosamente.")

    # 5. Instalar dependencias adicionales
    print("Instalando dependencias del stack (Supabase, Clerk, UI, AI)...")
    dependencies = [
        "@supabase/ssr",
        "@supabase/supabase-js",
        "@clerk/nextjs",
        "lucide-react",
        "framer-motion",
        "clsx",
        "tailwind-merge",
        "resend",
        "@anthropic-ai/sdk"
    ]
    
    # Construir comando como lista
    # Usar cmd /c para .cmd en Windows con shell=False
    cmd_install = ["cmd", "/c", npm_cmd, "install"] + dependencies
    run_command(cmd_install)
    
    print("Setup completado exitosamente.")

if __name__ == "__main__":
    setup_nextjs()
