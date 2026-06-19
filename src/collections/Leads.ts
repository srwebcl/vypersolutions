import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'service_interest',
      type: 'select',
      options: [
        { label: 'Corte Plasma CNC', value: 'Corte Plasma CNC' },
        { label: 'Soldaduras Especiales', value: 'Soldaduras Especiales' },
        { label: 'Estructuras Metálicas', value: 'Estructuras Metálicas' },
        { label: 'Mecánica Automotriz', value: 'Mecánica Automotriz' },
        { label: 'Taller Motorsport', value: 'Taller Motorsport' },
        { label: 'Otro', value: 'Otro' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
}
