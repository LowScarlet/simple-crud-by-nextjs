import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sistem Informasi Koperasi Tekotok',
    short_name: 'SIKOTOK',
    description: 'Aplikasi Khusus Sistem Informasi Manajemen Perusahaan Koperasi Tekotok',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/logo222.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}