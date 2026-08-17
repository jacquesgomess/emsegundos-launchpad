UPDATE public.posts
SET content = replace(content, 'É a opção mais caraseja em kit de dois ou três pontos.', 'É a opção mais caPRA, geralmente vendida em kit de dois ou três pontos.')
WHERE slug = 'repetidor-roteador-ou-mesh';
UPDATE public.posts
SET content = replace(content, 'mais caPRA,', 'mais cara,')
WHERE slug = 'repetidor-roteador-ou-mesh';