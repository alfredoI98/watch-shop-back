import { SetMetadata } from '@nestjs/common';

// Definimos la clave única con la que el Guard buscará el metadato
export const IS_PUBLIC_KEY = 'isPublic';

// Creamos el decorador personalizado @Public()
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
