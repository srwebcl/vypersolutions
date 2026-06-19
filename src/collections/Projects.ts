import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
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
      name: 'service_id',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    {
      name: 'image_before',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'image_after',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
    },
  ],
}
