import { Prisma } from '../../generated/prisma/client';

// Modulos disponibles en el sistema
const MODULES = [
  { name: 'pos', label: 'Punto de Venta' },
  { name: 'inventory', label: 'Inventario' },
  { name: 'kitchen', label: 'Cocina' },
  { name: 'products', label: 'Productos' },
  { name: 'reports', label: 'Reportes' },
  { name: 'users', label: 'Usuarios' },
  { name: 'settings', label: 'Configuración' },
  { name: 'payments', label: 'Facturacion' },
  { name: 'rbac', label: 'Gestion de Roles y Permisos' },
];

export type ModuleName = (typeof MODULES)[number]['name'];

export async function seedModules(tx: Prisma.TransactionClient) {
  const created = await Promise.all(
    MODULES.map((module) =>
      tx.module.upsert({
        where: { name: module.name },
        update: { label: module.label },
        create: { name: module.name, label: module.label },
      }),
    ),
  );

  console.log('Módulos del sistema creados');
  return Object.fromEntries(created.map((m) => [m.name, m.id]));
}

// Permisos disponibles para cada modulo
const PERMISSIONS: Array<{
  module: string;
  action: string;
  label: string;
}> = [
  // POS
  { module: 'pos', action: 'read', label: 'Ver órdenes y comandas' },
  { module: 'pos', action: 'write', label: 'Crear y editar órdenes' },
  { module: 'pos', action: 'delete', label: 'Cancelar órdenes' },
  { module: 'pos', action: 'manage', label: 'Gestión completa del POS' },

  // Cocina
  { module: 'kitchen', action: 'read', label: 'Ver pantalla KDS' },
  { module: 'kitchen', action: 'write', label: 'Actualizar estado de tickets' },
  { module: 'kitchen', action: 'manage', label: 'Gestión completa de cocina' },

  // Inventario
  { module: 'inventory', action: 'read', label: 'Ver stock e ingredientes' },
  { module: 'inventory', action: 'write', label: 'Registrar movimientos' },
  { module: 'inventory', action: 'delete', label: 'Eliminar registros' },
  { module: 'inventory', action: 'manage', label: 'Gestión completa' },

  // Productos
  { module: 'products', action: 'read', label: 'Ver catálogo' },
  { module: 'products', action: 'write', label: 'Crear y editar productos' },
  { module: 'products', action: 'delete', label: 'Eliminar productos' },
  { module: 'products', action: 'manage', label: 'Gestión completa' },

  // Reportes
  { module: 'reports', action: 'read', label: 'Ver reportes básicos' },
  { module: 'reports', action: 'manage', label: 'Ver todos los reportes' },

  // Usuarios
  { module: 'users', action: 'read', label: 'Ver usuarios' },
  { module: 'users', action: 'write', label: 'Crear y editar usuarios' },
  { module: 'users', action: 'delete', label: 'Desactivar usuarios' },
  { module: 'users', action: 'manage', label: 'Gestión completa de usuarios' },

  // RCBA
  { module: 'rbac', action: 'read', label: 'Ver rcba' },
  { module: 'rbac', action: 'write', label: 'Crear y editar rcba' },
  { module: 'rbac', action: 'delete', label: 'Desactivar rcba' },
  { module: 'rbac', action: 'manage', label: 'Gestión completa' },

  // Payments
  { module: 'payments', action: 'read', label: 'Ver facturacion' },
  { module: 'payments', action: 'write', label: 'Crear y editar facturas' },
  { module: 'payments', action: 'delete', label: 'Desactivar facturas' },
  { module: 'payments', action: 'manage', label: 'Gestión completa' },

  // Configuración
  { module: 'settings', action: 'read', label: 'Ver configuración' },
  { module: 'settings', action: 'manage', label: 'Modificar configuración' },
];

export async function seedPermissions(
  tx: Prisma.TransactionClient,
  moduleMap: Record<string, string>,
) {
  const created = await Promise.all(
    PERMISSIONS.map((perm) =>
      tx.permission.upsert({
        where: {
          moduleId_action: {
            moduleId: moduleMap[perm.module],
            action: perm.action,
          },
        },
        update: { label: perm.label },
        create: {
          moduleId: moduleMap[perm.module],
          action: perm.action,
          label: perm.label,
        },
      }),
    ),
  );

  console.log('Permisos del sistema creados');
  return Object.fromEntries(
    created.map((p, i) => [`${PERMISSIONS[i].module}:${p.action}`, p.id]),
  );
}

// Roles Predefinidos
export const ROLES: Array<{
  name: string;
  label?: string;
  description: string;
  permissions: string[];
}> = [
  {
    name: 'ADMIN',
    label: 'Administrador',
    description: 'Administrador con acceso completo a todas las funciones',
    permissions: [
      // Acceso manage a TODO
      'pos:manage',
      'kitchen:manage',
      'inventory:manage',
      'products:manage',
      'reports:manage',
      'users:manage',
      'payments:manage',
      'rcba:manage',
      'settings:manage',
    ],
  },
  {
    name: 'MANAGER',
    label: 'Gerente',
    description: 'Gerente con acceso limitado a ciertas funciones',
    permissions: [
      'pos:manage',
      'kitchen:manage',
      'inventory:manage',
      'products:manage',
      'reports:manage',
      'payments:manage',
      'rcba:manage',
      'users:read',
      'users:write',
      'settings:read',
    ],
  },
  {
    name: 'CASHIER',
    label: 'Cajero',
    description: 'Cajero — operación del POS y consulta de inventario',
    permissions: [
      'pos:read',
      'pos:write',
      'pos:delete',
      'kitchen:read',
      'inventory:read',
      'products:read',
      'reports:read',
      'payments:read',
      'payments:write',
    ],
  },
  {
    name: 'COOK',
    label: 'Cocinero',
    description: 'Cocinero — pantalla KDS y consulta de recetas',
    permissions: [
      'kitchen:read',
      'kitchen:write',
      'products:read',
      'inventory:read',
    ],
  },
  {
    name: 'WAITER',
    label: 'Mesero',
    description: 'Mesero — toma de órdenes y seguimiento',
    permissions: ['pos:read', 'pos:write', 'kitchen:read', 'products:read'],
  },
];

export async function seedRoles(
  tx: Prisma.TransactionClient,
  permissionMap: Record<string, string>,
) {
  const roleMap: Record<string, string> = {};

  for (const roleDef of ROLES) {
    const permissionIds = new Set<string>();

    for (const permKey of roleDef.permissions) {
      const [module, action] = permKey.split(':');
      if (action === 'manage') {
        const allModulePerms = Object.keys(permissionMap).filter((k) =>
          k.startsWith(`${module}:`),
        );
        allModulePerms.forEach((k) => {
          if (permissionMap[k]) permissionIds.add(permissionMap[k]);
        });
      } else {
        if (permissionMap[permKey]) {
          permissionIds.add(permissionMap[permKey]);
        }
      }
    }

    const permissionsData = Array.from(permissionIds).map((id) => ({
      permissionId: id,
    }));

    const role = await tx.role.upsert({
      where: { name: roleDef.name },
      update: {
        label: roleDef.label,
        description: roleDef.description,
        permissions: {
          deleteMany: {},
          create: permissionsData,
        },
      },
      create: {
        name: roleDef.name,
        label: roleDef.label,
        description: roleDef.description,
        permissions: {
          create: permissionsData,
        },
      },
    });

    console.log(
      `Rol ${roleDef.name} procesado con ${permissionsData.length} permisos.`,
    );
    roleMap[role.name] = role.id;
  }

  return roleMap;
}
