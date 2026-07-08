# Architecture Decision Records (ADR)

## ¿Qué es un ADR?

Un **Architecture Decision Record** (ADR) es un documento breve que registra una decisión arquitectónica relevante tomada durante el desarrollo del proyecto. Cada ADR describe el contexto en el que se tomó la decisión, la alternativa elegida, sus consecuencias y, cuando aplica, las opciones descartadas.

Su propósito no es repetir la documentación general de arquitectura, sino dejar constancia explícita de por qué se eligió un enfoque concreto en un momento determinado.

## ¿Por qué el proyecto utiliza ADR?

El proyecto adopta ADR para:

- documentar decisiones que no son evidentes solo leyendo el código
- preservar el razonamiento detrás de elecciones técnicas
- facilitar la incorporación de nuevos desarrolladores
- evitar reabrir debates ya resueltos sin contexto
- mantener trazabilidad de la evolución arquitectónica

Cuando una decisión tiene impacto estructural, conviene registrarla como ADR en lugar de depender únicamente de comentarios en el código o de memoria del equipo.

## Registro de decisiones

| Número  | Título                   | Estado   |
| ------- | ------------------------ | -------- |
| ADR-001 | Angular DI inside Domain | Accepted |

Nuevos ADR serán agregados conforme evolucionen las decisiones arquitectónicas del proyecto.
