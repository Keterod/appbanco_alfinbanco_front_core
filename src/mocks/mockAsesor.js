const asesorDemo = {
  id: 'asesor-001',
  codigo: 'OFI001',
  nombres: 'Carlos',
  apellidos: 'Quispe Huamán',
  email: 'cquispe@bancoalfin.pe',
  agencia_id: 'ag-001',
  rol: 'asesor',
}

export const asesores = {
  'OFI001': asesorDemo,
  'OFI002': {
    id: 'asesor-002',
    codigo: 'OFI002',
    nombres: 'María',
    apellidos: 'López García',
    email: 'mlopez@bancoalfin.pe',
    agencia_id: 'ag-001',
    rol: 'asesor',
  },
  'OFI003': {
    id: 'asesor-003',
    codigo: 'OFI003',
    nombres: 'Juan',
    apellidos: 'Paredes Soto',
    email: 'jparedes@bancoalfin.pe',
    agencia_id: 'ag-002',
    rol: 'supervisor',
  },
}

export default asesorDemo
