# Quatuor Sauvage — site

Site statique, sans framework ni étape de build. HTML + une feuille de style + un
petit script vanilla. Prévu pour GitHub Pages — les chemins sont relatifs,
le site fonctionne donc aussi bien sous un sous-dossier de projet
(`utilisateur.github.io/depot/`) qu'à la racine d'un domaine.

```
/                     français (racine)
  index.html          accueil : héros, à l'affiche, ensemble + 4 bios, aperçu médias
  media.html          photos (visionneuse) + vidéos
  contact.html        coordonnées
  mentions-legales.html
/en/                  anglais (mêmes pages)
  index.html  media.html  contact.html  legal-notice.html
/css/style.css        toute la mise en forme
/js/main.js           menu plein écran, barre de nav, apparitions, visionneuse
/fonts/               polices auto-hébergées (.woff2) — ne pas renommer
/images/              tous les visuels (actuellement des gabarits gris)
CNAME                 (absent) — à créer le jour où un domaine est enregistré
.nojekyll             empêche GitHub de retraiter le site
robots.txt sitemap.xml
```

---

## À remplacer avant la mise en ligne

Tous les emplacements à compléter sont marqués **`▸▸`** dans les fichiers.
`grep -rn "▸▸" .` les liste tous.

| Quoi | Où |
|---|---|
| Nom de domaine (une fois enregistré) | `CNAME` (à recréer), `robots.txt`, `sitemap.xml`, et les balises `canonical` / `hreflang` / `og:` commentées en tête de chaque page |
| Accroche du héros | `index.html` et `en/index.html`, `<p class="hero-tagline">` |
| Identifiant vidéo `VIDEO_ID` | accueil + page médias, FR et EN |
| Phrase de présentation de la vidéo | accueil, `<p class="lede">` du bloc « À l'affiche » |
| Mentions légales | adresse du siège, n° RNA, SIRET, directeur de la publication |

Faits : adresses e-mail (`quatuorsauvage@gmail.com`), liens Instagram et YouTube,
crédits photo (Élise De-Bendelac | Photographie). Facebook a été retiré du site.
Ces trois éléments sont répétés sur les huit pages : les modifier veut dire
passer partout (`grep -rn` reste le plus sûr).

## Les images

Déposer les fichiers dans `/images/` **avec exactement ces noms** — aucune
modification de code n'est nécessaire.

| Fichier | Format conseillé | Usage |
|---|---|---|
| `hero.jpg` | paysage, ≥ 2400 px de large | photo plein écran de l'accueil |
| `hero-vertical.jpg` | portrait, ≥ 1400 px de large | même emplacement, sur écran étroit tenu à la verticale (sert aussi de fond au menu) |
| `portrait-fabian.jpg` | portrait 3:4, ≥ 900 px | bio |
| `portrait-helia.jpg` | portrait 3:4 | bio |
| `portrait-carolina.jpg` | portrait 3:4 | bio |
| `portrait-william.jpg` | portrait 3:4 | bio |
| `quartet-01.jpg` … `quartet-09.jpg` | libre (recadrage automatique) | grille médias + aperçu accueil |
| `contact.jpg` | paysage large | bandeau bas de la page contact — affiché entier, sans recadrage : **c'est le format du fichier qui fixe la hauteur du bandeau** |
| `contact-vertical.jpg` | portrait, ≥ 1400 px de large | même bandeau, sur écran étroit tenu à la verticale |

En remplaçant l'une de ces deux photos par une image d'un autre format, penser à
reporter ses dimensions dans les attributs `width` / `height` du bloc `<picture>`
de `contact.html` et `en/contact.html` : ils servent à réserver la place avant
l'arrivée de la photo.
| `og-image.jpg` | **1200 × 630 px exactement** | vignette de partage réseaux sociaux |

Ajouter une photo à la grille : dupliquer un bloc `<figure>` dans `media.html`.
La grille se réorganise seule et la visionneuse prend la nouvelle image en compte
automatiquement.

Conseil : exporter en JPEG qualité 80 et ≤ 2400 px de large. Le site n'a pas de
compression automatique.

## Le bloc « À l'affiche »

C'est **un seul créneau**, pas un fil d'actualité : une vidéo et une phrase.
Pour l'actualiser, on remplace le contenu du bloc — la page ne vieillit jamais et
il n'y a jamais de liste de dates clairsemée à assumer.

## Chemins : tout est relatif

Aucun chemin interne ne commence par `/`. Depuis la racine on écrit
`css/style.css`, depuis `/en/` on écrit `../css/style.css`, et dans la feuille
de style les `url()` sont relatives au fichier CSS lui-même (`../fonts/…`).

