# Jobbi

Marketplace original de servicos locais criado por MatheusDevPrado.

## Objetivo

Conectar clientes que precisam de um servico com profissionais interessados em atender.

O Jobbi usa o mesmo tipo de modelo de mercado de plataformas de servicos: pedido do cliente, oportunidade para profissionais e monetizacao por acesso ao contato. A marca, visual, textos, regras e codigo sao proprios.

## Modelo

- Cliente pede servico gratis.
- Profissional visualiza oportunidades.
- Profissional usa moedas para desbloquear contato.
- A plataforma monetiza vendendo pacotes de moedas.

## Funcionalidades desta versao

- Cadastro de pedido com validacao de nome, WhatsApp, categoria, local, urgencia, orcamento e descricao.
- Cadastro de profissionais com validacao e bloqueio de WhatsApp duplicado.
- Listagem de oportunidades com busca e filtros.
- Carteira demo de moedas para simular compra e uso de saldo.
- Liberacao de contato do cliente somente depois de descontar moedas.
- Painel admin com resumo de leads, compras e ticket medio.
- Persistencia local no navegador para demonstracao.

## Pacotes demo

- Start: 800 moedas por R$ 70
- Pro: 1.400 moedas por R$ 110
- Max: 2.200 moedas por R$ 150

## Proximo passo para virar produto real

- Login de cliente e profissional.
- Banco de dados com Supabase.
- Pagamento real de pacotes com Mercado Pago, Asaas ou Stripe.
- Painel administrativo com aprovacao de pedidos.
- Termos de uso, politica de privacidade e consentimento LGPD.
- Envio automatico por WhatsApp ou e-mail.

## Como abrir

```bash
python3 -m http.server 4180 --bind 127.0.0.1
```

Depois acesse:

```text
http://127.0.0.1:4180
```
