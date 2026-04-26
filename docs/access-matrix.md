# Matriz de Acesso — Equipe & Meu Perfil

Este documento descreve **o que cada tipo de usuário deve conseguir ver e fazer**
em `/equipe` e `/perfil`. Use como roteiro de QA manual após qualquer mudança
em RLS, papéis ou status de membros.

## Papéis e status

- **Status do perfil**: `pendente`, `ativo`, `inativo`.
- **Papéis (`user_roles`)**: `admin`, `coordenador`, `editor`, `voluntario`.
- `canEdit` = status `ativo` **e** papel em (`admin`, `coordenador`, `editor`).

## Página **/perfil** (Meu Perfil)

| Usuário | Vê seu perfil | Edita dados básicos | Edita dados ministeriais | Faz upload de avatar | Vê papéis | Vê status |
|---|---|---|---|---|---|---|
| Admin (ativo) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Coordenador (ativo) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor (ativo) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Voluntário (ativo) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Voluntário (pendente) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (vê alerta "aguardando aprovação") |

**Regras travadas no banco** (RLS + WITH CHECK em `profiles`):
- Nenhum usuário comum consegue alterar o próprio `status` — apenas Admin altera status alheio.
- Nenhum usuário comum consegue alterar `user_roles` — apenas Admin.

## Página **/equipe**

| Usuário | Lista todos os membros | Vê e-mail / telefone | Aprova pendentes | Altera papéis | Altera status | Remove membro |
|---|---|---|---|---|---|---|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (exceto si mesmo) |
| Coordenador | ✅ (somente leitura ampliada) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editor | ❌ vê só o próprio perfil na lista | — | ❌ | ❌ | ❌ | ❌ |
| Voluntário | ❌ vê só o próprio perfil na lista | — | ❌ | ❌ | ❌ | ❌ |

> Coordenadores leem `profiles` por RLS, mas a UI só expõe controles de edição
> quando `isAdmin === true`. Editores e voluntários, sem `SELECT` amplo,
> recebem apenas o próprio registro.

## Roteiro de QA manual

1. **Como Admin**
   - Abrir `/equipe`: lista completa carrega, contadores corretos.
   - Aprovar um pendente → status muda para `ativo`, aparece na lista filtrada.
   - Trocar papel para `coordenador` em outro usuário → toast "Papel atualizado".
   - Tentar remover a si mesmo → botão "Remover" não aparece.
2. **Como Coordenador**
   - `/equipe`: lista completa visível, **sem** controles de edição.
   - `/perfil`: edita dados próprios; status/papel não editáveis.
3. **Como Editor / Voluntário**
   - `/equipe`: lista mostra apenas o próprio cadastro.
   - `/perfil`: edita dados próprios; status fica travado.
   - Tentar via DevTools `supabase.from('profiles').update({status:'ativo'}).eq('id', meuId)`
     em conta `pendente` → erro de RLS.
4. **Erros**
   - Forçar uma falha (ex.: derrubar internet) e confirmar que o toast
     mostra mensagem genérica em português, **sem** trechos técnicos.
5. **Avatar**
   - Trocar foto em `/perfil` → preview atualiza.
   - Recarregar página: imagem ainda aparece (URL assinada do cache).
   - Esperar > 1h ou limpar cache (sair/entrar): nova URL assinada é gerada
     automaticamente sem erro 403.