C'est ce qui permet au site de fonctionner **au même endroit dans les deux
cas** : servi sous un sous-dossier (`utilisateur.github.io/depot/`, le cas d'un
dépôt de projet) comme à la racine d'un domaine (`quatuorsauvage.com/`). Des
chemins absolus (`/css/style.css`) casseraient dans le premier cas, puisqu'ils
seraient cherchés à `utilisateur.github.io/css/style.css`.

Corollaire à retenir en ajoutant une page : ne jamais écrire `href="/quelque-
chose"`. Depuis la racine, `href="media.html"` ; depuis `/en/`,
`href="../media.html"`.

## Mise en ligne (GitHub Pages)

1. Créer un dépôt public et y pousser le contenu de ce dossier à la racine.
2. `Settings ▸ Pages ▸ Source : Deploy from a branch`, branche `main`,
   dossier `/ (root)`.
3. Le site est en ligne à `https://<utilisateur>.github.io/<dépôt>/`.

### Plus tard, avec un nom de domaine

1. Créer un fichier `CNAME` à la racine, contenant le domaine et rien d'autre
   (ex. `www.quatuorsauvage.com`).
2. `Settings ▸ Pages ▸ Custom domain` : y saisir le même domaine, puis cocher
   **Enforce HTTPS**. Le certificat met quelques minutes à être délivré.
3. Chez le registrar :
   - un enregistrement `CNAME` pour `www` → `<utilisateur>.github.io`
   - pour le domaine nu, quatre enregistrements `A` vers
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
4. Réactiver les balises `canonical`, `hreflang` et `og:` commentées en tête des
   huit pages (`grep -rn "▸▸ DOMAINE" .`), en y mettant le vrai domaine, puis
   mettre à jour `sitemap.xml` et `robots.txt`.

Les chemins internes, eux, n'ont rien à changer.

## Aperçu en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Un simple double-clic sur `index.html` ouvre bien la page, mais le menu et la
visionneuse ont besoin d'un serveur pour se comporter normalement.

## Notes techniques

- Aucune dépendance, aucun cookie, aucun traceur. Les vidéos passent par
  `youtube-nocookie.com` (pas de cookie tant qu'on ne lance pas la lecture).
- Polices : Cormorant Garamond + Inter, **auto-hébergées** dans `/fonts/`
  (fichiers `.woff2`, sous-ensembles latin et latin-ext, licence SIL OFL 1.1).
  Rien n'est chargé depuis Google Fonts : pas de connexion à un serveur tiers,
  ce qui simplifie la conformité RGPD. Les `@font-face` sont en tête de
  `css/style.css`.
- Bandeau de navigation : fond `--band` (un ton plus profond que le papier)
  recouvert d'un grain fin `--grain` — un SVG `feTurbulence` encodé en URI de
  données, donc aucun fichier image à gérer. `--band`, `--band-rule` et
  `--grain-size` sont en tête de `css/style.css` : changer la teinte, c'est
  modifier une ligne. Sur la page d'accueil le bandeau reste transparent
  au-dessus de la photo et apparaît en fondu au défilement ; sur les pages
  intérieures il est visible d'emblée (classe `is-solid` posée dans le HTML).
- Menu plein écran : la photo `/images/hero.jpg` sert de fond, très assombrie.
  L'assombrissement se fait en deux temps dans `css/style.css` — `.overlay::before`
  porte l'image (`brightness` écrase les hautes lumières, `opacity` la fond dans
  le noir) et `.overlay::after` pose un voile `rgba(26,25,23,0.62)` par-dessus.
  Conséquence utile : le contraste du texte ne dépend pas de la photo choisie.
  Pour rendre l'image plus présente, monter l'`opacity` de `.overlay::before` ou
  baisser le voile — mais vérifier que les liens restent lisibles.
  La page courante s'affiche en italique dans le ton chaud `--night-accent`.
- Pied de page « clair-obscur » : fond profond `--night`, lumière rasante en
  diagonale (un dégradé sur `.footer::before`), grain en surimpression
  (`.footer::after`), composition centrée — marque, ligne de villes, rang de
  liens séparés par des losanges, icônes sociales, mentions. Les quatre
  variables `--night`, `--night-ink`, `--night-soft` et `--night-dim` pilotent
  l'ensemble ; l'angle et l'intensité de la lumière sont dans le dégradé de
  `.footer::before`. Les icônes sociales sont des SVG en ligne (tracé, pas de
  fichier ni de police d'icônes) : elles héritent de `currentColor`.
  Le pied de page est identique sur les huit pages — modifier un lien veut
  dire le modifier dans les quatre fichiers de la langue concernée.
- Accessibilité : lien d'évitement, focus visible, `aria-expanded` sur le menu,
  visionneuse pilotable au clavier (`Échap`, `←`, `→`), `prefers-reduced-motion`
  respecté.
- Les deux langues partagent la même feuille de style et le même script.
