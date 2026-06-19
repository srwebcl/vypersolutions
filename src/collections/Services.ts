import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'division',
      type: 'select',
      required: true,
      options: [
        { label: 'Industrial', value: 'Industrial' },
        { label: 'Motorsport', value: 'Motorsport' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de Portada (Opcional)',
    },
    {
      name: 'short_description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}
