# Security Specification — A.S Imports Variedades

## Data Invariants
1. Somente administradores verificados (`email_verified == true` e presentes em `admins/{uid}` ou e-mail principal `alextuber75@gmail.com`) podem criar, editar ou excluir documentos em `siteContent`, `categories`, `products` e `admins`.
2. Visitantes públicos podem ler (`get` / `list`) apenas `siteContent`, `categories` e `products` para visualizar o site institucional e a vitrine.
3. A coleção `admins` contém PII (`email`) e só pode ser lida ou modificada por administradores verificados (`isAdmin()`).
4. Todos os documentos passam por validação estrita de chaves (`hasAll` + `hasOnly`), tipos, limites de tamanho e IDs alfanuméricos válidos (`^[a-zA-Z0-9_-]+$`).

## Dirty Dozen Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated write to `products/prod-1`.
2. Signed-in non-admin user trying to create a product in `products/prod-hack`.
3. Signed-in user with `email_verified: false` matching admin email trying to update `siteContent/main`.
4. Non-admin user trying to read `admins/{uid}` (PII isolation).
5. Non-admin user trying to add themselves to `admins/{uid}` (Privilege escalation).
6. Admin sending shadow/ghost field (`isSuperAdmin: true`) in `products` create/update.
7. Admin creating a `Product` with missing required field `brand`.
8. Admin creating a `Product` with invalid `categoryId` containing spaces or slashes (`"cat/invalid"`).
9. Admin creating a `Product` with `name` exceeding 140 characters.
10. Admin creating a `Category` with `sortOrder` as a string instead of number.
11. Admin creating `SiteContent` with `whyReasons` array exceeding 10 items.
12. Unauthenticated or non-admin delete on `categories/{id}`.
