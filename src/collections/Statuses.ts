import { CollectionConfig } from 'payload'

export const Statuses: CollectionConfig = {
  slug: 'statuses',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Estado (Ej: Disponible, A Pedido)',
    },
    {
      name: 'color',
      type: 'select',
      label: 'Color del Badge',
      options: [
        { label: 'Verde/Azul (Positivo)', value: 'positive' },
        { label: 'Amarillo/Naranja (Espera)', value: 'warning' },
        { label: 'Rojo (Negativo)', value: 'negative' },
      ],
      defaultValue: 'positive',
    },
  ],
}
