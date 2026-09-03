import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nombre de la Categoría',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción (Opcional)',
    },
  ],
}
