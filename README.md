# Quatuor Sauvage — site

Site statique, sans framework ni étape de build. HTML + une feuille de style + un
petit script vanilla. Prévu pour GitHub Pages avec un nom de domaine personnalisé.

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
CNAME                 nom de domaine — à modifier
.nojekyll             empêche GitHub de retraiter le site
robots.txt sitemap.xml
```

---

## À remplacer avant la mise en ligne

Tous les emplacements à compléter sont marqués **`▸▸`** dans les fichiers.
`grep -rn "▸▸" .` les liste tous.

| Quoi | Où |
|---|---|
| Nom de domaine `www.quatuorsauvage.com` | `CNAME`, `robots.txt`, `sitemap.xml`, balises `<link rel="canonical">` / `og:` de chaque page |
| Accroche du héros | `index.html` et `en/index.html`, `<p class="hero-tagline">` |
| Identifiant vidéo `VIDEO_ID` | accueil + page médias, FR et EN |
| Phrase de présentation de la vidéo | accueil, `<p class="lede">` du bloc « À l'affiche » |
| Adresses e-mail | recherche/remplacement de `contact@quatuorsauvage.com` et `booking@quatuorsauvage.com` |
| Liens réseaux sociaux | `https://www.instagram.com/` etc. |
| Crédits photo | `<figcaption>` de `media.html` et `en/media.html` |
| Mentions légales | adresse du siège, n° RNA, SIRET, directeur de la publication |

## Les images

Déposer les fichiers dans `/images/` **avec exactement ces noms** — aucune
modification de code n'est nécessaire.

| Fichier | Format conseillé | Usage |
|---|---|---|
| `hero.jpg` | paysage, ≥ 2400 px de large | photo plein écran de l'accueil |
| `portrait-fabian.jpg` | portrait 3:4, ≥ 900 px | bio |
| `portrait-helia.jpg` | portrait 3:4 | bio |
| `portrait-carolina.jpg` | portrait 3:4 | bio |
| `portrait-william.jpg` | portrait 3:4 | bio |
| `quartet-01.jpg` … `quartet-09.jpg` | libre (recadrage automatique) | grille médias + aperçu accueil |
| `contact.jpg` | paysage large | bandeau bas de la page contact |
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

## Mise en ligne (GitHub Pages)

1. Créer un dépôt (public) et y pousser le contenu de ce dossier à la racine.
2. `Settings ▸ Pages ▸ Source : Deploy from a branch`, branche `main`, dossier `/ (root)`.
3. Renseigner le domaine dans `Settings ▸ Pages ▸ Custom domain` (il doit
   correspondre au fichier `CNAME`), puis cocher **Enforce HTTPS**.
4. Chez le registrar du domaine, créer :
   - un enregistrement `CNAME` pour `www` → `<utilisateur>.github.io`
   - et, pour le domaine nu, quatre enregistrements `A` vers
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.

Le certificat HTTPS peut mettre quelques minutes à être délivré.

## Aperçu en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Un simple double-clic sur `index.html` ne suffit pas : les chemins commencent par
`/`, il faut un serveur.

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
