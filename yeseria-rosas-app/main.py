from dataBase import engine
from tablas import Base

if __name__ == "__main__":
    print("Conectando al servidor y creando las tablas en MySQL...")
    Base.metadata.create_all(engine)
    print("¡Listo! Las tablas fueron creadas exitosamente.")