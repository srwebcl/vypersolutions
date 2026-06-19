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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'Disponible',
      options: [
        { label: 'Disponible', value: 'Disponible' },
        { label: 'A Pedido', value: 'A Pedido' },
        { label: 'Agotado', value: 'Agotado' },
      ],
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
      name: 'features',
      type: 'array',
      label: 'Características principales',
      labels: {
        singular: 'Característica',
        plural: 'Características',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
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
      type: 'richText',
      label: 'Descripción detallada',
    },
  ],
}
