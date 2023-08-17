import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Simulación de cómo podrías obtener métricas.
  private getMetrics() {
    return {
      totalRequestsLastHour: 1200,
      averageResponseTime: '250ms',
      totalErrorsLastHour: 5,
    };
  }

  getHello(): any {
    return {
      message: 'Welcome to XYZ API!',
      apiVersion: '1.0.1',
      lastUpdated: '2023-08-18',
      description: 'API to manage XYZ resources.',
      environment: 'production',
      documentation: {
        swaggerUrl: 'https://localhost/api/docs',
        generalDocsUrl: 'https://localhost/docs',
      },
      authentication: {
        method: 'JWT token',
        tokenInfoUrl: 'https://localhost/docs/auth',
      },
      serverTime: new Date().toISOString(),
      metrics: this.getMetrics(),
      contact: {
        name: 'Jane Smith',
        email: 'janesmith@example.com',
      },
      rateLimits: {
        maxRequestsPerHour: 5000,
        maxRequestsPerMinute: 100,
      },
      apis: {
        user: {
          list: 'https://localhost/user',
          details: 'https://localhost/user/:id',
          // ... puedes añadir más endpoints de 'user' si los tienes.
        },
        // Aquí puedes agregar otros endpoints si los tienes implementados.
        // Por ejemplo:
        // posts: {
        //   list: 'https://yourdomain.com/posts',
        //   details: 'https://yourdomain.com/posts/:id',
        // }
      },
    };
  }
}
