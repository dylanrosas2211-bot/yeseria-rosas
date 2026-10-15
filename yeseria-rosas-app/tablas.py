from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship

class Base(DeclarativeBase):
    pass

class Especialidad(Base):
    __tablename__ = "Especialidad"
    id_especialidad = Column(Integer, primary_key=True, autoincrement=True)
    modalidad_pago = Column(String(100))

    trabajadores = relationship("Trabajadores", back_populates="especialidad")


class Responsable(Base):
    __tablename__ = "Responsable"
    id_responsable = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100))
    telefono = Column(String(50))

    obras = relationship("Obra", back_populates="responsable")


class Obra(Base):
    __tablename__ = "Obra"
    id_obra = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100))
    direccion = Column(String(255))
    precio_metro_cliente = Column(Float)
    estado = Column(String(50))
    id_responsable = Column(Integer, ForeignKey("Responsable.id_responsable"))

    responsable = relationship("Responsable", back_populates="obras")
    asistencias = relationship("Asistencia", back_populates="obra")
    pagos = relationship("PagosTrabajadores", back_populates="obra")
    adelantos = relationship("AdelantosPagos", back_populates="obra")
    producciones = relationship("ProduccionMetros", back_populates="obra")
    maquinas = relationship("Maquinas", back_populates="obra")
    ingresos = relationship("Ingresos", back_populates="obra")


class Trabajadores(Base):
    __tablename__ = "Trabajadores"
    id_trabajador = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100))
    tarifa_personal = Column(Float)
    id_especialidad = Column(Integer, ForeignKey("Especialidad.id_especialidad"))

    especialidad = relationship("Especialidad", back_populates="trabajadores")
    asistencias = relationship("Asistencia", back_populates="trabajador")
    pagos = relationship("PagosTrabajadores", back_populates="trabajador")
    adelantos = relationship("AdelantosPagos", back_populates="trabajador")
    producciones = relationship("ProduccionMetros", back_populates="trabajador")


class Asistencia(Base):
    __tablename__ = "Asistencia"
    id_asistencia = Column(Integer, primary_key=True, autoincrement=True)
    id_trabajador = Column(Integer, ForeignKey("Trabajadores.id_trabajador"))
    id_obra = Column(Integer, ForeignKey("Obra.id_obra"))
    fecha = Column(String(50))
    dias_trabajados = Column(Float)
    precio_dia_aplicado = Column(Float)

    trabajador = relationship("Trabajadores", back_populates="asistencias")
    obra = relationship("Obra", back_populates="asistencias")


class PagosTrabajadores(Base):
    __tablename__ = "Pagos_Trabajadores"
    id_pago = Column(Integer, primary_key=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("Obra.id_obra"))
    id_trabajador = Column(Integer, ForeignKey("Trabajadores.id_trabajador"))
    fecha = Column(String(50))
    descripcion = Column(Text)
    monto = Column(Float)

    obra = relationship("Obra", back_populates="pagos")
    trabajador = relationship("Trabajadores", back_populates="pagos")


class AdelantosPagos(Base):
    __tablename__ = "Adelantos_Pagos"
    id_adelanto = Column(Integer, primary_key=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("Obra.id_obra"))
    id_trabajador = Column(Integer, ForeignKey("Trabajadores.id_trabajador"))
    monto = Column(Float)
    fecha = Column(String(50))

    obra = relationship("Obra", back_populates="adelantos")
    trabajador = relationship("Trabajadores", back_populates="adelantos")


class ProduccionMetros(Base):
    __tablename__ = "Produccion_Metros"
    id_produccion = Column(Integer, primary_key=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("Obra.id_obra"))
    id_trabajador = Column(Integer, ForeignKey("Trabajadores.id_trabajador"))
    metros_propios = Column(Float)
    metros_cuadrados = Column(Float)
    fecha = Column(String(50))

    obra = relationship("Obra", back_populates="producciones")
    trabajador = relationship("Trabajadores", back_populates="producciones")


class Maquinas(Base):
    __tablename__ = "Maquinas"
    id_maquina = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100))
    marca_modelo = Column(String(100))
    estado = Column(String(50))
    id_obra = Column(Integer, ForeignKey("Obra.id_obra"))

    obra = relationship("Obra", back_populates="maquinas")


class Ingresos(Base):
    __tablename__ = "Ingresos"
    id_ingreso = Column(Integer, primary_key=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("Obra.id_obra"))
    monto = Column(Float)
    fecha = Column(String(50))

    obra = relationship("Obra", back_populates="ingresos")