insert into public.posts (title, slug, excerpt, content, cover_image_url, cover_image_alt, category_id, author_name, published_at, updated_content_at, status, reading_minutes, seo_title, seo_description, sources, tags, is_featured)
values
(
'Senhas seguras: como criar e guardar sem esquecer',
'senhas-seguras-como-criar-e-guardar',
'Senha boa é longa, única em cada serviço e guardada em lugar confiável. Veja um método simples de criar e organizar as suas.',
$md$**Em segundos:** use senhas longas, diferentes em cada site, ative a verificação em duas etapas e guarde tudo em um gerenciador de senhas. Isso resolve a maior parte do risco do dia a dia.

## Tamanho vale mais que símbolos

Uma frase longa é mais forte e mais fácil de lembrar do que uma palavra curta cheia de símbolos. Monte uma sequência de três ou quatro palavras que só fazem sentido para você, com pelo menos 16 caracteres.

Evite: nome de familiares, datas, time, placa do carro, sequências do teclado e trocas óbvias de letra por número.

## Nunca repita a senha principal

Quando um site sofre vazamento, criminosos testam aquela combinação em e-mail, banco e redes sociais. Senha repetida transforma um problema em vários. As contas mais críticas — e-mail, banco e loja de aplicativos — precisam de senhas exclusivas.

## Ative a verificação em duas etapas

É a proteção que mais compensa o esforço. Prefira, nesta ordem:

1. Chave de segurança física ou chave de acesso (passkey)
2. Aplicativo autenticador que gera códigos
3. Código por SMS, apenas quando não houver outra opção

## Use um gerenciador de senhas

Ele guarda tudo criptografado e preenche sozinho nos sites. Você memoriza apenas uma senha-mestra longa. Serve tanto um gerenciador dedicado quanto o recurso já embutido no seu navegador ou celular.

- Crie uma senha-mestra que você nunca usou em outro lugar.
- Ative a verificação em duas etapas do próprio gerenciador.
- Guarde o código de recuperação impresso, fora do computador.

## Sinais de que uma senha precisa ser trocada agora

- Você recebeu aviso de vazamento do serviço.
- Apareceu um acesso de local desconhecido.
- A mesma senha está em vários sites.
- Você digitou a senha em um computador público ou rede desconhecida.

## Cuidado com o pedido de urgência

Nenhum banco, loja ou rede social pede sua senha por telefone, e-mail ou mensagem. Pressa é a principal ferramenta do golpista — veja [como se proteger de golpes por Pix](/artigos/golpe-do-pix-como-se-proteger).$md$,
'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Fsenhas-seguras-como-criar-e-guardar.jpg',
'Pessoa digitando senha em notebook com cadeado na tela',
(select id from public.categories where slug = 'vida-digital'),
'Equipe EmSegundos',
'2026-09-11T12:00:00Z','2026-09-11T12:00:00Z','published',6,
'Senhas seguras: como criar e guardar bem',
'Método simples para criar senhas fortes, ativar a verificação em duas etapas e guardar tudo com segurança.',
'[{"name":"Cartilha de Segurança para Internet (CERT.br)","url":"https://cartilha.cert.br"}]'::jsonb,
array['segurança','senhas','privacidade'], false
),
(
'Golpe do Pix: como identificar e se proteger',
'golpe-do-pix-como-se-proteger',
'Os golpes mais comuns não invadem seu banco: eles convencem você a transferir. Veja os sinais de alerta e o que fazer se já pagou.',
$md$**Em segundos:** desconfie de qualquer urgência, confirme o nome e o CPF ou CNPJ do recebedor antes de concluir e nunca pague por links recebidos em mensagens. Se caiu no golpe, registre boletim de ocorrência e acione o banco imediatamente.

## Os golpes mais comuns

- **Falso parente:** mensagem de número desconhecido dizendo "troquei de celular" e pedindo dinheiro.
- **Falso funcionário do banco:** ligação avisando de transação suspeita e pedindo que você transfira para uma "conta segura". Banco nenhum faz isso.
- **Boleto ou QR Code adulterado:** cobrança que chega por e-mail ou mensagem com dados trocados.
- **Produto muito barato:** anúncio em rede social que só aceita Pix e desaparece após o pagamento.
- **Falso comprovante:** o "cliente" mostra uma imagem de pagamento que nunca entrou na conta.

## Como confirmar antes de pagar

1. Confira **nome e CPF/CNPJ do recebedor** na tela de confirmação. Se não bate com quem você espera pagar, pare.
2. Ligue para a pessoa **no número que você já tinha salvo**, nunca no novo.
3. Em compras, prefira formas com proteção ao consumidor e desconfie de pressa e desconto grande.
4. Cheque o pagamento recebido **no extrato do seu banco**, nunca no comprovante enviado por terceiros.

## Reduza o dano antes que aconteça

- Defina limites baixos para Pix, especialmente à noite.
- Use limites diferentes para o aplicativo do celular.
- Ative notificações de transação.
- Bloqueie o celular com senha forte e biometria.

## Se você já pagou

1. Acione o banco pelo aplicativo ou telefone oficial e peça o registro da contestação. O Banco Central prevê um mecanismo de devolução para casos de fraude, aplicado pelas instituições.
2. Registre boletim de ocorrência — a maioria dos estados aceita pela delegacia eletrônica.
3. Guarde prints, comprovantes, números e conversas.
4. Troque as senhas usadas naquele aparelho. Veja [como criar senhas seguras](/artigos/senhas-seguras-como-criar-e-guardar).

## Regra de ouro

Golpe precisa de pressa. Toda vez que alguém tenta acelerar sua decisão, desligue e confirme por outro canal.$md$,
'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Fgolpe-do-pix-como-se-proteger.jpg',
'Pessoa desconfiada olhando o celular com cartão na mão',
(select id from public.categories where slug = 'vida-digital'),
'Equipe EmSegundos',
'2026-09-12T12:00:00Z','2026-09-12T12:00:00Z','published',6,
'Golpe do Pix: como identificar e se proteger',
'Conheça os golpes mais comuns envolvendo Pix, os sinais de alerta e o que fazer se você já fez a transferência.',
'[{"name":"Banco Central do Brasil – Pix","url":"https://www.bcb.gov.br/estabilidadefinanceira/pix"}]'::jsonb,
array['segurança','pix','golpes','finanças'], true
),
(
'Celular sem espaço: como liberar memória de verdade',
'liberar-espaco-no-celular',
'Apagar fotos aleatórias não resolve. Veja a ordem que libera mais espaço com menos perda, começando pelo que ninguém olha.',
$md$**Em segundos:** comece pelo cache dos aplicativos e pelos vídeos e arquivos de mensagens, depois revise apps sem uso e por último trate as fotos. Essa ordem libera mais gigabytes e apaga menos coisa importante.

## 1. Veja onde o espaço está

Abra o menu de armazenamento do celular (Configurações › Armazenamento, no Android; Ajustes › Geral › Armazenamento, no iPhone). A lista mostra quais aplicativos ocupam mais. Quase sempre o topo é o aplicativo de mensagens e a galeria.

## 2. Limpe o que é descartável

- **Cache dos apps:** no Android, entre no app pelo armazenamento e toque em "Limpar cache".
- **Downloads antigos:** a pasta de downloads acumula PDFs, instaladores e imagens enviadas.
- **Mensagens:** vídeos e áudios recebidos em grupos costumam ser o maior vilão. Use a ferramenta de gerenciamento de armazenamento do próprio aplicativo para apagar os arquivos maiores.

## 3. Remova apps que você não abre

Desinstale o que está parado há meses. No iPhone, a opção "Remover app" apaga o aplicativo e mantém os documentos; "Descarregar" libera espaço preservando os dados para reinstalação.

## 4. Faça cópia das fotos antes de apagar

Envie para um serviço de nuvem ou copie para o computador e confirme que os arquivos abriram no destino. Só então apague do celular. Lembre de esvaziar a lixeira da galeria — ela guarda os arquivos por cerca de 30 dias.

## 5. Ajuste para não encher de novo

- Desative o download automático de mídia em grupos.
- Grave vídeos em resolução menor no dia a dia.
- Ative a otimização de fotos na nuvem, se usar esse recurso.
- Revise o armazenamento uma vez por mês.

## O que não fazer

Evite aplicativos "limpadores" e "aceleradores" de terceiros. Eles costumam pedir muitas permissões, exibir publicidade agressiva e entregar pouco além do que as próprias configurações do sistema já fazem.$md$,
'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Fliberar-espaco-no-celular.jpg',
'Mãos segurando celular com a galeria de fotos aberta',
(select id from public.categories where slug = 'vida-digital'),
'Equipe EmSegundos',
'2026-09-15T12:00:00Z','2026-09-15T12:00:00Z','published',5,
'Celular sem espaço: como liberar memória',
'A ordem certa para liberar espaço no celular, do cache dos apps às fotos, sem perder o que importa.',
'[]'::jsonb, array['celular','armazenamento','organização digital'], false
),
(
'Bateria do celular: mitos e verdades sobre como carregar',
'bateria-do-celular-mitos-e-verdades',
'Deixar carregando a noite toda estraga? Precisa deixar zerar? Separamos o que realmente afeta a vida útil da bateria.',
$md$**Em segundos:** o que mais desgasta a bateria é calor e passar muito tempo perto de 100% ou de 0%. Manter a carga entre 20% e 80% na rotina e evitar sol e superfícies quentes faz mais diferença que qualquer truque.

## Mito: é preciso deixar a bateria zerar

Isso valia para baterias antigas, de níquel. As baterias de íon-lítio dos celulares atuais preferem cargas parciais e frequentes. Deixar chegar a 0% com frequência acelera o desgaste.

## Verdade: calor é o maior inimigo

Carregar embaixo do travesseiro, deixar o celular no painel do carro ao sol ou jogar por horas enquanto carrega aquece a bateria e reduz a capacidade ao longo do tempo. Se o aparelho esquentar muito, tire a capa e pause o uso.

## Parcialmente verdade: carregar a noite toda faz mal

O celular moderno para de puxar carga ao completar 100%, então não há sobrecarga. O que desgasta é ficar muitas horas em carga cheia. Se o seu aparelho tem "carregamento otimizado" ou limite de 80%, ative — é exatamente para isso.

## Mito: carregador de outra marca sempre estraga

O problema não é a marca, é a qualidade. Use carregadores e cabos certificados, com potência compatível. Produtos muito baratos e sem certificação são risco real de superaquecimento.

## Verdade: carregamento rápido aquece mais

Ele é seguro, mas gera mais calor. Para uso diário sem pressa, um carregamento comum é mais gentil com a bateria.

## O que faz a carga durar mais no dia

- Reduza o brilho da tela e use o ajuste automático.
- Diminua o tempo de tela acesa.
- Desligue localização para apps que não precisam dela.
- Ative o modo de economia quando estiver longe de tomada.
- Feche gravação de vídeo e jogos quando não estiver usando.

## Quando trocar a bateria

Se o celular desliga com carga pela metade, esquenta em uso leve, incha ou a saúde da bateria caiu para perto de 80% da capacidade original, o caminho é substituição em assistência técnica. Bateria inchada não deve ser perfurada nem descartada no lixo comum: leve a um ponto de coleta de eletrônicos.$md$,
'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Fbateria-do-celular-mitos-e-verdades.jpg',
'Celular carregando na mesa de cabeceira com bateria baixa na tela',
(select id from public.categories where slug = 'vida-digital'),
'Equipe EmSegundos',
'2026-09-16T12:00:00Z','2026-09-16T12:00:00Z','published',6,
'Bateria do celular: mitos e verdades',
'O que realmente desgasta a bateria do celular e como carregar para ela durar mais tempo.',
'[]'::jsonb, array['celular','bateria','tecnologia'], false
);