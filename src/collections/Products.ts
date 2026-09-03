import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título del Producto',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
      label: 'Slug (URL)',
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Producto Destacado',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mostrar este producto en el Inicio (Máx 6)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Categoría',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'relationship',
      relationTo: 'statuses',
      required: true,
      admin: {
        position: 'sidebar',
      },
      label: 'Estado',
    },
    {
      name: 'price',
      type: 'text',
      label: 'Precio (Opcional)',
      admin: {
        description: 'Ej: $1.500.000 CLP',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galería de Imágenes',
      labels: {
        singular: 'Imagen',
        plural: 'Imágenes',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción detallada',
    },
  ],
}
