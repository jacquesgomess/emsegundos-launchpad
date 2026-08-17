
UPDATE public.posts SET
  cover_image_url = 'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Fwifi-fraco-como-melhorar-o-sinal.jpg',
  cover_image_alt = 'Roteador Wi-Fi branco sobre um móvel de madeira em uma sala de estar clara',
  og_image_url = 'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Fwifi-fraco-como-melhorar-o-sinal.jpg',
  related_post_ids = ARRAY['8540bc7e-0a1b-4478-8d56-c6d3ebfc2b1b','2b4d2478-21ca-4057-96a8-62b57fe96cdb']::uuid[]
WHERE slug = 'wifi-fraco-como-melhorar-o-sinal';

UPDATE public.posts SET
  cover_image_url = 'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Frepetidor-roteador-ou-mesh.jpg',
  cover_image_alt = 'Um repetidor de sinal, um roteador com antenas e dois pontos de sistema Mesh lado a lado sobre uma mesa clara',
  og_image_url = 'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Frepetidor-roteador-ou-mesh.jpg',
  tags = ARRAY['wi-fi','mesh','repetidor','roteador']::text[],
  reading_minutes = 6,
  status = 'published',
  published_at = now(),
  author_name = COALESCE(author_name, 'Equipe EmSegundos'),
  related_post_ids = ARRAY['714c9914-5287-41bf-b307-b0953f3528b0','2b4d2478-21ca-4057-96a8-62b57fe96cdb']::uuid[],
  content = $md$
Quando o Wi-Fi não chega bem em toda a casa, aparecem três caminhos possíveis: instalar um repetidor, trocar o roteador ou montar um sistema Mesh. Eles resolvem problemas diferentes, e escolher pelo preço costuma levar à frustração. Abaixo, o que cada opção faz e em que situação ela tende a fazer mais sentido.

## Antes de escolher, entenda o problema

Duas situações parecidas na aparência pedem soluções diferentes:

- **Falta de alcance**: o sinal é bom perto do roteador e piora ou desaparece em cômodos distantes, na laje, no quintal ou atrás de paredes grossas.
- **Falta de capacidade**: o sinal aparece cheio, mas a navegação trava quando várias pessoas usam a rede ao mesmo tempo, especialmente com vídeo e chamadas.

Antes de comprar qualquer equipamento, vale testar os ajustes gratuitos de posição e configuração. Reunimos esses ajustes em [8 formas de melhorar o sinal antes de gastar](/artigos/wifi-fraco-como-melhorar-o-sinal).

## Repetidor de sinal

Um repetidor capta o sinal do roteador pelo ar e o retransmite adiante. É o equipamento mais barato e mais simples de instalar.

### Quando costuma resolver

- Um único ponto da casa sem sinal, relativamente perto do roteador.
- Uso leve nesse ponto: navegação, mensagens, streaming em um aparelho.

### Limitações a considerar

- Ele só repete o que recebe. Instalado onde o sinal já é ruim, retransmite sinal ruim.
- Parte da capacidade é usada para manter a conexão com o roteador, então a velocidade no ponto repetido tende a ser menor.
- Em muitos modelos a rede repetida tem nome próprio, e o celular não troca de rede sozinho ao andar pela casa.

## Roteador novo

Trocar o roteador faz sentido quando o aparelho atual é o gargalo, e não a distância.

### Quando costuma resolver

- O roteador é antigo, esquenta, precisa ser reiniciado com frequência ou não oferece a faixa de 5 GHz.
- O aparelho é o modelo básico entregue pela operadora e a casa tem muitos dispositivos conectados.
- O plano de internet contratado é mais rápido do que o roteador consegue entregar no Wi-Fi.

### Limitações a considerar

- Um roteador melhor amplia a capacidade, mas não vence a física das paredes: casas compridas, sobrados e paredes de concreto continuam sendo obstáculo.
- Se o roteador fica em um canto da casa ou dentro do armário, o novo equipamento herda o mesmo problema de posição.

## Sistema Mesh

Um Mesh usa dois ou mais pontos que trabalham como uma única rede, com o mesmo nome e a mesma senha. O aparelho troca de ponto automaticamente conforme você anda pela casa.

### Quando costuma resolver

- Casas grandes, compridas, com mais de um andar ou com muitas paredes.
- Necessidade de sinal estável em toda a área, e não só em um ponto.
- Chamadas de vídeo, trabalho remoto ou aulas que não podem cair ao mudar de cômodo.

### Limitações a considerar

- É a opção mais caraseja em kit de dois ou três pontos.
- Os pontos precisam ser distribuídos com critério: muito longe um do outro, a ligação entre eles fica fraca.
- Onde há cabo de rede disponível entre os ambientes, ligar os pontos por cabo tende a dar resultado mais estável do que a ligação sem fio.

## Resumo para decidir

| Situação | Caminho que costuma fazer mais sentido |
| --- | --- |
| Um ponto morto perto do roteador, uso leve | Repetidor |
| Roteador antigo ou da operadora, casa pequena | Roteador novo |
| Casa grande, sobrado, muitas paredes | Mesh |
| Sinal cheio, mas rede trava com todos usando | Roteador novo ou Mesh, priorizando capacidade |

## O que verificar antes de comprar

1. Onde exatamente o sinal falha, e em quais horários.
2. Quantos aparelhos usam a rede ao mesmo tempo.
3. Qual a velocidade contratada e quanto chega por cabo perto do roteador.
4. Se existe tomada e espaço para instalar o novo equipamento no lugar certo, e não onde sobrou espaço.
5. Se o modelo escolhido permite usar o mesmo nome de rede em todos os pontos.

Com essas respostas, a escolha deixa de ser um palpite. E se o problema for só posição, o próximo passo é [onde colocar o roteador em casa](/artigos/onde-colocar-o-roteador).
$md$
WHERE slug = 'repetidor-roteador-ou-mesh';

UPDATE public.posts SET
  cover_image_url = 'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Fonde-colocar-o-roteador.jpg',
  cover_image_alt = 'Roteador Wi-Fi branco instalado em posição alta em um corredor central de uma casa',
  og_image_url = 'https://smkieournklrfsaerfhs.supabase.co/storage/v1/object/public/blog-images/capas%2Fonde-colocar-o-roteador.jpg',
  tags = ARRAY['wi-fi','roteador','casa conectada']::text[],
  reading_minutes = 4,
  status = 'published',
  published_at = now(),
  author_name = COALESCE(author_name, 'Equipe EmSegundos'),
  related_post_ids = ARRAY['714c9914-5287-41bf-b307-b0953f3528b0','8540bc7e-0a1b-4478-8d56-c6d3ebfc2b1b']::uuid[],
  content = $md$
O lugar do roteador muda o alcance do Wi-Fi mais do que a maioria das pessoas imagina. O sinal se espalha em todas as direções e perde força ao atravessar obstáculos, então cada parede, móvel ou aparelho no caminho reduz o que chega ao outro lado da casa.

## Como o sinal se comporta

- O alcance é maior em linha reta e sem obstáculos.
- Concreto, alvenaria com muito ferro, espelhos e superfícies metálicas absorvem ou refletem boa parte do sinal.
- Água absorve sinal, por isso aquários e caixas d'água no caminho atrapalham.
- A faixa de 5 GHz é mais rápida, mas atravessa paredes com mais dificuldade do que a de 2,4 GHz. Quanto mais obstáculos, mais a posição pesa.

## Os melhores lugares

### Ponto central da casa

Instalado no centro da área usada, o roteador distribui sinal para os lados em vez de jogar metade dele para a rua. Em apartamentos, isso costuma ser o corredor ou a sala.

### Em altura, acima dos móveis

Sobre um móvel alto, uma estante ou fixado na parede, o sinal encontra menos obstáculos do que no chão ou atrás da TV.

### Em espaço aberto e ventilado

O equipamento precisa dissipar calor. Espaço livre ao redor ajuda no desempenho e na vida útil.

### Perto dos ambientes de uso intenso

Se o trabalho remoto acontece em um quarto específico, aproximar o roteador desse ambiente costuma render mais do que centralizar por regra.

## Os piores lugares

- **Dentro do armário ou do rack fechado**: madeira, portas e outros equipamentos abafam o sinal.
- **No chão ou atrás do sofá**: o sinal se perde no piso e nos móveis.
- **Na cozinha, junto ao micro-ondas**: o micro-ondas em funcionamento interfere na faixa de 2,4 GHz.
- **Colado em paredes de concreto ou em quadros metálicos**: parte do sinal é refletida de volta.
- **Ao lado da caixa d'água ou do aquário**: a água absorve o sinal.
- **Em um canto extremo da casa**: metade da cobertura vai para fora.

## Detalhes que ajudam

- Antenas externas costumam funcionar melhor na vertical, para espalhar o sinal no plano horizontal da casa.
- Se o ponto de entrada da internet fica em um canto, um cabo de rede até a posição central resolve a limitação sem trocar de equipamento.
- Depois de mudar o roteador de lugar, teste o sinal nos pontos onde havia queda antes de concluir que precisa comprar algo.

## Quando a posição não é suficiente

Em casas grandes, sobrados ou plantas muito recortadas, nenhuma posição cobre tudo. Nesses casos, o passo seguinte é escolher entre [repetidor, roteador novo ou Mesh](/artigos/repetidor-roteador-ou-mesh). E se você ainda não passou pelos ajustes básicos, comece pelas [8 formas de melhorar o sinal antes de gastar](/artigos/wifi-fraco-como-melhorar-o-sinal).
$md$
WHERE slug = 'onde-colocar-o-roteador';
